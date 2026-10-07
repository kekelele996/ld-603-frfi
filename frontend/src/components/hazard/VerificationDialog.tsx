import { useState } from "react";
import type { VerificationForm } from "../../api/HazardTicket";
import { createVerificationForm } from "../../constructors/VerificationConstructor";
import { ERROR_MESSAGES } from "../../constants/errorMessages";

/** 补记复验：复验日期、复验人、结论；未通过时可填写新整改期限 */
export function VerificationDialog({
  saving,
  onClose,
  onSubmit
}: {
  saving: boolean;
  onClose: () => void;
  onSubmit: (form: VerificationForm) => Promise<void>;
}) {
  const [form, setForm] = useState<VerificationForm>(createVerificationForm);
  const [error, setError] = useState("");

  const patch = (part: Partial<VerificationForm>) => setForm((prev) => ({ ...prev, ...part }));

  async function handleSubmit() {
    if (!form.verified_at) return setError(ERROR_MESSAGES.VERIFICATION_DATE_REQUIRED);
    if (!form.inspector.trim()) return setError(ERROR_MESSAGES.VERIFICATION_INSPECTOR_REQUIRED);
    if (!form.result) return setError(ERROR_MESSAGES.VERIFICATION_RESULT_REQUIRED);
    await onSubmit({ ...form, inspector: form.inspector.trim() });
    onClose();
  }

  return (
    <div className="modal-mask" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <h3>补记复验</h3>
        <label className="field">
          <span>复验日期 *</span>
          <input
            type="date"
            value={form.verified_at}
            onChange={(event) => patch({ verified_at: event.target.value })}
          />
        </label>
        <label className="field">
          <span>复验人 *</span>
          <input
            type="text"
            value={form.inspector}
            placeholder="如：周敏"
            onChange={(event) => patch({ inspector: event.target.value })}
          />
        </label>
        <div className="field">
          <span>复验结论 *</span>
          <div className="radio-row">
            <label className={form.result === "PASS" ? "checked pass" : ""}>
              <input
                type="radio"
                name="verification-result"
                checked={form.result === "PASS"}
                onChange={() => patch({ result: "PASS", new_deadline: "" })}
              />
              复验通过
            </label>
            <label className={form.result === "FAIL" ? "checked fail" : ""}>
              <input
                type="radio"
                name="verification-result"
                checked={form.result === "FAIL"}
                onChange={() => patch({ result: "FAIL" })}
              />
              复验未通过
            </label>
          </div>
        </div>
        {form.result === "FAIL" && (
          <label className="field">
            <span>新整改期限（未通过时可重新给定期限）</span>
            <input
              type="date"
              value={form.new_deadline}
              onChange={(event) => patch({ new_deadline: event.target.value })}
            />
          </label>
        )}
        <label className="field">
          <span>复验说明</span>
          <textarea
            rows={3}
            value={form.note}
            placeholder="现场复验情况、遗留问题等"
            onChange={(event) => patch({ note: event.target.value })}
          />
        </label>
        {error && <p className="form-error">{error}</p>}
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>取消</button>
          <button className="btn btn-primary" disabled={saving} onClick={handleSubmit}>
            {saving ? "保存中…" : "保存复验"}
          </button>
        </div>
      </div>
    </div>
  );
}
