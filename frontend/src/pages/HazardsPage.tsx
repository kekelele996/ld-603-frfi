import { useEffect, useMemo, useState } from "react";
import { useHazardTicketStore } from "../stores/HazardTicketStore";
import { useFireDeviceStore } from "../stores/FireDeviceStore";
import { useInspectionResultStore } from "../stores/InspectionResultStore";
import { useHazardFlow } from "../hooks/useHazardFlow";
import { formatRectifyStatus } from "../utils/formatters";
import { StatCard } from "../components/common/StatCard";
import { StatusBadge } from "../components/common/StatusBadge";
import { HazardTicketCard } from "../components/hazards/HazardTicketCard";
import { RecheckDialog } from "../components/hazards/RecheckDialog";
import { RectifyNoteDialog } from "../components/hazards/RectifyNoteDialog";
import type { HazardTicket } from "../types/HazardTicket";
import type { HazardRecheckForm } from "../types/HazardRecheck";

const STATUS_FILTERS = ["ALL", "PENDING", "RECTIFYING", "RECHECK_FAILED", "CLOSED"] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

const filterText: Record<StatusFilter, string> = {
  ALL: "全部",
  PENDING: formatRectifyStatus("PENDING"),
  RECTIFYING: formatRectifyStatus("RECTIFYING"),
  RECHECK_FAILED: formatRectifyStatus("RECHECK_FAILED"),
  CLOSED: formatRectifyStatus("CLOSED")
};

export function HazardsPage() {
  const { rows, loading, saving, error, load, recordRecheck, recordRectifyNote } = useHazardTicketStore();
  const deviceStore = useFireDeviceStore();
  const resultStore = useInspectionResultStore();
  const [filter, setFilter] = useState<StatusFilter>("ALL");
  const [onlyRepeat, setOnlyRepeat] = useState(false);
  const [recheckTarget, setRecheckTarget] = useState<HazardTicket | null>(null);
  const [rectifyTarget, setRectifyTarget] = useState<HazardTicket | null>(null);

  useEffect(() => {
    void load();
    if (!deviceStore.rows.length) void deviceStore.load();
    if (!resultStore.rows.length) void resultStore.load();
  }, []);

  const deviceMap = useMemo(
    () => new Map(deviceStore.rows.map((device) => [device.id, device])),
    [deviceStore.rows]
  );
  const resultMap = useMemo(
    () => new Map(resultStore.rows.map((result) => [result.id, result])),
    [resultStore.rows]
  );

  const filtered = useMemo(
    () =>
      rows.filter(
        (ticket) =>
          (filter === "ALL" || ticket.effective_status === filter) &&
          (!onlyRepeat || ticket.repeat_hazard)
      ),
    [rows, filter, onlyRepeat]
  );

  const { pageRows, summary, page, setPage, total } = useHazardFlow(filtered);

  const submitRecheck = async (ticketId: number, form: HazardRecheckForm) => {
    await recordRecheck(ticketId, form);
  };
  const submitRectifyNote = async (ticketId: number, note: string) => {
    await recordRectifyNote(ticketId, { rectify_note: note });
  };

  return (
    <main className="page">
      <section className="page-head">
        <div>
          <p className="eyebrow">fire-inspect</p>
          <h1>隐患整改</h1>
          <p className="muted">整改状态、期限以最近一次复验结论为准；同设备连续两次复验未过标记为重复隐患。</p>
        </div>
        <StatusBadge value="RECHECK_DRIVEN" />
      </section>

      <section className="metrics">
        <StatCard label="待整改" value={summary.PENDING} />
        <StatCard label="整改中" value={summary.RECTIFYING} />
        <StatCard label="复验未过" value={summary.RECHECK_FAILED} />
        <StatCard label="已关闭" value={summary.CLOSED} />
        <StatCard label="重复隐患" value={summary.repeat} />
      </section>

      <section className="panel">
        <div className="filter-bar">
          {STATUS_FILTERS.map((value) => (
            <button
              key={value}
              className={filter === value ? "active filter-chip" : "filter-chip"}
              onClick={() => {
                setFilter(value);
                setPage(1);
              }}
            >
              {filterText[value]}
            </button>
          ))}
          <label className="repeat-check">
            <input type="checkbox" checked={onlyRepeat} onChange={(event) => { setOnlyRepeat(event.target.checked); setPage(1); }} />
            只看重复隐患
          </label>
        </div>

        {error && <p className="form-error">{error}</p>}
        {loading ? (
          <p className="muted">隐患单加载中…</p>
        ) : pageRows.length === 0 ? (
          <p className="empty">当前筛选下暂无隐患单。</p>
        ) : (
          <div className="hazard-grid">
            {pageRows.map((ticket) => (
              <HazardTicketCard
                key={ticket.id}
                ticket={ticket}
                device={deviceMap.get(ticket.device_id)}
                result={resultMap.get(ticket.result_id)}
                onRectify={setRectifyTarget}
                onRecheck={setRecheckTarget}
              />
            ))}
          </div>
        )}

        <div className="pager">
          <button className="btn-ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}>上一页</button>
          <span>第 {page} 页 · 共 {total} 张</span>
          <button className="btn-ghost" disabled={page * 8 >= total} onClick={() => setPage(page + 1)}>下一页</button>
        </div>
      </section>

      {recheckTarget && (
        <RecheckDialog
          ticketId={recheckTarget.id}
          saving={saving}
          onClose={() => setRecheckTarget(null)}
          onSubmit={submitRecheck}
        />
      )}
      {rectifyTarget && (
        <RectifyNoteDialog
          ticketId={rectifyTarget.id}
          initialNote={rectifyTarget.rectify_note}
          saving={saving}
          onClose={() => setRectifyTarget(null)}
          onSubmit={submitRectifyNote}
        />
      )}
    </main>
  );
}
