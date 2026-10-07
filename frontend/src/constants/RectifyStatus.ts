/**
 * 整改状态：有复验后一切以复验结论为准。
 * RECTIFYING 待整改 / PENDING_VERIFY 待复验 / RE_RECTIFYING 整改不合格 / CLOSED 已闭环
 */
export const RectifyStatus = ["RECTIFYING", "PENDING_VERIFY", "RE_RECTIFYING", "CLOSED"] as const;
export type RectifyStatus = (typeof RectifyStatus)[number];

export const RectifyStatusText: Record<RectifyStatus, string> = {
  RECTIFYING: "待整改",
  PENDING_VERIFY: "待复验",
  RE_RECTIFYING: "整改不合格",
  CLOSED: "已闭环"
};
