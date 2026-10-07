import { mockData } from "../mocks/seedData";
import type { HazardTicket } from "../types/HazardTicket";
import type { HazardRecheckForm, RectifyNoteForm } from "../types/HazardRecheck";
import { createRecheckForm } from "../constructors/HazardRecheckConstructor";
import { enrichHazardTickets } from "../utils/hazardView";

const endpoint = "/api/hazard-ticket";

export async function listHazardTicket(): Promise<HazardTicket[]> {
  try {
    const res = await fetch(endpoint);
    if (res.ok) return await res.json();
  } catch {
    // Local mock fallback keeps the UI available during offline review.
  }
  return enrichHazardTickets([...(mockData.hazardTicket as unknown as HazardTicket[])]);
}

export async function saveRectifyNote(ticketId: number, form: RectifyNoteForm): Promise<HazardTicket> {
  try {
    const res = await fetch(`${endpoint}/${ticketId}/rectify`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    if (res.ok) return await res.json();
    throw new Error(`rectify failed: ${res.status}`);
  } catch (error) {
    // 离线评审时回退到本地 mock，保持流程可演示
    console.info("save rectify note (mock)", ticketId, form, error);
    return mutateLocalTicket(ticketId, (ticket) => {
      ticket.rectify_note = form.rectify_note;
    });
  }
}

export async function saveRecheck(ticketId: number, form: HazardRecheckForm): Promise<HazardTicket> {
  try {
    const res = await fetch(`${endpoint}/${ticketId}/recheck`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    if (res.ok) return await res.json();
    throw new Error(`recheck failed: ${res.status}`);
  } catch (error) {
    console.info("save recheck (mock)", ticketId, form, error);
    return mutateLocalTicket(ticketId, (ticket) => {
      const rechecks = ticket.rechecks ?? [];
      rechecks.push({
        id: rechecks.reduce((max, item) => Math.max(max, item.id), 0) + 1,
        ticket_id: ticket.id,
        recheck_date: form.recheck_date,
        inspector_name: form.inspector_name,
        conclusion: form.conclusion,
        next_deadline: form.conclusion === "PASS" ? "" : form.next_deadline,
        created_at: new Date().toISOString()
      });
      ticket.rechecks = rechecks;
      if (form.conclusion === "PASS") ticket.closed_at = new Date().toISOString();
    });
  }
}

function mutateLocalTicket(ticketId: number, mutate: (ticket: HazardTicket) => void): HazardTicket {
  const rows = mockData.hazardTicket as unknown as HazardTicket[];
  const target = rows.find((row) => row.id === ticketId);
  if (target) mutate(target);
  const enriched = enrichHazardTickets(rows.map((row) => ({ ...row })));
  const updated = enriched.find((row) => row.id === ticketId);
  if (!updated) throw new Error("hazard ticket not found");
  return updated;
}

export { createRecheckForm };
