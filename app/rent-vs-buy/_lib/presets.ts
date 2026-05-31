import type { RentVsBuyInput } from "./types";

/**
 * One-click Philippine financing profiles. Each overrides only the financing
 * levers (rate, term, down payment) — grounded in 2026 Pag-IBIG and bank rates.
 */
export interface FinancingPreset {
  key: string;
  label: string;
  note: string;
  overrides: Partial<RentVsBuyInput>;
}

export const FINANCING_PRESETS: FinancingPreset[] = [
  {
    key: "pagibig-socialized",
    label: "Pag-IBIG socialized",
    note: "3% fixed 5 yrs · for lower-cost housing",
    overrides: { mortgageRatePct: 3, loanTermYears: 30, downPaymentPct: 10 },
  },
  {
    key: "pagibig-regular",
    label: "Pag-IBIG regular",
    note: "~6.25% · up to 30-yr term",
    overrides: { mortgageRatePct: 6.25, loanTermYears: 30, downPaymentPct: 20 },
  },
  {
    key: "bank-fixed",
    label: "Bank fixed",
    note: "~6.75% · BPI / BDO 2026",
    overrides: { mortgageRatePct: 6.75, loanTermYears: 20, downPaymentPct: 20 },
  },
];
