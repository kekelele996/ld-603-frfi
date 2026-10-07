import type { RectifyStatus } from "../constants/RectifyStatus";
import type { Verification, RepeatHazardDetail } from "./Verification";

export interface HazardTicket {
  id: number;
  result_id: number;
  severity: string;
  owner_id: number;
  owner_name: string;
  /** 建单时的原始整改期限 */
  deadline: string;
  rectify_note: string;
  rectified_at: string;
  closed_at: string;

  // —— 以下为以后端复验记录为准的派生字段（离线 mock 时由前端推导补齐）——
  /** 复验结论推导后的整改状态 */
  rectify_status?: RectifyStatus | string;
  /** 复验不过给出新期限后，以新期限为准 */
  effective_deadline?: string;
  overdue?: boolean;
  device_id?: number;
  device_code?: string;
  location_desc?: string;
  latest_verification?: Verification | null;
  verifications?: Verification[];
  repeat_hazard?: boolean;
  repeat_detail?: RepeatHazardDetail | null;
}
