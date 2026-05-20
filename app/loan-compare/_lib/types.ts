import type { DiscountAppliesTo, FinancingKey, PaymentType } from "./options";

export interface VehicleInput {
  name: string;
  originalPrice: number;
  dealerDiscount: number;
  discountAppliesTo: DiscountAppliesTo;
  selectedOptions: FinancingKey[];
}

export interface BankInput {
  bankName: string;
  downPayment: number;
  loanAmount: number;
  termMonths: number;
  monthlyAmortization: number;
  paymentType: PaymentType;
  chattelMortgage: number;
  bankFees: number;
  docStampTax: number;
  notarial: number;
  ltoEncumbrance: number;
  registration: number;
  comprehensiveInsurance: number;
  ctpl: number;
  otherFees: number;
  promoNotes: string;
}

export interface C2cInput {
  providerName: string;
  loanableAmount: number;
  termMonths: number;
  monthlyAddOnRate: number;
  eirpa: number;
  monthlyPaymentOverride: number;
  processingFee: number;
  registration: number;
  comprehensiveInsurance: number;
  ctpl: number;
  otherFees: number;
  promoNotes: string;
}

export interface InHouseInput {
  dealerName: string;
  downPayment: number;
  loanAmount: number;
  termMonths: number;
  monthlyAmortization: number;
  paymentType: PaymentType;
  chattelMortgage: number;
  processingFee: number;
  documentationFee: number;
  registration: number;
  comprehensiveInsurance: number;
  ctpl: number;
  otherFees: number;
  promoNotes: string;
}

export interface ScenarioInput {
  vehicle: VehicleInput;
  bank: BankInput;
  c2c: C2cInput;
  inHouse: InHouseInput;
}

export interface OptionResult {
  key: FinancingKey;
  label: string;
  discountApplied: boolean;
  discountedPrice: number;

  downPayment: number;
  cashPortion: number;
  loanAmount: number;
  oneMonthAdvance: number;
  totalFees: number;
  upfrontCash: number;

  termMonths: number;
  monthlyPayment: number;
  monthlyLabel: string;
  totalMonthlyPayments: number;
  paymentTypeLabel: string;

  totalCost: number;
  financingCostAboveDiscounted: number;

  totalInterest?: number;
  totalRepayment?: number;
  monthlyAddOnRate?: number;
  eirpa?: number;
  loanableAmount?: number;

  warnings: string[];
}

export interface LoanCompareResponse {
  vehicleName: string;
  originalPrice: number;
  dealerDiscount: number;
  discountAppliesTo: DiscountAppliesTo;
  results: OptionResult[];
}
