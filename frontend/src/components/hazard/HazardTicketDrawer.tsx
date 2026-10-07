import { useState } from "react";
import type { HazardTicket } from "../../types/HazardTicket";
import { HazardSeverityTag } from "../common/HazardSeverityTag";
import { StatusBadge } from "../common/StatusBadge";
import { RepeatHazardTag } from "./RepeatHazardTag";
import { VerificationTimeline } from "./VerificationTimeline";
import { RectifyNoteDialog } from "./RectifyNoteDialog";
import { VerificationDialog } from "./VerificationDialog";
import { formatDate, formatRisk } from "../../utils/formatters";
import type { RectifyNoteForm, VerificationForm } from "../../api/HazardTicket";

export function HazardTicketDrawer({
  ticket,
  saving,
  onClose,
  onRectifyNote,
  onVerification
}: {
  ticket: HazardTicket;
  saving: boolean;
  onClose: () => void;
  onRectifyNote: (ticketId: number, form: RectifyNoteForm) => Promise<void>;
  onVerification: (ticketId: number, form: VerificationForm) => Promise<void>;
}) {
  const [noteOpen, setNoteOpen] = useState(false);
  const [verificationOpen, setVerificationOpen] = useState(false);
  const closed = ticket.rectify_status === "CLOSED";

  return (
    <>
      <div className="drawer-mask" onClick={onClose} />
      <aside className="drawer">
        <header className="drawer-head">
          <div>
            <p className="eyebrow">隐患整改单 #{ticket.id}</p>
            <h2>
              {ticket.device_code} <HazardSeverityTag value={ticket.severity} />
            </h2>
            <p className="muted">{ticket.location_desc} · 风险等级 {formatRisk(ticket.severity)}</p>
          </div>
          <button className="btn btn-ghost" onClick={onClose}>关闭</button>
        </header>

        {ticket.repeat_hazard && ticket.repeat_detail && (
          <RepeatHazardTag detail={ticket.repeat_detail} />
        )}

        <section className="drawer-grid">
          <div><span className="muted">整改状态</span><StatusBadge value={ticket.rectify_status ?? "RECTIFYING"} /></div>
          <div>
            <span className="muted">整改期限（按复验结论）</span>
            <strong className={ticket.overdue ? "text-danger" : ""}>
              {formatDate(ticket.effective_deadline)}
              {ticket.overdue && <em className="overdue-flag">已逾期</em>}
            </strong>
          </div>
          <div><span className="muted">维保商</span><strong>{ticket.owner_name || ticket.owner_id}</strong></div>
          <div><span className="muted">闭环时间</span><strong>{closed ? formatDate(ticket.closed_at) : "—"}</strong></div>
        </section>

        <section className="drawer-section">
          <div className="section-title">
            <h3>整改说明</h3>
            <button className="btn btn-link" onClick={() => setNoteOpen(true)}>
              {ticket.rectify_note ? "修改整改说明" : "补录整改说明"}
            </button>
          </div>
          {ticket.rectify_note
            ? <p className="note-block">{ticket.rectify_note}</p>
            : <p className="muted">整改人尚未补录整改说明。</p>}
          {ticket.rectified_at && <p className="muted small">最近更新：{formatDate(ticket.rectified_at)}</p>}
        </section>

        <section className="drawer-section">
          <div className="section-title">
            <h3>复验记录</h3>
            <button className="btn btn-link" onClick={() => setVerificationOpen(true)}>补记复验</button>
          </div>
          <VerificationTimeline verifications={ticket.verifications ?? []} />
        </section>
      </aside>

      {noteOpen && (
        <RectifyNoteDialog
          initial={ticket.rectify_note}
          saving={saving}
          onClose={() => setNoteOpen(false)}
          onSubmit={(form) => onRectifyNote(ticket.id, form)}
        />
      )}
      {verificationOpen && (
        <VerificationDialog
          saving={saving}
          onClose={() => setVerificationOpen(false)}
          onSubmit={(form) => onVerification(ticket.id, form)}
        />
      )}
    </>
  );
}
