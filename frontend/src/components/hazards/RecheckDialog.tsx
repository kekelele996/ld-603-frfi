import { useEffect, useState } from "react";
import { createRecheckForm } from "../../constructors/HazardRecheckConstructor";
import type { HazardRecheckForm } from "../../types/HazardRecheck";
import { ERROR_MESSAGES } from "../../constants/errorMessages";

export function RecheckDialog({
  ticketId,
  saving,
  onClose,
  onSubmit
}: {
  ticketId: number;
  saving: boolean;
  onClose: () => void;
  onSubmit: (ticketId: number, form: HazardRecheckForm) => Promise<void> | void;
}) {
  const [form, setForm] = useState<HazardRecheckForm>(() => createRecheckForm());
  const [error, setError] = useState("");

  useEffect(() => setForm(createRecheckForm()), [ticketId]);

  const update = (patch: Partial<HazardRecheckForm>) => setForm((prev) => ({ ...prev, ...patch }));

  const submit = async () => {
    if (!form.recheck_date || !form.inspector_name.trim()) {
      setError(ERROR_MESSAGES.RECHECK_PAYLOAD_INVALID);
      return;
    }
    if (form.conclusion === "FAIL" && !form.next_deadline) {
      setError("复验未过时请填写续定的整改期限");
      return;
    }
    setError("");
    try {
      await onSubmit(ticketId, { ...form, inspector_name: form.inspector_name.trim() });
      onClose();
    } catch {
      // 保存失败时保留弹窗，错误信息由页面统一展示
    }
  };

  return (
    <div className="modal-mask" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <h3>补记复验 · 隐患单 #{ticketId}</h3>
        <label className="field">
          <span>复验日期</span>
          <input
            type="date"
            value={form.recheck_date}
            onChange={(event) => update({ recheck_date: event.target.value })}
          />
        </label>
        <label className="field">
          <span>复验人</span>
          <input
            type="text"
            placeholder="如：周维保"
            value={form.inspector_name}
            onChange={(event) => update({ inspector_name: event.target.value })}
          />
        </label>
        <div className="field">
          <span>复验结论</span>
          <div className="radio-row">
            <label>
              <input
                type="radio"
                checked={form.conclusion === "PASS"}
                onChange={() => update({ conclusion: "PASS", next_deadline: "" })}
              />
              复验通过（关闭单据）
            </label>
            <label>
              <input
                type="radio"
                checked={form.conclusion === "FAIL"}
                onChange={() => update({ conclusion: "FAIL" })}
              />
              复验未过（续整改期限）
            </label>
          </div>
        </div>
        {form.conclusion === "FAIL" && (
          <label className="field">
            <span>续定整改期限</span>
            <input
              type="date"
              value={form.next_deadline}
              onChange={(event) => update({ next_deadline: event.target.value })}
            />
          </label>
        )}
        {error && <p className="form-error">{error}</p>}
        <div className="modal-actions">
          <button className="btn-ghost" onClick={onClose} disabled={saving}>取消</button>
          <button className="btn-primary" onClick={submit} disabled={saving}>
            {saving ? "保存中…" : "保存复验"}
          </button>
        </div>
      </div>
    </div>
  );
}
