import { formatRisk } from "../../utils/formatters";

export function HazardSeverityTag({ value = "MEDIUM" }: { value: string }) {
  const key = String(value).toLowerCase();
  return <span className={"severity severity-" + key}>{formatRisk(value)}</span>;
}
