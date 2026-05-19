export type CardNetwork = "Visa" | "Mastercard" | "Amex" | "Diners" | "JCB" | "UnionPay";

export interface CardFxEntry {
  issuer: string;
  card: string;
  network: CardNetwork;
  fxMarkup: number;       // Total % markup over network interbank rate (bank fee + network assessment)
  hasZeroMarkup: boolean;
  notes: string;
}

/**
 * PH credit card foreign transaction fees.
 *
 * The total markup shown is the all-in fee a cardholder pays over the Visa/Mastercard
 * wholesale interbank rate. It typically combines:
 *  - Bank-imposed forex conversion fee, AND
 *  - Network cross-border assessment fee (~1% Visa, ~0.2-1% Mastercard)
 *
 * Some banks itemise these separately on the statement; this table consolidates
 * them into a single comparable rate.
 *
 * Sources: Bank fee schedules, cardholder agreements, BSP filings, and published
 * card reviews. Last reviewed: 2026. Rates may change — always verify with your
 * card issuer before travelling.
 */
export const CARD_FX_DATA_REVIEWED = "May 2026";

export const CARD_FX_DATA: CardFxEntry[] = [
  // ── BDO Unibank ──────────────────────────────────────────────────
  {
    issuer: "BDO",
    card: "Standard Visa / Mastercard",
    network: "Visa",
    fxMarkup: 2.5,
    hasZeroMarkup: false,
    notes: "1.5% bank forex fee + ~1% network assessment.",
  },
  {
    issuer: "BDO",
    card: "Elite Visa / Mastercard",
    network: "Visa",
    fxMarkup: 1.85,
    hasZeroMarkup: false,
    notes: "Lower forex fee on elite-tier cards (effective Aug 2025).",
  },

  // ── BPI ──────────────────────────────────────────────────────────
  {
    issuer: "BPI",
    card: "All BPI-issued cards",
    network: "Mastercard",
    fxMarkup: 1.85,
    hasZeroMarkup: false,
    notes: "0.85% bank fee + 1% network assessment — uniform across BPI's lineup.",
  },
  {
    issuer: "BPI",
    card: "Robinsons Cashback (post-merger)",
    network: "Mastercard",
    fxMarkup: 1.85,
    hasZeroMarkup: false,
    notes: "Robinsons Bank merged into BPI (Jan 2024). Card now follows BPI's 1.85% rate.",
  },

  // ── Metrobank ─────────────────────────────────────────────────────
  {
    issuer: "Metrobank",
    card: "Standard Visa / Mastercard",
    network: "Visa",
    fxMarkup: 3.5,
    hasZeroMarkup: false,
    notes: "One of the higher PH bank forex markups.",
  },
  {
    issuer: "Metrobank",
    card: "Travel Signature Visa",
    network: "Visa",
    fxMarkup: 1.68,
    hasZeroMarkup: false,
    notes: "Permanent lower forex fee — designed for international use.",
  },

  // ── Security Bank ─────────────────────────────────────────────────
  {
    issuer: "Security Bank",
    card: "Standard / World Mastercard",
    network: "Mastercard",
    fxMarkup: 2.5,
    hasZeroMarkup: false,
    notes: "Standard 2.5% conversion fee. No permanent zero-fee variant currently confirmed.",
  },
  {
    issuer: "Security Bank",
    card: "Platinum Visa",
    network: "Visa",
    fxMarkup: 2.5,
    hasZeroMarkup: false,
    notes: "Standard 2.5% conversion fee.",
  },

  // ── RCBC Bankard ─────────────────────────────────────────────────
  {
    issuer: "RCBC Bankard",
    card: "Standard Visa / Mastercard",
    network: "Visa",
    fxMarkup: 3.5,
    hasZeroMarkup: false,
    notes: "Standard 3.5% foreign currency conversion fee.",
  },
  {
    issuer: "RCBC Bankard",
    card: "Visa Infinite (promo)",
    network: "Visa",
    fxMarkup: 1.5,
    hasZeroMarkup: false,
    notes: "Promotional reduced rate — verify ongoing eligibility.",
  },
  {
    issuer: "RCBC Bankard",
    card: "New card (first 365 days, in-store)",
    network: "Visa",
    fxMarkup: 0,
    hasZeroMarkup: true,
    notes: "0% forex for the first 365 days on in-store purchases abroad (new cardholders).",
  },

  // ── UnionBank ─────────────────────────────────────────────────────
  {
    issuer: "UnionBank",
    card: "Standard Visa / Mastercard",
    network: "Visa",
    fxMarkup: 3.525,
    hasZeroMarkup: false,
    notes: "Standard UnionBank forex rate (2.525% bank + 1% network).",
  },
  {
    issuer: "UnionBank",
    card: "Reserve World Elite Mastercard",
    network: "Mastercard",
    fxMarkup: 1.0,
    hasZeroMarkup: false,
    notes: "Network assessment only — bank waives its own forex fee.",
  },
  {
    issuer: "UnionBank",
    card: "Reserve Visa Infinite",
    network: "Visa",
    fxMarkup: 1.0,
    hasZeroMarkup: false,
    notes: "Network assessment only — bank waives its own forex fee.",
  },

  // ── HSBC Philippines ─────────────────────────────────────────────
  {
    issuer: "HSBC PH",
    card: "Red / Gold / Platinum Mastercard",
    network: "Mastercard",
    fxMarkup: 3.5,
    hasZeroMarkup: false,
    notes: "2.5% bank fee + 1% network assessment.",
  },

  // ── EastWest Bank (formerly Citibank PH) ─────────────────────────
  {
    issuer: "EastWest Bank",
    card: "Visa (standard)",
    network: "Visa",
    fxMarkup: 1.7,
    hasZeroMarkup: false,
    notes: "Among the lower forex rates for standard PH Visa cards.",
  },
  {
    issuer: "EastWest Bank",
    card: "Mastercard Platinum",
    network: "Mastercard",
    fxMarkup: 2.5,
    hasZeroMarkup: false,
    notes: "Standard MC Platinum forex rate.",
  },
  {
    issuer: "EastWest Bank",
    card: "Mastercard Privilege",
    network: "Mastercard",
    fxMarkup: 3.0,
    hasZeroMarkup: false,
    notes: "Higher tier carries a higher forex fee.",
  },

  // ── Standard Chartered PH ─────────────────────────────────────────
  {
    issuer: "Standard Chartered PH",
    card: "Visa / Mastercard",
    network: "Visa",
    fxMarkup: 3.5,
    hasZeroMarkup: false,
    notes: "Approximate rate — verify with current SCB fee schedule.",
  },

  // ── Philippine National Bank (PNB) ───────────────────────────────
  {
    issuer: "PNB",
    card: "Mastercard / Visa",
    network: "Mastercard",
    fxMarkup: 2.5,
    hasZeroMarkup: false,
    notes: "Standard 2.5% foreign currency conversion fee.",
  },

  // ── China Bank (Chinabank) ────────────────────────────────────────
  {
    issuer: "China Bank",
    card: "Standard Mastercard / Visa",
    network: "Mastercard",
    fxMarkup: 2.5,
    hasZeroMarkup: false,
    notes: "Standard 2.5% forex conversion fee.",
  },
  {
    issuer: "China Bank",
    card: "Destinations World Mastercard",
    network: "Mastercard",
    fxMarkup: 1.7,
    hasZeroMarkup: false,
    notes: "Permanent lower forex rate — travel-focused card.",
  },

  // ── Maybank Philippines ───────────────────────────────────────────
  {
    issuer: "Maybank PH",
    card: "Standard Visa / Mastercard",
    network: "Visa",
    fxMarkup: 3.25,
    hasZeroMarkup: false,
    notes: "Hiked to 3.25% in 2021 — verify current rate.",
  },
  {
    issuer: "Maybank PH",
    card: "Visa Infinite",
    network: "Visa",
    fxMarkup: 1.75,
    hasZeroMarkup: false,
    notes: "Lower forex rate on the Visa Infinite tier.",
  },

  // ── PSBank ────────────────────────────────────────────────────────
  {
    issuer: "PSBank",
    card: "Flexi Mastercard",
    network: "Mastercard",
    fxMarkup: 3.0,
    hasZeroMarkup: false,
    notes: "Metrobank subsidiary; approximate rate — verify with PSBank.",
  },
];
