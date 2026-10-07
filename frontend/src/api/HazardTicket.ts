import { mockData } from "../mocks/seedData";
import { enrichTickets } from "../utils/hazardDerivation";
import type { HazardTicket } from "../types/HazardTicket";
import type { Verification } from "../types/Verification";

const endpoint = "/api/hazard-ticket";

type RawTicket = HazardTicket;

/** 后端返回已带派生字段；离线/失败时用本地种子按同一规则推导。 */
function toViewRows(rows: RawTicket[]): HazardTicket[] {
  if (rows.length && "effective_deadline" in rows[0]) return rows;
  return enrichTickets(rows, mockData.verification, mockData.inspectionResult);
}

export async function listHazardTicket(): Promise<HazardTicket[]> {
  try {
    const res = await fetch(endpoint);
    if (res.ok) return toViewRows(await res.json());
  } catch {
    // Local mock fallback keeps the UI available during offline review.
  }
  return enrichTickets(
    mockData.hazardTicket.map((row) => ({ ...row })),
    mockData.verification,
    mockData.inspectionResult
  );
}

export interface RectifyNoteForm {
  rectify_note: string;
}

export interface VerificationForm {
  verified_at: string;
  inspector: string;
  result: "PASS" | "FAIL";
  note: string;
  new_deadline: string;
}

async function post<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const detail = (await res.json().catch(() => null))?.detail;
    throw new Error(detail?.message || `保存失败（${res.status}）`);
  }
  return res.json();
}

/** 整改人补录整改说明 */
export async function saveRectifyNote(ticketId: number, form: RectifyNoteForm): Promise<HazardTicket> {
  return post<HazardTicket>(`${endpoint}/${ticketId}/rectify-note`, form);
}

/** 补记复验：复验日期、复验人、结论（可附新整改期限） */
export async function saveVerification(ticketId: number, form: VerificationForm): Promise<HazardTicket> {
  return post<HazardTicket>(`${endpoint}/${ticketId}/verification`, form);
}

export type { Verification };
