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
export const PAYOUT_DATA_REVIEWED =
  "October 3, 2026 (terms checked; numeric examples are not live quotes)";

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
    sources: ["Direct client", "Upwork", "Invoicing"],
    notes:
      "USD ACH receiving is free; USD wire/SWIFT receiving costs $6.11. The 0.65% here is an illustrative conversion cost, not a universal Wise tariff. Get a corridor-specific quote.",
    sourceUrl: "https://wise.com/ph/pricing/",
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
    sources: ["Upwork", "Fiverr", "Marketplaces"],
    inactivityFeeUsd: 29.95,
    notes:
      "1% receiving and 2% conversion are example assumptions. Fees depend on payment rail and corridor. The $29.95 annual fee generally applies when receipts are below $6,000 in any consecutive 12 months (exceptions apply), not simply when inactive. Annual fee is excluded from this per-payout estimate.",
    sourceUrl: "https://www.payoneer.com/pricing/",
  },
  {
    name: "PayPal → PHP bank",
    category: "transfer",
    receivePct: 4.4,
    receiveFixed: 0.3,
    fxMarkupPct: 3,
    withdrawPct: 0,
    withdrawFixedPhp: 50,
    freeWithdrawalAtPhp: 7000,
    payoutSpeed: "1–5 days",
    canHoldForeign: true,
    sources: ["Fiverr", "Onlinejobs.ph", "Direct client"],
    notes:
      "Illustrative USD commercial-payment scenario, not all payment types. $0.30 fixed receiving fee is USD-specific. Assumes standard PHP-bank withdrawal: ₱50 below ₱7,000, otherwise ₱0. Account/type-specific charges and PayPal's actual conversion quote can differ.",
    sourceUrl: "https://www.paypal.com/ph/business/paypal-business-fees",
  },
  {
    name: "PayPal → GCash",
    category: "ewallet",
    receivePct: 4.4,
    receiveFixed: 0.3,
    fxMarkupPct: 3,
    withdrawPct: 1,
    withdrawFixedPhp: 0,
    payoutSpeed: "Instant – 1 day",
    canHoldForeign: false,
    sources: ["Fiverr", "Onlinejobs.ph", "Direct client"],
    notes:
      "GCash charges 1% on all PayPal cash-in amounts from March 7, 2026. Receiving and conversion figures are illustrative USD commercial-payment assumptions; confirm the PayPal quote and GCash limits.",
    sourceUrl:
      "https://help.gcash.com/hc/en-us/articles/360017595774-Cash-in-fees",
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
    sources: ["Direct client", "Enterprise"],
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
      "Sender-initiated remittance. $3.99 and 1.2% are illustrative assumptions, not a current universal tariff; actual fee/rate depends on sending country, payment method, delivery, and promotions. Check the sender's quote.",
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
    sources: ["Crypto-native client", "Web3"],
    notes:
      "Illustrative USD-equivalent stablecoin settlement, not a fiat payout alternative with identical risk. Trading spread and withdrawal fees here are assumptions; network fees are excluded. Adds peg, custody, liquidity, and compliance risk. Verify the exchange's supported assets and quote.",
  },
];
