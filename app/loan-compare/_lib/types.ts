import type {
  ComparisonScope,
  DiscountAppliesTo,
  DiscountType,
  FeeTiming,
  FinancingType,
  MonthlyMode,
  PaymentTiming,
  Priority,
  ValueMode,
} from "./options";

// ── Inputs ─────────────────────────────────────────────────────────

export interface FeeItem {
  id: string;
  name: string;
  amount: number;
  timing: FeeTiming;
  includedInMonthly: boolean; // already baked into the quoted monthly payment
  includedInUpfront: boolean; // already baked into the down payment / cash out
  waived: boolean; // free / waived — adds ₱0 to totals
  waivedAmount: number; // original value, shown for reference only
  notes: string;
}

export interface InsuranceInput {
  mode: ValueMode;
  comprehensive: number;
  ctpl: number;
  actsOfNature: number;
  provider: string;
  recurringYearly: boolean; // false = first-year only
  requiredByLender: boolean;
}

export interface RegistrationInput {
  mode: ValueMode;
  ltoRegistration: number;
  plateFee: number;
  ctpl: number;
  otherLto: number;
  includedInDealerPackage: boolean;
}

export interface FinancingOption {
  id: string;
  name: string;
  type: FinancingType;
  provider: string;
  termMonths: number;
  loanAmount: number;
  downPayment: number;
  paymentTiming: PaymentTiming;
  monthlyMode: MonthlyMode;
  // Rate / payment inputs — only the one matching monthlyMode is used.
  quotedMonthly: number;
  monthlyAddOnRate: number; // %
  totalAddOnRate: number; // %
  annualEffectiveRate: number; // EIRPA %, also displayed as reference
  annualNominalRate: number; // %
  manualTotalRepayment: number;
  receivesDiscount: boolean; // honoured when discountAppliesTo === "selected"
  fees: FeeItem[];
  insurance: InsuranceInput;
  registration: RegistrationInput;
  notes: string;
}

export interface VehicleInput {
  name: string;
  originalPrice: number;
  discountAmount: number;
  discountType: DiscountType;
  discountAppliesTo: DiscountAppliesTo;
  otherDiscounts: number;
  reservationFee: number;
  accessories: number;
  otherCharges: number;
}

export interface ScenarioInput {
  vehicle: VehicleInput;
  options: FinancingOption[];
  priority: Priority;
  scope: ComparisonScope;
  fullTerm: boolean; // include recurring (yearly) insurance across the full term
}

// ── Results ────────────────────────────────────────────────────────

export interface FeeBreakdown {
  name: string;
  amount: number; // effective amount counted into totals
  display: number; // original value (for waived rows)
  timing: FeeTiming;
  counted: boolean; // false when already included or excluded
  waived: boolean;
}

export interface OptionResult {
  id: string;
  name: string;
  type: FinancingType;
  typeLabel: string;
  provider: string;

  discountApplied: boolean;
  discountedPrice: number;
  netVehiclePrice: number;

  termMonths: number;
  paymentTiming: PaymentTiming;
  paymentTypeLabel: string;

  monthlyMode: MonthlyMode;
  monthlyLabel: string;
  monthlyPayment: number;
  totalLoanPayments: number;
  totalInterest: number;
  totalRepayment: number;
  effectiveAddOnRate: number; // total interest / loan
  monthlyAddOnEquivalent: number; // effectiveAddOnRate / term
  eirpa?: number; // carried for display when provided

  loanAmount: number;
  downPayment: number;
  cashPortion: number;
  cashSurplus: number;
  oneMonthAdvance: number;
  reservationFee: number;

  fees: FeeBreakdown[];
  upfrontFees: number;
  feesInTotal: number;
  waivedFeesTotal: number;
  insuranceTotal: number;
  insuranceDisplay: number;
  registrationTotal: number;
  registrationDisplay: number;

  upfrontCash: number;
  totalCost: number;
  financingCostAboveDiscounted: number;
  differenceVsCheapest: number;

  warnings: string[];
}

export interface Recommendation {
  key:
    | "lowest-total"
    | "lowest-monthly"
    | "lowest-upfront"
    | "lowest-interest"
    | "no-chattel"
    | "simplest";
  label: string;
  optionId: string;
  optionName: string;
  detail: string;
}

export interface LoanCompareResponse {
  vehicleName: string;
  originalPrice: number;
  discountAmount: number;
  discountType: DiscountType;
  discountAppliesTo: DiscountAppliesTo;
  scope: ComparisonScope;
  fullTerm: boolean;
  cheapestId: string | null;
  results: OptionResult[];
  recommendations: Recommendation[];
}
