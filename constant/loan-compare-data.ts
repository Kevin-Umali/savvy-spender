export const FINANCING_TYPES = [
  {
    key: "in-house" as const,
    label: "In-House Financing",
    shortLabel: "In-House",
    description: "Direct financing from the car dealer or developer.",
    defaultRate: 1.5,
    defaultTerm: 36,
    defaultDpPct: 20,
    defaultProcessingFee: 0,
    defaultChattelMortgage: 0,
    defaultDocStamp: 0,
    rateRange: "1.5–2.5% / mo",
    notes: "Higher rate but often more flexible on down payment and credit requirements.",
    requiresDP: true,
  },
  {
    key: "bank-auto" as const,
    label: "Bank Auto Loan",
    shortLabel: "Bank Loan",
    description: "Secured loan from a bank, backed by the vehicle as collateral.",
    defaultRate: 0.72,
    defaultTerm: 48,
    defaultDpPct: 20,
    defaultProcessingFee: 2000,
    defaultChattelMortgage: 3000,
    defaultDocStamp: 0,
    rateRange: "0.47–0.98% / mo",
    notes: "Lowest interest rate. Requires credit check, chattel mortgage registration, and comprehensive car insurance.",
    requiresDP: true,
  },
  {
    key: "credit-to-cash" as const,
    label: "Credit-to-Cash",
    shortLabel: "Credit-to-Cash",
    description: "Convert credit card available limit into cash disbursed to your account.",
    defaultRate: 0.99,
    defaultTerm: 24,
    defaultDpPct: 0,
    defaultProcessingFee: 0,
    defaultChattelMortgage: 0,
    defaultDocStamp: 0,
    rateRange: "0.99% / mo (BSP cap)",
    notes: "No down payment, no collateral. Limited by your available credit limit. No asset ownership transfer involved.",
    requiresDP: false,
  },
] as const;

export type FinancingKey = (typeof FINANCING_TYPES)[number]["key"];

export const TERM_OPTIONS = [
  "12", "18", "24", "30", "36", "48", "60",
];
