// ── Financing types ────────────────────────────────────────────────
export const FINANCING_TYPE_OPTIONS = [
  { value: "bank_auto_loan", label: "Bank Auto Loan" },
  { value: "credit_to_cash", label: "Credit-to-Cash" },
  { value: "personal_loan", label: "Personal Loan" },
  { value: "in_house_financing", label: "In-House Financing" },
  { value: "custom", label: "Custom" },
] as const;
export type FinancingType = (typeof FINANCING_TYPE_OPTIONS)[number]["value"];

export const FINANCING_TYPE_LABEL: Record<FinancingType, string> = Object.fromEntries(
  FINANCING_TYPE_OPTIONS.map((o) => [o.value, o.label])
) as Record<FinancingType, string>;

/** Types that behave like a cash purchase from the dealer's perspective (no chattel mortgage). */
export const CASH_STYLE_TYPES: FinancingType[] = ["credit_to_cash", "personal_loan"];

// ── Payment timing ─────────────────────────────────────────────────
export const PAYMENT_TIMING_OPTIONS = [
  { value: "oma", label: "OMA (One Month Advance)" },
  { value: "arrears", label: "Arrears" },
  { value: "custom", label: "Custom" },
] as const;
export type PaymentTiming = (typeof PAYMENT_TIMING_OPTIONS)[number]["value"];

// ── Monthly payment computation mode ───────────────────────────────
export const MONTHLY_MODE_OPTIONS = [
  { value: "quoted", label: "Quoted monthly payment" },
  { value: "monthly_addon", label: "Compute from monthly add-on rate" },
  { value: "total_addon", label: "Compute from total add-on rate" },
  { value: "annual_effective", label: "Compute from annual effective rate" },
  { value: "annual_nominal", label: "Compute from annual nominal rate" },
  { value: "manual_total", label: "Manual total repayment" },
] as const;
export type MonthlyMode = (typeof MONTHLY_MODE_OPTIONS)[number]["value"];

export const MONTHLY_MODE_SHORT: Record<MonthlyMode, string> = {
  quoted: "Quoted monthly",
  monthly_addon: "Monthly add-on",
  total_addon: "Total add-on",
  annual_effective: "Annual effective (EIR)",
  annual_nominal: "Annual nominal",
  manual_total: "Manual total",
};

// ── Discounts ──────────────────────────────────────────────────────
export const DISCOUNT_TYPE_OPTIONS = [
  { value: "fixed", label: "Fixed amount (₱)" },
  { value: "percent", label: "Percentage (%)" },
] as const;
export type DiscountType = (typeof DISCOUNT_TYPE_OPTIONS)[number]["value"];

export const DISCOUNT_APPLIES_OPTIONS = [
  { value: "all", label: "All options" },
  { value: "selected", label: "Selected options only" },
  { value: "none", label: "None" },
] as const;
export type DiscountAppliesTo = (typeof DISCOUNT_APPLIES_OPTIONS)[number]["value"];

// ── Fees ───────────────────────────────────────────────────────────
export const FEE_TIMING_OPTIONS = [
  { value: "upfront", label: "Upfront" },
  { value: "monthly", label: "Monthly" },
  { value: "annual", label: "Annual" },
  { value: "one_time_later", label: "One-time later" },
] as const;
export type FeeTiming = (typeof FEE_TIMING_OPTIONS)[number]["value"];

// ── Insurance / registration value mode ────────────────────────────
export const VALUE_MODE_OPTIONS = [
  { value: "exact", label: "Exact quoted amount" },
  { value: "estimated", label: "Estimated amount" },
  { value: "exclude", label: "Exclude from computation" },
  { value: "free", label: "Free (₱0 added)" },
  { value: "included", label: "Already included" },
] as const;
export type ValueMode = (typeof VALUE_MODE_OPTIONS)[number]["value"];

/** Modes that contribute ₱0 to totals (but may still display an original value). */
export const ZERO_VALUE_MODES: ValueMode[] = ["exclude", "free", "included"];

// ── Priority ───────────────────────────────────────────────────────
export const PRIORITY_OPTIONS = [
  { value: "balanced", label: "Balanced recommendation" },
  { value: "lowest-total", label: "Lowest total cost" },
  { value: "lowest-monthly", label: "Lowest monthly payment" },
  { value: "lowest-upfront", label: "Lowest upfront cash" },
  { value: "lowest-interest", label: "Lowest interest" },
  { value: "no-chattel", label: "No chattel mortgage" },
  { value: "fastest-approval", label: "Fastest approval" },
  { value: "lowest-paperwork", label: "Lowest paperwork" },
  { value: "ownership-flexibility", label: "Ownership flexibility" },
] as const;
export type Priority = (typeof PRIORITY_OPTIONS)[number]["value"];

// ── Comparison scope (which lens the totals are read through) ───────
export const COMPARISON_SCOPE_OPTIONS = [
  { value: "full_purchase", label: "Full car purchase" },
  { value: "loan_only", label: "Loan-only" },
  { value: "upfront", label: "Upfront cash" },
  { value: "fee_inclusive", label: "Fee-inclusive" },
] as const;
export type ComparisonScope = (typeof COMPARISON_SCOPE_OPTIONS)[number]["value"];

export const TERM_OPTIONS = [12, 24, 36, 48, 60, 72] as const;
