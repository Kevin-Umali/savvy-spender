import { newOption } from "./defaults";
import type { FinancingOption } from "./types";

/**
 * One-click financing templates grounded in 2026 PH market rates — bank auto
 * loans run ~6–9% effective, dealer in-house ~15–30%, and credit-to-cash from
 * ~0.49%/month. Each appends a pre-filled option you can then tweak.
 */
export interface LoanPreset {
  key: string;
  label: string;
  note: string;
  build: () => FinancingOption;
}

export const LOAN_PRESETS: LoanPreset[] = [
  {
    key: "bank-low",
    label: "Bank auto loan · 6.5%",
    note: "Effective rate, 60 mo",
    build: () =>
      newOption({
        name: "Bank auto loan (6.5%)",
        type: "bank_auto_loan",
        provider: "Bank",
        monthlyMode: "annual_effective",
        annualEffectiveRate: 6.5,
        termMonths: 60,
        paymentTiming: "oma",
      }),
  },
  {
    key: "bank-high",
    label: "Bank auto loan · 9%",
    note: "Effective rate, 60 mo",
    build: () =>
      newOption({
        name: "Bank auto loan (9%)",
        type: "bank_auto_loan",
        provider: "Bank",
        monthlyMode: "annual_effective",
        annualEffectiveRate: 9,
        termMonths: 60,
        paymentTiming: "oma",
      }),
  },
  {
    key: "inhouse",
    label: "Dealer in-house · 18%",
    note: "Effective rate, 36 mo",
    build: () =>
      newOption({
        name: "Dealer in-house (18%)",
        type: "in_house_financing",
        provider: "Dealer",
        monthlyMode: "annual_effective",
        annualEffectiveRate: 18,
        termMonths: 36,
        paymentTiming: "oma",
      }),
  },
  {
    key: "c2c",
    label: "Credit-to-cash · 0.49%/mo",
    note: "Add-on, 24 mo",
    build: () =>
      newOption({
        name: "Credit-to-cash (0.49%)",
        type: "credit_to_cash",
        provider: "Credit card",
        monthlyMode: "monthly_addon",
        monthlyAddOnRate: 0.49,
        termMonths: 24,
        paymentTiming: "arrears",
      }),
  },
];
