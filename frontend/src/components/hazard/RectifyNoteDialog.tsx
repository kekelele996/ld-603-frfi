import { useState } from "react";
import type { RectifyNoteForm } from "../../api/HazardTicket";
import { ERROR_MESSAGES } from "../../constants/errorMessages";

/** 整改人补录整改说明 */
export function RectifyNoteDialog({
  initial,
  saving,
  onClose,
  onSubmit
}: {
  initial: string;
  saving: boolean;
  onClose: () => void;
  onSubmit: (form: RectifyNoteForm) => Promise<void>;
}) {
  const [rectifyNote, setRectifyNote] = useState(initial);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!rectifyNote.trim()) {
      setError(ERROR_MESSAGES.RECTIFY_NOTE_REQUIRED);
      return;
    }
    await onSubmit({ rectify_note: rectifyNote.trim() });
    onClose();
  }

  return (
    <div className="modal-mask" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <h3>补录整改说明</h3>
        <label className="field">
          <span>整改说明</span>
          <textarea
            rows={4}
            value={rectifyNote}
            placeholder="写明更换的部件、施工内容、完成时间等"
            onChange={(event) => setRectifyNote(event.target.value)}
          />
        </label>
        {error && <p className="form-error">{error}</p>}
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>取消</button>
          <button className="btn btn-primary" disabled={saving} onClick={handleSubmit}>
            {saving ? "保存中…" : "保存整改说明"}
          </button>
        </div>
      </div>
    </div>
  );
}
