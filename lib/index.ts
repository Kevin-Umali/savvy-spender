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

export const calculateInstallmentOption = (
  principal: number,
  monthlyInterestRate: number, // Monthly interest rate as a decimal
  numInstallments: number, // Number of monthly installments
  processingFee: number = 0 // Optional processing fee
): InstallmentOption => {
  // Calculate the total interest over the loan period.
  const simpleInterestTotal = principal * monthlyInterestRate * numInstallments;
  const simpleInterestPercentage = (simpleInterestTotal / principal) * 100;

  // The factor rate formula as per the specification: (1 + interest percentage) / number of installments.
  // The interest percentage must be in decimal form for this calculation.
  const factorRateValue = (1 + simpleInterestPercentage / 100) / numInstallments;
  const formattedFactorRateValue = Number(factorRateValue.toFixed(4));

  // Calculate the total payment by adding the principal, total interest, and processing fee.
  const totalPayment = principal + simpleInterestTotal;
  const formattedTotalPayment = Number((totalPayment + processingFee).toFixed(2));

  // Determine the monthly payment by dividing the total payment by the number of installments.
  const monthlyPayment = totalPayment / numInstallments;
  const formattedMonthlyPayment = Number(monthlyPayment.toFixed(2));

  // Calculate the Effective Interest Rate per annum (EIR PA)
  // Here, we multiply by 12 to convert the rate to an annual rate
  const eirPAValue = calculateRate(numInstallments, -factorRateValue, 1) * 12;
  const eirPAPercentage = eirPAValue * 100;

  return {
    months: numInstallments, // Number of months for the loan repayment
    simpleInterest: simpleInterestPercentage.toFixed(2), // Simple interest rate as a percentage
    factorRate: formattedFactorRateValue, // Factor rate as a decimal, rounded to four places
    eirPA: eirPAPercentage.toFixed(2), // Effective annual interest rate as a percentage
    monthlyPayment: formattedMonthlyPayment, // Monthly payment, rounded to two decimal places
    interest: simpleInterestTotal, // Total interest amount over the period
    totalPayment: formattedTotalPayment, // Total payment amount, rounded to two decimal places
  };
};

export const cleanMarkdown = (content: string): string => {
  return content
    .split("\n")
    .map((line) => line.trimStart())
    .join("\n");
};
