import type { HazardTicket } from "../types/HazardTicket";

export const createDefaultHazardTicket = (overrides: Partial<HazardTicket> = {}): HazardTicket => ({
  id: 1,
  result_id: 1,
  device_id: 1,
  severity: "HIGH",
  owner_id: 1,
  deadline: "2026-09-15",
  rectify_status: "PENDING",
  rectify_note: "",
  closed_at: "",
  rechecks: [],
  effective_status: "PENDING",
  effective_deadline: "2026-09-15",
  repeat_hazard: false,
  repeat_rechecks: [],
  repeat_detail: "",
  ...overrides
});

export const createHazardTicketForm = createDefaultHazardTicket;
export const createHazardTicketResponse = createDefaultHazardTicket;
