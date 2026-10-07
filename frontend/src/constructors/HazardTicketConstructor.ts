import type { HazardTicket } from "../types/HazardTicket";

export const createDefaultHazardTicket = (overrides: Partial<HazardTicket> = {}): HazardTicket => ({
  id: 0,
  result_id: 0,
  severity: "MEDIUM",
  owner_id: 0,
  owner_name: "",
  deadline: "",
  rectify_note: "",
  rectified_at: "",
  closed_at: "",
  rectify_status: "RECTIFYING",
  ...overrides
});

export const createHazardTicketForm = createDefaultHazardTicket;
export const createHazardTicketResponse = createDefaultHazardTicket;
