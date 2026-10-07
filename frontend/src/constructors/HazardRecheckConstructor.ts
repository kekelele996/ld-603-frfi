import type { HazardRecheckForm } from "../types/HazardRecheck";

/** 复验表单默认：复验日期为今天，结论默认未过（需续整改期限的常见场景） */
export const createRecheckForm = (overrides: Partial<HazardRecheckForm> = {}): HazardRecheckForm => {
  const today = new Date();
  const recheck_date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const next = new Date(today);
  next.setDate(next.getDate() + 3);
  const next_deadline = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}-${String(next.getDate()).padStart(2, "0")}`;
  return { recheck_date, inspector_name: "", conclusion: "FAIL", next_deadline, ...overrides };
};

export const createRectifyNoteForm = (rectify_note = "") => ({ rectify_note });
