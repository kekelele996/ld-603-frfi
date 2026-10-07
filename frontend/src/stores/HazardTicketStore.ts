import { create } from "zustand";
import {
  listHazardTicket,
  saveRectifyNote,
  saveVerification,
  type RectifyNoteForm,
  type VerificationForm
} from "../api/HazardTicket";
import { mockData } from "../mocks/seedData";
import { enrichTickets } from "../utils/hazardDerivation";
import type { HazardTicket } from "../types/HazardTicket";
import type { Verification } from "../types/Verification";

type State = {
  rows: HazardTicket[];
  loading: boolean;
  saving: boolean;
  load: () => Promise<void>;
  submitRectifyNote: (ticketId: number, form: RectifyNoteForm) => Promise<void>;
  submitVerification: (ticketId: number, form: VerificationForm) => Promise<void>;
};

/**
 * 写接口走后端；离线评审（无后端）时写本地 mock 种子，
 * 然后统一用复验记录重新推导整张列表的状态/期限/重复隐患。
 */
function applyLocally(ticketId: number, patch: Partial<HazardTicket>, verification?: Verification) {
  const target = mockData.hazardTicket.find((row) => row.id === ticketId);
  if (target) Object.assign(target, patch);
  if (verification) {
    mockData.verification.push(verification);
  }
  return enrichTickets(
    mockData.hazardTicket.map((row) => ({ ...row })),
    mockData.verification,
    mockData.inspectionResult
  );
}

export const useHazardTicketStore = create<State>((set, get) => ({
  rows: [],
  loading: false,
  saving: false,
  async load() {
    set({ loading: true });
    try {
      set({ rows: await listHazardTicket() });
    } finally {
      set({ loading: false });
    }
  },
  async submitRectifyNote(ticketId, form) {
    set({ saving: true });
    try {
      try {
        await saveRectifyNote(ticketId, form);
        await get().load();
      } catch {
        const today = new Date().toISOString().slice(0, 10);
        set({
          rows: applyLocally(ticketId, {
            rectify_note: form.rectify_note,
            rectified_at: today
          })
        });
      }
    } finally {
      set({ saving: false });
    }
  },
  async submitVerification(ticketId, form) {
    set({ saving: true });
    try {
      try {
        await saveVerification(ticketId, form);
        // 重拉：一次复验可能改变本单状态/期限，也可能改变他单的重复隐患标记
        await get().load();
      } catch {
        const nextId = mockData.verification.reduce((max, row) => Math.max(max, row.id), 0) + 1;
        const verification: Verification = { id: nextId, ticket_id: ticketId, ...form };
        set({
          // closed_at 是派生值，由 enrichTickets 按复验结论重新计算，不在这里写单
          rows: applyLocally(ticketId, {}, verification)
        });
      }
    } finally {
      set({ saving: false });
    }
  }
}));
