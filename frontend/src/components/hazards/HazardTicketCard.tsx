import type { HazardTicket } from "../../types/HazardTicket";
import type { FireDevice } from "../../types/FireDevice";
import type { InspectionResult } from "../../types/InspectionResult";
import { formatDay, formatRectifyStatus, formatRisk } from "../../utils/formatters";
import { HazardSeverityTag } from "../common/HazardSeverityTag";
import { TimelineList, buildRecheckTimelineEntries } from "../common/TimelineList";
import { RepeatHazardBadge } from "./RepeatHazardBadge";

export function HazardTicketCard({
  ticket,
  device,
  result,
  onRectify,
  onRecheck
}: {
  ticket: HazardTicket;
  device?: FireDevice;
  result?: InspectionResult;
  onRectify: (ticket: HazardTicket) => void;
  onRecheck: (ticket: HazardTicket) => void;
}) {
  const closed = ticket.effective_status === "CLOSED";
  const timelineEntries = buildRecheckTimelineEntries(ticket.rechecks || []);

  return (
    <article className={`hazard-card ${ticket.repeat_hazard ? "is-repeat" : ""}`}>
      <div className="hazard-head">
        <div>
          <h3>
            隐患单 #{ticket.id}
            {ticket.repeat_hazard && <RepeatHazardBadge refs={ticket.repeat_rechecks} detail={ticket.repeat_detail} />}
          </h3>
          <p className="hazard-device">
            {device ? `${device.device_code} · ${device.location_desc}` : `设备 #${ticket.device_id}`}
          </p>
        </div>
        <div className="hazard-tags">
          <HazardSeverityTag title="隐患等级" value={formatRisk(ticket.severity)} />
          <span className={`badge badge-status-${ticket.effective_status.toLowerCase()}`}>
            {formatRectifyStatus(ticket.effective_status)}
          </span>
        </div>
      </div>

      {result?.note && <p className="hazard-note">巡检发现：{result.note}</p>}
      {result?.measured_value && <p className="hazard-measure">实测：{result.measured_value}</p>}

      <div className="hazard-meta">
        <span>整改期限（按复验结论）：<strong>{ticket.effective_deadline ? formatDay(ticket.effective_deadline) : "已闭环"}</strong></span>
        <span>复验次数：{ticket.rechecks?.length ?? 0}</span>
      </div>

      <p className="hazard-note">
        整改说明：{ticket.rectify_note || <em className="muted">整改人尚未补录</em>}
      </p>

      {timelineEntries.length > 0 ? (
        <TimelineList title="复验记录" entries={timelineEntries} />
      ) : (
        <p className="muted">暂无复验记录（维保商复验后请补记）。</p>
      )}

      {ticket.repeat_hazard && <p className="repeat-detail">⚠ {ticket.repeat_detail}</p>}

      <div className="hazard-actions">
        <button className="btn-ghost" onClick={() => onRectify(ticket)} disabled={closed}>
          补录整改说明
        </button>
        <button className="btn-primary" onClick={() => onRecheck(ticket)} disabled={closed}>
          补记复验
        </button>
      </div>
    </article>
  );
}
