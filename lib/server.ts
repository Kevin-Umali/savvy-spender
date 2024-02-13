import { InstallmentOption } from "@/interfaces";

export const calculateRate = (
  periods: number,
  payment: number,
  present: number,
  future: number = 0,
  type: number = 0,
  guess: number = 0.01
): number => {
  // https://support.microsoft.com/en-gb/office/rate-function-9f665657-4a7e-4bb7-a030-83fc59e748ce
  const epsMax = 1e-10;
  const iterMax = 10;
  let y,
    y0,
    y1,
    x0,
    x1 = 0,
    f = 0,
    i = 0;
  let rate = guess;

  if (Math.abs(rate) < epsMax) {
    y = present * (1 + periods * rate) + payment * (1 + rate * type) * periods + future;
  } else {
    f = Math.exp(periods * Math.log(1 + rate));
    y = present * f + payment * (1 / rate + type) * (f - 1) + future;
  }

  y0 = present + payment * periods + future;
  y1 = present * f + payment * (1 / rate + type) * (f - 1) + future;
  i = x0 = 0;
  x1 = rate;

  while (Math.abs(y0 - y1) > epsMax && i < iterMax) {
    rate = (y1 * x0 - y0 * x1) / (y1 - y0);
    x0 = x1;
    x1 = rate;

    if (Math.abs(rate) < epsMax) {
      y = present * (1 + periods * rate) + payment * (1 + rate * type) * periods + future;
    } else {
      f = Math.exp(periods * Math.log(1 + rate));
      y = present * f + payment * (1 / rate + type) * (f - 1) + future;
    }

    y0 = y1;
    y1 = y;
    ++i;
  }

  return rate;
};

export const suggestPrincipalBinarySearch = (
  installmentAmountWithZeroInterest: number,
  interestRate: number,
  numInstallments: number,
  processingFee: number
) => {
  let low = 0;
  let high = installmentAmountWithZeroInterest;
  let middle;
  let totalCostWithInterest;
  let bestSuggestion = 0;

  while (low <= high) {
    middle = (low + high) / 2;
    let totalInterest = middle * interestRate * numInstallments;
    totalCostWithInterest = middle + totalInterest + processingFee;

    if (totalCostWithInterest <= installmentAmountWithZeroInterest) {
      bestSuggestion = middle;
      low = middle + 1;
    } else {
      high = middle - 1;
    }
  }

  return Math.floor(bestSuggestion);
};

const calculateSimpleInterest = (amount: number, rate: number, periods: number) => amount * rate * periods;

const formatNumber = (number: number, decimals: number) => Number(number.toFixed(decimals));

export const calculateInstallmentOption = (
  principal: number,
  installmentAmount: number,
  monthlyInterestRate: number, // Monthly interest rate as a decimal
  numInstallments: number,
  processingFee: number = 0
): InstallmentOption => {
  const simpleInterestTotal = calculateSimpleInterest(principal, monthlyInterestRate, numInstallments);
  const simpleInterestPercentage = formatNumber((simpleInterestTotal / principal) * 100, 2);

  // Factor rate calculation for installment payments
  const factorRateValue = (1 + simpleInterestPercentage / 100) / numInstallments;
  const formattedFactorRateValue = formatNumber(factorRateValue, 4);

  const totalPayment = principal + simpleInterestTotal;
  const formattedTotalPayment = formatNumber(totalPayment + processingFee, 2);

  const monthlyPayment = totalPayment / numInstallments;
  const formattedMonthlyPayment = formatNumber(monthlyPayment, 2);

  // Assuming calculateRate() is a defined function elsewhere in your codebase for calculating EIR
  const eirPAValue = calculateRate(numInstallments, -factorRateValue, 1) * 12;
  const eirPAPercentage = formatNumber(eirPAValue * 100, 2);

  // Use a binary search method to suggest a principal amount
  const suggestedPrincipal = suggestPrincipalBinarySearch(
    installmentAmount,
    monthlyInterestRate,
    numInstallments,
    processingFee
  );

  // Calculate the suggested principal or amount
  const simpleInterestTotalSuggested = calculateSimpleInterest(
    suggestedPrincipal,
    monthlyInterestRate,
    numInstallments
  );
  const totalPaymentSuggested = formatNumber(suggestedPrincipal + simpleInterestTotalSuggested + processingFee, 2);

  return {
    months: numInstallments,
    simpleInterest: simpleInterestPercentage.toString(),
    factorRate: formattedFactorRateValue,
    eirPA: eirPAPercentage.toString(),
    monthlyPayment: formattedMonthlyPayment,
    interest: simpleInterestTotal,
    totalPayment: formattedTotalPayment,
    suggestedPrincipal: {
      suggested: suggestedPrincipal,
      totalPayment: totalPaymentSuggested,
    },
  };
};
