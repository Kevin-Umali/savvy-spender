export type CardNetwork =
  | "Visa"
  | "Mastercard"
  | "Amex"
  | "Diners"
  | "JCB"
  | "UnionPay";
export interface CardFxEntry {
  issuer: string;
  card: string;
  network: CardNetwork;
  fxMarkup: number;
  hasZeroMarkup: boolean;
  notes: string;
  sourceUrl: string;
  promo?: { start: string; end: string; standardFee: number };
}
export const CARD_FX_DATA_REVIEWED = "October 3, 2026";
const bdo =
  "https://www.bdo.com.ph/personal/cards/credit-cards/fees-and-charges-update";
const bpi = "https://www.bpi.com.ph/personal/cards/credit-cards/rates-and-fees";
const metro =
  "https://www.metrobank.com.ph/articles/credit-card-rates-and-fees";
const rcbc = "https://rcbccredit.com/card-fees-and-charges";

/** Only entries verified against issuer schedules are included. Fees apply to
 * issuer/network conversion rates, NOT necessarily the mid-market benchmark. */
export const CARD_FX_DATA: CardFxEntry[] = [
  {
    issuer: "BDO",
    card: "Standard Visa",
    network: "Visa",
    fxMarkup: 2.5,
    hasZeroMarkup: false,
    notes:
      "1.5% service fee + 1% assessment. Not applicable to every BDO network or billing arrangement.",
    sourceUrl:
      "https://www.bdo.com.ph/about-bdo/learn/help-and-support/transactions-and-service-inquiry",
  },
  {
    issuer: "BDO",
    card: "Visa Platinum",
    network: "Visa",
    fxMarkup: 1.85,
    hasZeroMarkup: false,
    notes:
      "Reduced fee effective August 1, 2025. Applies to listed eligible elite cards; not all Visa cards.",
    sourceUrl: bdo,
  },
  {
    issuer: "BDO",
    card: "Platinum Mastercard",
    network: "Mastercard",
    fxMarkup: 1.85,
    hasZeroMarkup: false,
    notes:
      "Standard eligible elite fee. Check issuer for temporary rebates; this row excludes promotions.",
    sourceUrl: bdo,
  },
  {
    issuer: "BPI",
    card: "Rewards / Gold / Platinum Rewards / Robinsons Cashback",
    network: "Mastercard",
    fxMarkup: 1.85,
    hasZeroMarkup: false,
    notes: "0.85% service fee + 1% assessment, on the network rate at posting.",
    sourceUrl: bpi,
  },
  {
    issuer: "BPI",
    card: "Signature / Amore Cashback",
    network: "Visa",
    fxMarkup: 1.85,
    hasZeroMarkup: false,
    notes: "0.85% service fee + 1% assessment. Free+ has a different fee.",
    sourceUrl: bpi,
  },
  {
    issuer: "BPI",
    card: "Free+",
    network: "Visa",
    fxMarkup: 3,
    hasZeroMarkup: false,
    notes:
      "2% service fee + 1% Visa assessment; not the 1.85% charged on listed other BPI cards.",
    sourceUrl: bpi,
  },
  {
    issuer: "Metrobank",
    card: "Standard Visa",
    network: "Visa",
    fxMarkup: 3.5,
    hasZeroMarkup: false,
    notes:
      "2.5% forex processing + 1% cross-border fee. Product-specific exceptions exist.",
    sourceUrl: metro,
  },
  {
    issuer: "Metrobank",
    card: "Travel Signature Visa",
    network: "Visa",
    fxMarkup: 1.68,
    hasZeroMarkup: false,
    notes: "0.68% forex processing + 1% cross-border fee.",
    sourceUrl: metro,
  },
  {
    issuer: "RCBC",
    card: "Standard Visa",
    network: "Visa",
    fxMarkup: 3.5,
    hasZeroMarkup: false,
    notes:
      "Service fee applies to RCBC selling rates for listed currencies; others use network conversion.",
    sourceUrl: rcbc,
  },
  {
    issuer: "RCBC",
    card: "Visa Infinite / Airmiles Visa Signature (promo)",
    network: "Visa",
    fxMarkup: 1.5,
    hasZeroMarkup: false,
    notes:
      "October 1–December 31, 2026. Eligible foreign-currency purchases; good standing required. PHP/DCC transactions excluded. Uses RCBC selling rate for listed currencies.",
    sourceUrl: "https://rcbccredit.com/promos/pvisa150fx",
    promo: { start: "2026-10-01", end: "2026-12-31", standardFee: 3.5 },
  },
];

export function applicableCardFees(date = new Date()): CardFxEntry[] {
  const today = date.toLocaleDateString("en-CA", { timeZone: "Asia/Manila" });
  return CARD_FX_DATA.map((entry) => {
    const active =
      entry.promo && today >= entry.promo.start && today <= entry.promo.end;
    return entry.promo && !active
      ? {
          ...entry,
          fxMarkup: entry.promo.standardFee,
          notes:
            "Promo inactive on the current date; standard fee used. " +
            entry.notes,
        }
      : entry;
  });
}
