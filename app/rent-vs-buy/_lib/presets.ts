import type { RentVsBuyInput } from "./types";

/**
 * One-click Philippine financing profiles. Each overrides only the financing
 * levers (rate, term, down payment) — illustrative constant-rate scenarios, not current lender offers.
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
    label: "Low-rate example",
    note: "3% held constant for the full simulated term; not a repricing model",
    overrides: { mortgageRatePct: 3, loanTermYears: 30, downPaymentPct: 10 },
  },
  {
    key: "pagibig-regular",
    label: "6.25% example",
    note: "6.25% held constant; verify actual fixing period and eligibility",
    overrides: { mortgageRatePct: 6.25, loanTermYears: 30, downPaymentPct: 20 },
  },
  {
    key: "bank-fixed",
    label: "6.75% example",
    note: "6.75% constant-rate scenario, not a current bank offer",
    overrides: { mortgageRatePct: 6.75, loanTermYears: 20, downPaymentPct: 20 },
  },
];
