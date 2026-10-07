export const RecheckConclusion = ["PASS", "FAIL"] as const;
export type RecheckConclusion = (typeof RecheckConclusion)[number];
export const RecheckConclusionText: Record<RecheckConclusion, string> = {
  PASS: "复验通过",
  FAIL: "复验未过"
};
