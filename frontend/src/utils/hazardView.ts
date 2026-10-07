import type { HazardTicket, RepeatRecheckRef } from "../types/HazardTicket";
import type { HazardRecheck } from "../types/HazardTicket";

/** 最近一次复验（补记顺序即时间顺序） */
export const latestRecheck = (ticket: HazardTicket): HazardRecheck | undefined =>
  ticket.rechecks && ticket.rechecks.length > 0 ? ticket.rechecks[ticket.rechecks.length - 1] : undefined;

/** 整改状态改用最近一次复验结论；未复验时回退到整改说明补录情况 */
export const deriveRectifyStatus = (ticket: HazardTicket): string => {
  const last = latestRecheck(ticket);
  if (last) return last.conclusion === "PASS" ? "CLOSED" : "RECHECK_FAILED";
  return ticket.rectify_note ? "RECTIFYING" : "PENDING";
};

/** 整改期限改用最近一次复验结论：未过取续定期限，通过后不再占用期限 */
export const deriveDeadline = (ticket: HazardTicket): string => {
  const last = latestRecheck(ticket);
  if (!last) return ticket.deadline;
  if (last.conclusion === "PASS") return "";
  return last.next_deadline || ticket.deadline;
};

const toRef = (ticketId: number, recheck: HazardRecheck): RepeatRecheckRef => ({
  ticket_id: ticketId,
  recheck_id: recheck.id,
  recheck_date: recheck.recheck_date,
  inspector_name: recheck.inspector_name,
  conclusion: recheck.conclusion
});

/**
 * 同一台设备最近两次复验都没过：把这两次复验关联的最近一张单标为重复隐患，
 * 并写明是哪两次。返回 Map<ticketId, [最近一次, 上一次]>。
 */
export function findRepeatHazardPairs(rows: HazardTicket[]): Map<number, RepeatRecheckRef[]> {
  const byDevice = new Map<number, Array<{ ticket: HazardTicket; recheck: HazardRecheck }>>();
  rows.forEach((ticket) => {
    (ticket.rechecks || []).forEach((recheck) => {
      const list = byDevice.get(ticket.device_id) ?? [];
      list.push({ ticket, recheck });
      byDevice.set(ticket.device_id, list);
    });
  });
  const pairs = new Map<number, RepeatRecheckRef[]>();
  byDevice.forEach((entries) => {
    entries.sort((a, b) =>
      (a.recheck.recheck_date || "").localeCompare(b.recheck.recheck_date || "") ||
      (a.recheck.created_at || "").localeCompare(b.recheck.created_at || "")
    );
    if (entries.length >= 2) {
      const last = entries[entries.length - 1];
      const prev = entries[entries.length - 2];
      if (last.recheck.conclusion === "FAIL" && prev.recheck.conclusion === "FAIL") {
        pairs.set(last.ticket.id, [toRef(last.ticket.id, last.recheck), toRef(prev.ticket.id, prev.recheck)]);
      }
    }
  });
  return pairs;
}

/** 列表顶部计数：整改状态分布 + 重复隐患数 */
export function summarizeHazards(rows: HazardTicket[]) {
  const counts = { PENDING: 0, RECTIFYING: 0, RECHECK_FAILED: 0, CLOSED: 0, repeat: 0 };
  rows.forEach((ticket) => {
    const status = ticket.effective_status || deriveRectifyStatus(ticket);
    if (status in counts) counts[status as keyof typeof counts] += 1;
    if (ticket.repeat_hazard) counts.repeat += 1;
  });
  return counts;
}

/** 离线 mock 回退时在前端补全派生字段 */
export function enrichHazardTickets(raw: HazardTicket[]): HazardTicket[] {
  const pairs = findRepeatHazardPairs(raw);
  return raw.map((ticket) => {
    const refs = pairs.get(ticket.id) ?? [];
    const repeatDetail = refs.length
      ? "该设备最近两次复验均未通过：" +
        refs
          .map((ref) => `隐患单#${ref.ticket_id} ${ref.recheck_date} ${ref.inspector_name}复验${ref.conclusion === "FAIL" ? "复验未过" : "复验通过"}`)
          .join("；") +
        "。"
      : "";
    return {
      ...ticket,
      effective_status: deriveRectifyStatus(ticket),
      effective_deadline: deriveDeadline(ticket),
      repeat_hazard: refs.length > 0,
      repeat_rechecks: refs,
      repeat_detail: repeatDetail
    };
  });
}
