import type { VerificationResult } from "../constants/VerificationResult";

export type { VerificationResult } from "../constants/VerificationResult";

export interface Verification {
  id: number;
  ticket_id: number;
  verified_at: string;
  inspector: string;
  result: VerificationResult;
  note: string;
  /** 复验未通过时可给出的新整改期限 */
  new_deadline: string;
}

export interface RepeatHazardDetail {
  device_id: number;
  first_ticket_id: number;
  first_verified_at: string;
  first_inspector: string;
  second_ticket_id: number;
  second_verified_at: string;
  second_inspector: string;
  label: string;
}
