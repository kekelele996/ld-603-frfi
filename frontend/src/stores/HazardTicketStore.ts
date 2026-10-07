import { create } from "zustand";
import { listHazardTicket, saveRecheck, saveRectifyNote } from "../api/HazardTicket";
import type { HazardTicket } from "../types/HazardTicket";
import type { HazardRecheckForm, RectifyNoteForm } from "../types/HazardRecheck";

type State = {
  rows: HazardTicket[];
  loading: boolean;
  saving: boolean;
  error: string;
  load: () => Promise<void>;
  /** 整改人补录整改说明 */
  recordRectifyNote: (ticketId: number, form: RectifyNoteForm) => Promise<void>;
  /** 维保商补记复验（日期/复验人/结论），存好后状态与期限由复验结论驱动 */
  recordRecheck: (ticketId: number, form: HazardRecheckForm) => Promise<void>;
};

const replaceRow = (rows: HazardTicket[], updated: HazardTicket) =>
  rows.map((row) => (row.id === updated.id ? updated : row));

export const useHazardTicketStore = create<State>((set, get) => ({
  rows: [],
  loading: false,
  saving: false,
  error: "",
  async load() {
    set({ loading: true, error: "" });
    try {
      set({ rows: await listHazardTicket(), loading: false });
    } catch (error) {
      set({ loading: false, error: String(error) });
    }
  },
  async recordRectifyNote(ticketId, form) {
    set({ saving: true, error: "" });
    try {
      const updated = await saveRectifyNote(ticketId, form);
      set({ rows: replaceRow(get().rows, updated), saving: false });
    } catch (error) {
      set({ saving: false, error: String(error) });
      throw error;
    }
  },
  async recordRecheck(ticketId, form) {
    set({ saving: true, error: "" });
    try {
      const updated = await saveRecheck(ticketId, form);
      // 复验可能改变同一设备其它单的重复隐患标记，整体重取
      const rows = await listHazardTicket();
      set({ rows: rows.some((row) => row.id === updated.id) ? rows : replaceRow(get().rows, updated), saving: false });
    } catch (error) {
      set({ saving: false, error: String(error) });
      throw error;
    }
  }
}));
