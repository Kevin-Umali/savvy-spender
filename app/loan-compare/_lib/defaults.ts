import type { FinancingOption, FeeItem, ScenarioInput } from "./types";
import type { FinancingType, MonthlyMode, PaymentTiming } from "./options";

let idCounter = 0;
/** Stable-ish id; uses crypto.randomUUID when available. */
export function newId(prefix = "opt"): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return `${prefix}-${crypto.randomUUID()}`;
  idCounter += 1;
  return `${prefix}-${Date.now()}-${idCounter}`;
}

export function newFee(partial: Partial<FeeItem> = {}): FeeItem {
  return {
    id: newId("fee"),
    name: "",
    amount: 0,
    timing: "upfront",
    includedInMonthly: false,
    includedInUpfront: false,
    waived: false,
    waivedAmount: 0,
    notes: "",
    ...partial,
  };
}

export function newOption(partial: Partial<FinancingOption> = {}): FinancingOption {
  return {
    id: newId(),
    name: "",
    type: "bank_auto_loan",
    provider: "",
    termMonths: 36,
    loanAmount: 0,
    downPayment: 0,
    paymentTiming: "oma",
    monthlyMode: "quoted",
    quotedMonthly: 0,
    monthlyAddOnRate: 0,
    totalAddOnRate: 0,
    annualEffectiveRate: 0,
    annualNominalRate: 0,
    manualTotalRepayment: 0,
    receivesDiscount: true,
    fees: [],
    insurance: {
      mode: "exclude",
      comprehensive: 0,
      ctpl: 0,
      actsOfNature: 0,
      provider: "",
      recurringYearly: false,
      requiredByLender: false,
    },
    registration: {
      mode: "exclude",
      ltoRegistration: 0,
      plateFee: 0,
      ctpl: 0,
      otherLto: 0,
      includedInDealerPackage: false,
    },
    notes: "",
    ...partial,
  };
}

export const EMPTY_SCENARIO: ScenarioInput = {
  vehicle: {
    name: "",
    originalPrice: 0,
    discountAmount: 0,
    discountType: "fixed",
    discountAppliesTo: "all",
    otherDiscounts: 0,
    reservationFee: 0,
    accessories: 0,
    otherCharges: 0,
  },
  options: [newOption({ name: "Option 1" })],
  priority: "balanced",
  scope: "full_purchase",
  fullTerm: false,
};

// Helper to build a sample option compactly.
function sample(
  name: string,
  type: FinancingType,
  monthlyMode: MonthlyMode,
  paymentTiming: PaymentTiming,
  extra: Partial<FinancingOption>
): FinancingOption {
  return newOption({ name, type, paymentTiming, monthlyMode, loanAmount: 1_000_000, termMonths: 36, ...extra });
}

/**
 * Sample: Toyota Yaris Cross 2026 — normalized ₱1,000,000 / 36-month loan-only
 * comparison from the spec (section 17). Down payment is set so DP + loan = net
 * price, so total-cost ranking matches the loan-only ranking. Scope defaults to
 * loan-only to reproduce the spec's expected comparison table.
 */
export const SAMPLE_SCENARIO: ScenarioInput = {
  vehicle: {
    name: "Toyota Yaris Cross 2026",
    originalPrice: 1_690_000,
    discountAmount: 90_000,
    discountType: "fixed",
    discountAppliesTo: "all",
    otherDiscounts: 0,
    reservationFee: 0,
    accessories: 0,
    otherCharges: 0,
  },
  options: [
    sample("MB Auto Loan OMA", "bank_auto_loan", "total_addon", "oma", {
      provider: "Metrobank",
      downPayment: 600_000,
      totalAddOnRate: 13.19,
    }),
    sample("MB Auto Loan Arrears", "bank_auto_loan", "total_addon", "arrears", {
      provider: "Metrobank",
      downPayment: 600_000,
      totalAddOnRate: 13.94,
    }),
    sample("BPI Auto Loan OMA", "bank_auto_loan", "quoted", "oma", {
      provider: "BPI",
      downPayment: 600_000,
      quotedMonthly: 32_433.64,
    }),
    sample("BPI Auto Loan Arrears", "bank_auto_loan", "quoted", "arrears", {
      provider: "BPI",
      downPayment: 600_000,
      quotedMonthly: 32_711.75,
    }),
    sample("Credit-to-Cash 0.49%", "credit_to_cash", "monthly_addon", "arrears", {
      provider: "Credit card",
      monthlyAddOnRate: 0.49,
      annualEffectiveRate: 10.82,
    }),
    sample("Credit-to-Cash 0.59%", "credit_to_cash", "monthly_addon", "arrears", {
      provider: "Credit card",
      monthlyAddOnRate: 0.59,
      annualEffectiveRate: 12.97,
    }),
  ],
  priority: "balanced",
  scope: "loan_only",
  fullTerm: false,
};
