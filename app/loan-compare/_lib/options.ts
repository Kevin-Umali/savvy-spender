export const FINANCING_KEYS = ["bank", "c2c", "in-house"] as const;
export type FinancingKey = (typeof FINANCING_KEYS)[number];

export const FINANCING_META: Record<
  FinancingKey,
  { label: string; shortLabel: string; tagline: string }
> = {
  bank: {
    label: "Bank Auto Loan",
    shortLabel: "Bank Loan",
    tagline: "Secured loan from a bank, vehicle as collateral.",
  },
  c2c: {
    label: "Credit-to-Cash / Personal Loan",
    shortLabel: "Credit-to-Cash",
    tagline: "Borrow cash from card or personal loan, pay car as cash.",
  },
  "in-house": {
    label: "In-House Financing",
    shortLabel: "In-House",
    tagline: "Direct financing from the dealer.",
  },
};

export const DISCOUNT_APPLIES_OPTIONS = [
  { value: "all", label: "All options" },
  { value: "bank", label: "Bank auto loan only" },
  { value: "c2c", label: "Credit-to-cash only" },
  { value: "in-house", label: "In-house financing only" },
  { value: "selected", label: "Selected options" },
  { value: "none", label: "None" },
] as const;
export type DiscountAppliesTo = (typeof DISCOUNT_APPLIES_OPTIONS)[number]["value"];

export const PAYMENT_TYPE_OPTIONS = [
  { value: "oma", label: "OMA (One Month Advance)" },
  { value: "arrears", label: "Arrears" },
] as const;
export type PaymentType = (typeof PAYMENT_TYPE_OPTIONS)[number]["value"];

export const PRIORITY_OPTIONS = [
  { value: "lowest-total", label: "Lowest total cost" },
  { value: "lowest-monthly", label: "Lowest monthly payment" },
  { value: "lowest-upfront", label: "Lowest upfront cash" },
  { value: "no-chattel", label: "No chattel mortgage" },
  { value: "fastest-approval", label: "Fastest / simplest approval" },
  { value: "ownership-flexibility", label: "Ownership flexibility" },
] as const;
export type Priority = (typeof PRIORITY_OPTIONS)[number]["value"];

export const TERM_OPTIONS = [12, 24, 36, 48, 60, 72] as const;
