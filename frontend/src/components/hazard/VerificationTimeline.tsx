import type { Verification } from "../../types/Verification";
import { formatDate, formatVerificationResult } from "../../utils/formatters";

/** 复验时间线：一张隐患单的历次复验（日期 / 复验人 / 结论）。 */
export function VerificationTimeline({ verifications }: { verifications: Verification[] }) {
  if (!verifications.length) {
    return <p className="muted">尚无复验记录，维保商电话复验后请在此补记。</p>;
  }
  return (
    <ol className="verification-timeline">
      {[...verifications].reverse().map((item) => (
        <li key={item.id} className={item.result === "PASS" ? "pass" : "fail"}>
          <div className="timeline-dot" />
          <div className="timeline-body">
            <div className="timeline-head">
              <strong>{formatVerificationResult(item.result)}</strong>
              <span>{formatDate(item.verified_at)}</span>
              <span className="muted">复验人：{item.inspector}</span>
            </div>
            {item.note && <p className="timeline-note">{item.note}</p>}
            {item.result === "FAIL" && item.new_deadline && (
              <p className="timeline-deadline">新整改期限：{formatDate(item.new_deadline)}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
