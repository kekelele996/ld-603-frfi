import { RectifyStatusText } from "../constants/RectifyStatus";
import { VerificationResultText } from "../constants/VerificationResult";

export const formatDate = (value?: string) =>
  value ? new Date(value + (value.length === 10 ? "T00:00:00" : "")).toLocaleDateString("zh-CN") : "—";

export const formatStatus = (value: string) => value.replace(/_/g, " ");

export const formatNumber = (value: number) => new Intl.NumberFormat("zh-CN").format(value);

export const formatRisk = (value: string) =>
  ({ LOW: "低", MEDIUM: "中", HIGH: "高", CRITICAL: "严重", EXTREME: "极高" }[value] ?? value);

/** 整改状态统一走 RectifyStatus 文案，页面不得散写 */
export const formatRectifyStatus = (value: string) =>
  RectifyStatusText[value as keyof typeof RectifyStatusText] ?? value;

export const formatVerificationResult = (value: string) =>
  VerificationResultText[value as keyof typeof VerificationResultText] ?? value;
