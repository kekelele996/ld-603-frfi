import { useEffect, useMemo, useState } from "react";
import { useHazardTicketStore } from "../stores/HazardTicketStore";
import { useHazardFlow } from "../hooks/useHazardFlow";
import type { HazardTicket } from "../types/HazardTicket";
import { StatCard } from "../components/common/StatCard";
import { StatusBadge } from "../components/common/StatusBadge";
import { HazardSeverityTag } from "../components/common/HazardSeverityTag";
import { RepeatHazardTag } from "../components/hazard/RepeatHazardTag";
import { HazardTicketDrawer } from "../components/hazard/HazardTicketDrawer";
import { formatDate, formatVerificationResult } from "../utils/formatters";

type FilterKey = "ALL" | "RECTIFYING" | "PENDING_VERIFY" | "RE_RECTIFYING" | "OVERDUE" | "REPEAT" | "CLOSED";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "ALL", label: "全部" },
  { key: "RECTIFYING", label: "待整改" },
  { key: "PENDING_VERIFY", label: "待复验" },
  { key: "RE_RECTIFYING", label: "整改不合格" },
  { key: "OVERDUE", label: "已逾期" },
  { key: "REPEAT", label: "重复隐患" },
  { key: "CLOSED", label: "已闭环" }
];

function matchFilter(row: HazardTicket, filter: FilterKey): boolean {
  if (filter === "ALL") return true;
  if (filter === "OVERDUE") return !!row.overdue;
  if (filter === "REPEAT") return !!row.repeat_hazard;
  return row.rectify_status === filter;
}

export function HazardsPage() {
  const { rows, loading, saving, load, submitRectifyNote, submitVerification } = useHazardTicketStore();
  const [filter, setFilter] = useState<FilterKey>("ALL");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    void load();
  }, [load]);

  // 顶部计数：全部以复验后的结论为准（store 行已按复验记录推导）
  const counters = useMemo(() => {
    const open = rows.filter((row) => row.rectify_status !== "CLOSED");
    return {
      total: rows.length,
      rectifying: rows.filter((row) => row.rectify_status === "RECTIFYING").length,
      pendingVerify: rows.filter((row) => row.rectify_status === "PENDING_VERIFY").length,
      reRectifying: rows.filter((row) => row.rectify_status === "RE_RECTIFYING").length,
      overdue: rows.filter((row) => row.overdue).length,
      repeat: rows.filter((row) => row.repeat_hazard).length,
      closed: rows.filter((row) => row.rectify_status === "CLOSED").length,
      open: open.length
    };
  }, [rows]);

  const filtered = useMemo(() => rows.filter((row) => matchFilter(row, filter)), [rows, filter]);
  const { page, setPage, pageSize, pageRows } = useHazardFlow(filtered);
  const selected = rows.find((row) => row.id === selectedId) ?? null;

  return (
    <main className="page">
      <section className="page-head">
        <div>
          <p className="eyebrow">fire-inspect / hazard</p>
          <h1>隐患整改</h1>
          <p className="muted">复验补记后，整改状态与期限以最近一次复验结论为准。</p>
        </div>
      </section>

      <section className="metrics metrics-4">
        <StatCard label="待整改" value={counters.rectifying} tone="rectifying" />
        <StatCard label="待复验" value={counters.pendingVerify} tone="pending" />
        <StatCard label="复验不合格（重新整改）" value={counters.reRectifying} tone="re-rectifying" />
        <StatCard label="重复隐患" value={counters.repeat} tone="repeat" highlight={counters.repeat > 0} />
        <StatCard label="已逾期" value={counters.overdue} tone="overdue" highlight={counters.overdue > 0} />
        <StatCard label="未闭环合计" value={counters.open} tone="open" />
        <StatCard label="已闭环" value={counters.closed} tone="closed" />
        <StatCard label="全部隐患单" value={counters.total} tone="total" />
      </section>

      <section className="panel">
        <div className="filter-bar">
          {FILTERS.map((item) => (
            <button
              key={item.key}
              className={"chip" + (filter === item.key ? " active" : "")}
              onClick={() => {
                setFilter(item.key);
                setPage(1);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {loading && rows.length === 0 ? (
          <p className="muted">加载中…</p>
        ) : (
          <div className="table hazard-table">
            <div className="table-head">
              <span>隐患单</span><span>设备 / 位置</span><span>等级</span>
              <span>整改状态</span><span>整改期限</span><span>最近复验</span><span>维保商</span>
            </div>
            {pageRows.map((row) => (
              <article
                key={row.id}
                className={"table-row" + (row.repeat_hazard ? " is-repeat" : "") + (row.overdue ? " is-overdue" : "")}
                onClick={() => setSelectedId(row.id)}
              >
                <span>
                  <strong>#{row.id}</strong>
                  {row.repeat_hazard && row.repeat_detail && (
                    <RepeatHazardTag detail={row.repeat_detail} />
                  )}
                </span>
                <span><strong>{row.device_code}</strong><em className="muted">{row.location_desc}</em></span>
                <span><HazardSeverityTag value={row.severity} /></span>
                <span><StatusBadge value={row.rectify_status ?? "RECTIFYING"} /></span>
                <span className={row.overdue ? "text-danger" : ""}>
                  {formatDate(row.effective_deadline)}
                  {row.overdue && <em className="overdue-flag">逾期</em>}
                </span>
                <span>
                  {row.latest_verification
                    ? `${formatDate(row.latest_verification.verified_at)} · ${row.latest_verification.inspector} · ${formatVerificationResult(row.latest_verification.result)}`
                    : <em className="muted">未复验</em>}
                </span>
                <span>{row.owner_name}</span>
              </article>
            ))}
            {pageRows.length === 0 && <p className="muted empty-line">当前筛选下没有隐患单。</p>}
          </div>
        )}

        <footer className="pager">
          <button className="btn btn-ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}>上一页</button>
          <span className="muted">第 {page} 页 / 每页 {pageSize} 条（共 {filtered.length} 条）</span>
          <button
            className="btn btn-ghost"
            disabled={page * pageSize >= filtered.length}
            onClick={() => setPage(page + 1)}
          >
            下一页
          </button>
        </footer>
      </section>

      {selected && (
        <HazardTicketDrawer
          ticket={selected}
          saving={saving}
          onClose={() => setSelectedId(null)}
          onRectifyNote={submitRectifyNote}
          onVerification={submitVerification}
        />
      )}
    </main>
  );
}
