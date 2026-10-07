export function StatCard({
  label,
  value,
  tone = "",
  highlight = false
}: {
  label: string;
  value: string | number;
  tone?: string;
  highlight?: boolean;
}) {
  const className = ["stat", tone && `stat-${tone}`, highlight && "stat-highlight"].filter(Boolean).join(" ");
  return (
    <div className={className}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
