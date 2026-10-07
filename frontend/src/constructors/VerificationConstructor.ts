import type { RectifyNoteForm, VerificationForm } from "../api/HazardTicket";

/** 整改人补录整改说明表单默认值 */
export const createRectifyNoteForm = (ticket?: { rectify_note?: string }): RectifyNoteForm => ({
  rectify_note: ticket?.rectify_note ?? ""
});

/** 复验补记表单默认值：日期默认今天，结论默认通过 */
export const createVerificationForm = (): VerificationForm => ({
  verified_at: new Date().toISOString().slice(0, 10),
  inspector: "",
  result: "PASS",
  note: "",
  new_deadline: ""
});
