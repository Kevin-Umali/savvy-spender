export type PayoutCategory = "transfer" | "ewallet" | "bank" | "crypto";

export interface PayoutPlatform {
  name: string;
  category: PayoutCategory;
  receivePct: number; // % of the incoming amount taken as a receiving fee
  receiveFixed: number; // fixed receiving fee, in the source currency
  fxMarkupPct: number; // % markup over the mid-market rate on conversion to PHP
  withdrawPct: number; // % cash-out / withdrawal fee
  withdrawFixedPhp: number; // fixed cash-out fee, in PHP
  payoutSpeed: string;
  canHoldForeign: boolean; // can you hold a foreign-currency balance?
  notes: string;
}

export interface PayoutResult {
  platform: PayoutPlatform;
  grossPhpMid: number; // gross converted at the mid-market rate (the ideal)
  receiveFeeForeign: number;
  fxCostPhp: number;
  withdrawFeePhp: number;
  netPhp: number; // what actually lands in your pocket
  totalFeePhp: number; // grossPhpMid − netPhp
  effectiveCostPct: number; // totalFee / grossPhpMid
}
