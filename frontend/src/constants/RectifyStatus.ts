export const RectifyStatus = ["PENDING", "RECTIFYING", "RECHECK_FAILED", "CLOSED"] as const;
export type RectifyStatus = (typeof RectifyStatus)[number];
export const RectifyStatusText: Record<RectifyStatus, string> = {
  PENDING: "待整改",
  RECTIFYING: "整改中",
  RECHECK_FAILED: "复验未过",
  CLOSED: "已关闭"
};
