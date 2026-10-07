import type { HazardTicket } from "../types/HazardTicket";
import type { InspectionResult } from "../types/InspectionResult";
import type { Verification, RepeatHazardDetail } from "../types/Verification";

/**
 * 隐患单领域推导（与后端 services/hazard_domain.py 同规则）：
 * 存好复验/整改说明后，整改状态、整改期限、闭环时间、重复隐患标记
 * 一律从复验记录推导，页面/store 不得散写规则。
 */

export function sortVerifications(rows: Verification[]): Verification[] {
  return [...rows].sort((a, b) => a.verified_at.localeCompare(b.verified_at));
}

export function deriveTicketState(
  ticket: HazardTicket,
  ticketVerifications: Verification[],
  today: string
): Pick<HazardTicket, "rectify_status" | "effective_deadline" | "closed_at" | "overdue" | "latest_verification"> {
  const ordered = sortVerifications(ticketVerifications);
  const latest = ordered.length ? ordered[ordered.length - 1] : null;

  let rectifyStatus: string;
  let effectiveDeadline = ticket.deadline;
  let closedAt = ticket.closed_at || "";

  if (!latest) {
    rectifyStatus = ticket.rectify_note ? "PENDING_VERIFY" : "RECTIFYING";
  } else if (latest.result === "PASS") {
    rectifyStatus = "CLOSED";
    closedAt = latest.verified_at;
  } else {
    rectifyStatus = "RE_RECTIFYING";
    if (latest.new_deadline) effectiveDeadline = latest.new_deadline;
  }

  return {
    rectify_status: rectifyStatus,
    effective_deadline: effectiveDeadline,
    closed_at: closedAt,
    latest_verification: latest,
    overdue: rectifyStatus !== "CLOSED" && !!effectiveDeadline && effectiveDeadline < today
  };
}

/** 同一台设备最近两次复验都未通过 → 关联单标为重复隐患，写明是哪两次。 */
export function deriveRepeatHazards(
  tickets: HazardTicket[],
  verifications: Verification[],
  results: InspectionResult[]
): Record<number, RepeatHazardDetail> {
  const resultDevice = new Map(results.map((row) => [row.id, row.device_id]));
  const ticketDevice = new Map(
    tickets.map((ticket) => [ticket.id, resultDevice.get(ticket.result_id)])
  );

  const ordered = sortVerifications(verifications);
  const failed = ordered.filter((row) => row.result === "FAIL");
  if (failed.length < 2) return {};

  const first = failed[failed.length - 2];
  const second = failed[failed.length - 1];
  const deviceId = ticketDevice.get(second.ticket_id);
  if (!deviceId || ticketDevice.get(first.ticket_id) !== deviceId) return {};

  const detail: RepeatHazardDetail = {
    device_id: deviceId,
    first_ticket_id: first.ticket_id,
    first_verified_at: first.verified_at,
    first_inspector: first.inspector,
    second_ticket_id: second.ticket_id,
    second_verified_at: second.verified_at,
    second_inspector: second.inspector,
    label: `重复隐患：第${first.ticket_id}单 ${first.verified_at} ${first.inspector} 复验未通过；第${second.ticket_id}单 ${second.verified_at} ${second.inspector} 复验仍未通过`
  };
  return { [first.ticket_id]: detail, [second.ticket_id]: detail };
}

export function enrichTickets(
  tickets: HazardTicket[],
  verifications: Verification[],
  results: InspectionResult[],
  today = new Date().toISOString().slice(0, 10)
): HazardTicket[] {
  const repeats = deriveRepeatHazards(tickets, verifications, results);
  return tickets.map((ticket) => {
    const state = deriveTicketState(ticket, verifications.filter((v) => v.ticket_id === ticket.id), today);
    return {
      ...ticket,
      ...state,
      verifications: sortVerifications(verifications.filter((v) => v.ticket_id === ticket.id)),
      repeat_hazard: !!repeats[ticket.id],
      repeat_detail: repeats[ticket.id] ?? null
    };
  });
}
