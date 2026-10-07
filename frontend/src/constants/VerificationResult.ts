/** 复验结论。 */
export const VerificationResult = ["PASS", "FAIL"] as const;
export type VerificationResult = (typeof VerificationResult)[number];

export const VerificationResultText: Record<VerificationResult, string> = {
  PASS: "复验通过",
  FAIL: "复验未通过"
};
