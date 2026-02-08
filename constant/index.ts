export const INSTALLMENT_PLAN_LIST = ["3", "6", "9", "12", "15", "18", "21", "24", "27", "30", "33", "36"];

export const PERSONAL_LOAN_PLAN_LIST = ["6", "12", "18", "24", "30", "36"];

export const CALCULATOR_TYPES = [
  {
    value: "balance-conversion",
    label: "Balance Conversion",
    description: "Bought something with your credit card? Compare bank installment vs. 0% merchant plans.",
  },
  {
    value: "credit-to-cash",
    label: "Credit-to-Cash",
    description: "Convert your available credit limit into cash deposited to your bank account.",
  },
  {
    value: "personal-loan",
    label: "Personal Loan",
    description: "Calculate bank personal loan payments with DST and origination fees.",
  },
] as const;

export type CalculatorType = (typeof CALCULATOR_TYPES)[number]["value"];

export const CALCULATOR_CONFIG: Record<
  CalculatorType,
  {
    amountLabel: string;
    amountPlaceholder: string;
    amountDescription: string;
    showInstallmentAmount: boolean;
    showDST: boolean;
    installmentPlans: string[];
    processingFeeLabel: string;
    processingFeePlaceholder: string;
    processingFeeDescription: string;
    defaultInterestRate: number;
    defaultProcessingFee: number;
  }
> = {
  "balance-conversion": {
    amountLabel: "Principal / Amount",
    amountPlaceholder: "Enter principal or amount of the item",
    amountDescription:
      "The full cash price of the item or total amount that will be converted into bank installments.",
    showInstallmentAmount: true,
    showDST: false,
    installmentPlans: INSTALLMENT_PLAN_LIST,
    processingFeeLabel: "Processing Fee",
    processingFeePlaceholder: "Enter processing fee (e.g., 300-500)",
    processingFeeDescription:
      "One-time fee charged by the bank for the conversion (typically ₱300–₱500).",
    defaultInterestRate: 0.99,
    defaultProcessingFee: 0,
  },
  "credit-to-cash": {
    amountLabel: "Amount to Convert",
    amountPlaceholder: "Enter amount to convert to cash",
    amountDescription:
      "The amount from your available credit limit you want to receive as cash in your bank account.",
    showInstallmentAmount: false,
    showDST: false,
    installmentPlans: INSTALLMENT_PLAN_LIST,
    processingFeeLabel: "Processing Fee",
    processingFeePlaceholder: "Enter processing fee (e.g., 250-500)",
    processingFeeDescription:
      "One-time fee charged by the bank for the cash conversion (typically ₱250–₱500).",
    defaultInterestRate: 0.99,
    defaultProcessingFee: 0,
  },
  "personal-loan": {
    amountLabel: "Loan Amount",
    amountPlaceholder: "Enter loan amount",
    amountDescription:
      "The total amount you want to borrow. Net proceeds will be less after DST and fees are deducted.",
    showInstallmentAmount: false,
    showDST: true,
    installmentPlans: PERSONAL_LOAN_PLAN_LIST,
    processingFeeLabel: "Origination / Disbursement Fee",
    processingFeePlaceholder: "Enter origination fee (e.g., 1300-1500)",
    processingFeeDescription:
      "Bank disbursement or origination fee deducted from loan proceeds (typically ₱1,300–₱1,500).",
    defaultInterestRate: 1.25,
    defaultProcessingFee: 1500,
  },
};

/** DST rate: ₱1.50 per ₱200 of loan face value (~0.75%) */
export const DST_RATE_PER_200 = 1.5;
/** Loans at or below this amount are DST-exempt for personal use */
export const DST_EXEMPTION_THRESHOLD = 250000;
