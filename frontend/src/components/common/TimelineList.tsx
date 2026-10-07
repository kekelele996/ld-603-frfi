import { StatusBadge } from "./StatusBadge";
import { formatDay, formatRecheckConclusion } from "../../utils/formatters";

export interface TimelineEntry {
  key?: string | number;
  title: string;
  time?: string;
  meta?: string;
  tone?: string;
}

/**
 * 隐患复验/整改时间线。
 * 旧用法 <TimelineList title value /> 仍可用；传入 entries 时渲染真实时间线。
 */
export function TimelineList({
  title = "TimelineList",
  value,
  entries = []
}: {
  title?: string;
  value?: string;
  entries?: TimelineEntry[];
}) {
  if (!entries.length) {
    return <div className="shared-widget"><strong>{title}</strong>{value ? <StatusBadge value={value} /> : null}</div>;
  }
  return (
    <div className="timeline">
      <strong className="timeline-title">{title}</strong>
      <ol>
        {entries.map((entry, index) => (
          <li key={entry.key ?? index} className={`timeline-item ${entry.tone ?? ""}`}>
            <span className="timeline-dot" />
            <div>
              <p className="timeline-text">{entry.title}</p>
              <p className="timeline-meta">
                {entry.time ? formatDay(entry.time) : ""}
                {entry.time && entry.meta ? " · " : ""}
                {entry.meta ?? ""}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** 复验记录转时间线条目，最近一次排最后 */
export function buildRecheckTimelineEntries(
  rechecks: Array<{ id: number; recheck_date: string; inspector_name: string; conclusion: string }>
): TimelineEntry[] {
  return rechecks.map((recheck) => ({
    key: recheck.id,
    title: formatRecheckConclusion(recheck.conclusion),
    time: recheck.recheck_date,
    meta: `复验人：${recheck.inspector_name}`,
    tone: recheck.conclusion === "PASS" ? "pass" : "fail"
  }));
}
