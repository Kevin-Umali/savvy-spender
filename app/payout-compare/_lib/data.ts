import type { PayoutPlatform } from "./types";

/**
 * Representative end-to-end costs for a PH freelancer getting paid in a foreign
 * currency (defaults assume USD) and converting to pesos in hand. Each entry
 * folds together three layers:
 *   1. receiving fee (what the platform takes off the incoming payment),
 *   2. FX markup over the mid-market rate on conversion to PHP, and
 *   3. cash-out / withdrawal fee to a local bank or wallet.
 *
 * Figures are indicative, based on publicly published fee schedules and Wise's
 * country guides (May 2026), and change often. They vary by corridor, amount,
 * and sender. Always confirm the exact fees with the provider before relying on
 * them — bank peso-denominated line items in particular are poorly documented.
 */
export const PAYOUT_DATA_REVIEWED = "May 2026";

export const PAYOUT_PLATFORMS: PayoutPlatform[] = [
  {
    name: "Wise",
    category: "transfer",
    receivePct: 0,
    receiveFixed: 0,
    fxMarkupPct: 0.65,
    withdrawPct: 0,
    withdrawFixedPhp: 0,
    payoutSpeed: "Seconds – 2 days",
    canHoldForeign: true,
    notes:
      "Cheapest transparent option. Free USD receiving over local/ACH rails (a SWIFT wire costs ~$6); converts at the true mid-market rate for ~0.6%. Hold USD and convert when the rate suits you.",
  },
  {
    name: "Payoneer",
    category: "transfer",
    receivePct: 1,
    receiveFixed: 0,
    fxMarkupPct: 2,
    withdrawPct: 0,
    withdrawFixedPhp: 0,
    payoutSpeed: "2 hrs – 2 days",
    canHoldForeign: true,
    notes:
      "Built for marketplaces. Receiving from a marketplace/client is free–~1% (card-funded clients cost up to 3.99% + $0.49); withdrawing USD to a PHP bank adds up to ~2% over mid-market.",
  },
  {
    name: "PayPal → PHP bank",
    category: "transfer",
    receivePct: 4.4,
    receiveFixed: 0.3,
    fxMarkupPct: 3.5,
    withdrawPct: 0,
    withdrawFixedPhp: 50,
    payoutSpeed: "1–5 days",
    canHoldForeign: true,
    notes:
      "Two stacked costs people miss: ~4.4% + ₱15 to receive an international goods-and-services payment, THEN a ~3–4% conversion spread to move USD→PHP. Bank withdrawal is ₱50 under ₱7,000, else free.",
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
      "Cash-out to GCash is free, but you still pay PayPal's ~4.4% receiving fee and the ~3–4% USD→PHP conversion spread. GCash itself holds only pesos.",
  },
  {
    name: "Maya (via remittance)",
    category: "ewallet",
    receivePct: 0,
    receiveFixed: 0,
    fxMarkupPct: 2,
    withdrawPct: 0,
    withdrawFixedPhp: 15,
    payoutSpeed: "Minutes",
    canHoldForeign: false,
    notes:
      "PHP-only wallet: free to receive (auto-converted), so the FX cost lives in the sending partner's rate. Bank-out is ~₱15 via InstaPay and often free via PESONet.",
  },
  {
    name: "Bank wire (inward SWIFT)",
    category: "bank",
    receivePct: 0,
    receiveFixed: 14,
    fxMarkupPct: 2,
    withdrawPct: 0,
    withdrawFixedPhp: 0,
    payoutSpeed: "2–5 days",
    canHoldForeign: true,
    notes:
      "Direct telegraphic transfer to a PHP bank (BPI/BDO). A stated inward SWIFT fee (~$14) plus possible intermediary-bank fees, but the bigger hidden cost is an undisclosed ~1–2.5% FX spread on conversion.",
  },
  {
    name: "Remitly",
    category: "bank",
    receivePct: 0,
    receiveFixed: 3.99,
    fxMarkupPct: 1.2,
    withdrawPct: 0,
    withdrawFixedPhp: 0,
    payoutSpeed: "Minutes – 5 days",
    canHoldForeign: false,
    notes:
      "Sender-initiated remittance: $3.99 under $1,000 and free at $1,000+. The headline 'special rate' is a first-transfer promo; the everyday rate carries a ~1%+ spread. Recipient gets PHP, no USD hold.",
  },
  {
    name: "USDT off-ramp (PDAX / Coins.ph)",
    category: "crypto",
    receivePct: 0,
    receiveFixed: 0,
    fxMarkupPct: 1,
    withdrawPct: 0.15,
    withdrawFixedPhp: 10,
    payoutSpeed: "Minutes",
    canHoldForeign: true,
    notes:
      "Cheapest FX if the client pays in USDT. Sell on a licensed PH exchange with limit orders (~0.1–0.5% spot; the quick 'Convert' hides 1–3%); cash-out is free–₱10 via InstaPay/PESONet. Adds peg/liquidity risk and KYC.",
  },
];
