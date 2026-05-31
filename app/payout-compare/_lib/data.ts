import type { PayoutPlatform } from "./types";

/**
 * Representative end-to-end costs for a PH freelancer getting paid in a foreign
 * currency (defaults assume USD) and converting to pesos in hand. Each entry
 * folds together three layers:
 *   1. receiving fee (what the platform takes off the incoming payment),
 *   2. FX markup over the mid-market rate on conversion to PHP, and
 *   3. cash-out / withdrawal fee to a local bank or wallet.
 *
 * Figures are indicative, based on publicly published fee schedules, and change
 * often. Always confirm the exact fees with the provider for your corridor and
 * amount before relying on them.
 */
export const PAYOUT_DATA_REVIEWED = "May 2026";

export const PAYOUT_PLATFORMS: PayoutPlatform[] = [
  {
    name: "Wise",
    category: "transfer",
    receivePct: 0,
    receiveFixed: 0,
    fxMarkupPct: 0.6,
    withdrawPct: 0,
    withdrawFixedPhp: 0,
    payoutSpeed: "1–2 days",
    canHoldForeign: true,
    notes:
      "Free USD receiving via ACH; converts near the mid-market rate with a small (~0.5%) fee. Free payout to a PHP bank.",
  },
  {
    name: "Payoneer",
    category: "transfer",
    receivePct: 1,
    receiveFixed: 0,
    fxMarkupPct: 2,
    withdrawPct: 0,
    withdrawFixedPhp: 0,
    payoutSpeed: "Few hours – 1 day",
    canHoldForeign: true,
    notes:
      "Popular with marketplaces. ~1% to receive (free between Payoneer accounts) plus up to ~2% over mid-market to withdraw to a PHP bank.",
  },
  {
    name: "PayPal → PHP bank",
    category: "transfer",
    receivePct: 4.4,
    receiveFixed: 0.3,
    fxMarkupPct: 3.5,
    withdrawPct: 0,
    withdrawFixedPhp: 50,
    payoutSpeed: "Instant – 1 day",
    canHoldForeign: true,
    notes:
      "Convenient but pricey: ~4.4% + $0.30 to receive a commercial payment, then a ~3–4% FX markup to withdraw. Bank withdrawal is free over ₱7,000, else ₱50.",
  },
  {
    name: "PayPal → GCash",
    category: "ewallet",
    receivePct: 4.4,
    receiveFixed: 0.3,
    fxMarkupPct: 3.5,
    withdrawPct: 0,
    withdrawFixedPhp: 0,
    payoutSpeed: "Instant – 1 day",
    canHoldForeign: false,
    notes:
      "Link GCash to PayPal and cash out for free, but you still pay PayPal's receiving fee and FX markup.",
  },
  {
    name: "Maya (via remittance)",
    category: "ewallet",
    receivePct: 1.5,
    receiveFixed: 0,
    fxMarkupPct: 2.5,
    withdrawPct: 0,
    withdrawFixedPhp: 0,
    payoutSpeed: "Minutes – hours",
    canHoldForeign: false,
    notes:
      "Receive via a partner remittance into a Maya wallet. Fees vary by sender; bank-out from Maya is generally free.",
  },
  {
    name: "Bank wire (inward SWIFT)",
    category: "bank",
    receivePct: 0,
    receiveFixed: 0,
    fxMarkupPct: 1.5,
    withdrawPct: 0,
    withdrawFixedPhp: 500,
    payoutSpeed: "2–5 days",
    canHoldForeign: true,
    notes:
      "Direct telegraphic transfer to a PHP bank. Banks add a ~1–2% FX spread and an inward remittance fee (commonly ₱200–₱1,000+).",
  },
  {
    name: "Remitly",
    category: "bank",
    receivePct: 0,
    receiveFixed: 2.99,
    fxMarkupPct: 1,
    withdrawPct: 0,
    withdrawFixedPhp: 0,
    payoutSpeed: "Minutes – days",
    canHoldForeign: false,
    notes:
      "Best when the client/you send from abroad. Low FX spread with a small fixed fee; first transfers often promo-free.",
  },
  {
    name: "USDT off-ramp (PDAX / Coins.ph)",
    category: "crypto",
    receivePct: 0,
    receiveFixed: 1,
    fxMarkupPct: 0.8,
    withdrawPct: 0.2,
    withdrawFixedPhp: 0,
    payoutSpeed: "Minutes",
    canHoldForeign: true,
    notes:
      "Get paid in USDT, sell on a licensed PH exchange, cash out to a bank/wallet. Cheapest spread but adds crypto price/transfer risk and KYC.",
  },
];
