import { RectifyStatusText } from "../constants/RectifyStatus";
import { RecheckConclusionText } from "../constants/RecheckConclusion";

export const formatDate = (value: string) => (value ? new Date(value).toLocaleString("zh-CN") : "—");
/** 隐患单列表只展示日期部分（YYYY-MM-DD） */
export const formatDay = (value: string) => {
  if (!value) return "—";
  const match = /^(\d{4}-\d{2}-\d{2})/.exec(value);
  return match ? match[1] : value;
};
export const formatStatus = (value: string) => value.replace(/_/g, " ");
export const formatNumber = (value: number) => new Intl.NumberFormat("zh-CN").format(value);
export const formatRisk = (value: string) => ({ LOW: "低", MEDIUM: "中", HIGH: "高", CRITICAL: "严重", EXTREME: "极高" }[value] ?? value);
/** 隐患整改状态：优先用后端枚举文案，未知值回退原文 */
export const formatRectifyStatus = (value: string) => (RectifyStatusText as Record<string, string>)[value] ?? value;
/** 复验结论文案 */
export const formatRecheckConclusion = (value: string) => (RecheckConclusionText as Record<string, string>)[value] ?? value;
