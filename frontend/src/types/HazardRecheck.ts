/** 复验补记表单 */
export interface HazardRecheckForm {
  recheck_date: string;
  inspector_name: string;
  conclusion: string;
  /** 复验未过时续定的整改期限，通过时为空 */
  next_deadline: string;
}

/** 整改说明补录表单 */
export interface RectifyNoteForm {
  rectify_note: string;
}
