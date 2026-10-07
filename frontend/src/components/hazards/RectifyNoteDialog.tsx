import { useEffect, useState } from "react";
import { ERROR_MESSAGES } from "../../constants/errorMessages";

export function RectifyNoteDialog({
  ticketId,
  initialNote,
  saving,
  onClose,
  onSubmit
}: {
  ticketId: number;
  initialNote: string;
  saving: boolean;
  onClose: () => void;
  onSubmit: (ticketId: number, note: string) => Promise<void> | void;
}) {
  const [note, setNote] = useState(initialNote);
  const [error, setError] = useState("");

  useEffect(() => setNote(initialNote), [ticketId, initialNote]);

  const submit = async () => {
    if (!note.trim()) {
      setError(ERROR_MESSAGES.RECTIFY_PAYLOAD_INVALID);
      return;
    }
    setError("");
    try {
      await onSubmit(ticketId, note.trim());
      onClose();
    } catch {
      // 保存失败时保留弹窗，错误信息由页面统一展示
    }
  };

  return (
    <div className="modal-mask" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <h3>补录整改说明 · 隐患单 #{ticketId}</h3>
        <label className="field">
          <span>整改说明（处理措施、更换部件、遗留问题等）</span>
          <textarea
            rows={5}
            placeholder="如：已更换 25m 国标消防水带，待维保复验。"
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
        </label>
        {error && <p className="form-error">{error}</p>}
        <div className="modal-actions">
          <button className="btn-ghost" onClick={onClose} disabled={saving}>取消</button>
          <button className="btn-primary" onClick={submit} disabled={saving}>
            {saving ? "保存中…" : "保存说明"}
          </button>
        </div>
      </div>
    </div>
  );
}
