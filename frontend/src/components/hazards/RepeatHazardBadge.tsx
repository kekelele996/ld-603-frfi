import type { RepeatRecheckRef } from "../../types/HazardTicket";

/**
 * 重复隐患标记：同一台设备最近两次复验都没过时，在列表行内高亮，
 * title 写明是哪两次复验（隐患单号/复验日期/复验人/结论）。
 */
export function RepeatHazardBadge({ refs, detail }: { refs: RepeatRecheckRef[]; detail: string }) {
  if (!refs.length) return null;
  return (
    <span className="badge badge-repeat" title={detail}>
      重复隐患 · 最近两次复验未过
    </span>
  );
}
