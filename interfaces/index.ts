export type InstallmentOption = {
  months: number | string;
  simpleInterest: number | string;
  factorRate: number | string;
  eirPA: number | string;
  monthlyPayment: number | string;
  interest: number | string;
  totalPayment: number | string;
  processingFee?: number | string;
  suggestedPrincipal: SuggestedPrincipalOption;
};

export type SuggestedPrincipalOption = {
  suggested: number | string;
  totalPayment: number | string;
};

export type AllInstallmentOption = {
  selected?: InstallmentOption;
  others: Array<InstallmentOption>;
  monthlyBudget?: number;
};

export type PaymentDifferences = {
  totalFullPayment: number;
  totalInstallmentWithInterest: number;
  totalInstallmentWithZeroPercent?: number;
};
