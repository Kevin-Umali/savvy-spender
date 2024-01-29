export type InstallmentOption = {
  months: number | string;
  simpleInterest: number | string;
  factorRate: number | string;
  eirPA: number | string;
  monthlyPayment: number | string;
  interest: number | string;
  totalPayment: number | string;
  processingFee?: number | string;
};

export type AllInstallmentOption = {
  selected?: InstallmentOption;
  others: Array<InstallmentOption>;
};

export type PaymentDifferences = {
  totalFullPayment: number;
  totalInstallmentWithInterest: number;
  totalInstallmentWithZeroPercent?: number;
};
