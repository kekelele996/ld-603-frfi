export interface HazardRecheck {
  id: number;
  ticket_id: number;
  /** 复验日期 YYYY-MM-DD */
  recheck_date: string;
  /** 复验人 */
  inspector_name: string;
  /** 复验结论：PASS 通过 / FAIL 未过 */
  conclusion: string;
  /** 复验未过时续定的整改期限 */
  next_deadline: string;
  created_at: string;
}

/** 重复隐患引用：写明是哪两次复验 */
export interface RepeatRecheckRef {
  ticket_id: number;
  recheck_id: number;
  recheck_date: string;
  inspector_name: string;
  conclusion: string;
}

export interface HazardTicket {
  id: number;
  result_id: number;
  /** 隐患所在设备，用于同一设备的重复隐患识别 */
  device_id: number;
  severity: string;
  owner_id: number;
  deadline: string;
  rectify_status: string;
  rectify_note: string;
  closed_at: string;
  rechecks: HazardRecheck[];
  /** 以下为后端按复验结论派生的字段 */
  effective_status: string;
  effective_deadline: string;
  repeat_hazard: boolean;
  repeat_rechecks: RepeatRecheckRef[];
  repeat_detail: string;
}
