import type { RepeatHazardDetail } from "../../types/Verification";

/** 重复隐患标记：同一台设备最近两次复验都未通过，写明是哪两次。 */
export function RepeatHazardTag({ detail }: { detail: RepeatHazardDetail }) {
  return (
    <div className="repeat-hazard" title={detail.label}>
      <span className="repeat-hazard-icon">⚠</span>
      <div>
        <strong>重复隐患</strong>
        <p>
          第{detail.first_ticket_id}单 {detail.first_verified_at} {detail.first_inspector} 复验未通过；
          第{detail.second_ticket_id}单 {detail.second_verified_at} {detail.second_inspector} 复验仍未通过
        </p>
      </div>
    </div>
  );
}
