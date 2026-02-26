import { calculateRate } from "./server";

// ============================================
// Affordability Calculator (#5)
// Given monthly budget, rate, term → max principal
// ============================================
export interface AffordabilityResult {
  months: number;
  maxPrincipal: number;
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
}

export const calculateAffordability = (
  monthlyBudget: number,
  monthlyRate: number,
  months: number,
  processingFee: number = 0
): AffordabilityResult => {
  // monthly = principal * (1 + rate * months) / months
  // principal = (monthly * months) / (1 + rate * months) - processingFee adjustment
  const factor = 1 + monthlyRate * months;
  const maxPrincipal = Math.floor((monthlyBudget * months - processingFee) / factor);
  const totalInterest = maxPrincipal * monthlyRate * months;
  const totalPayment = maxPrincipal + totalInterest + processingFee;
  return {
    months,
    maxPrincipal: Math.max(0, maxPrincipal),
    monthlyPayment: totalPayment / months,
    totalPayment,
    totalInterest,
  };
};

// ============================================
// Loan Comparison (#6)
// Compare two bank offers
// ============================================
export interface LoanOffer {
  name: string;
  rate: number;
  processingFee: number;
}

export interface LoanComparisonResult {
  months: number;
  offerA: { monthlyPayment: number; totalPayment: number; totalInterest: number };
  offerB: { monthlyPayment: number; totalPayment: number; totalInterest: number };
  savings: number;
  winner: "A" | "B" | "tie";
}

export const compareLoanOffers = (
  principal: number,
  offerA: LoanOffer,
  offerB: LoanOffer,
  months: number
): LoanComparisonResult => {
  const calcOffer = (rate: number, fee: number) => {
    const totalInterest = principal * rate * months;
    const totalPayment = principal + totalInterest + fee;
    const monthlyPayment = totalPayment / months;
    return { monthlyPayment, totalPayment, totalInterest };
  };
  const a = calcOffer(offerA.rate, offerA.processingFee);
  const b = calcOffer(offerB.rate, offerB.processingFee);
  const savings = Math.abs(a.totalPayment - b.totalPayment);
  const winner = a.totalPayment < b.totalPayment ? "A" : a.totalPayment > b.totalPayment ? "B" : "tie";
  return { months, offerA: a, offerB: b, savings, winner };
};

// ============================================
// Early Payoff Calculator (#7)
// ============================================
export interface EarlyPayoffResult {
  originalMonths: number;
  newMonths: number;
  monthsSaved: number;
  originalTotalInterest: number;
  newTotalInterest: number;
  interestSaved: number;
  originalTotalPayment: number;
  newTotalPayment: number;
}

export const calculateEarlyPayoff = (
  principal: number,
  monthlyRate: number,
  originalMonths: number,
  extraPayment: number,
  processingFee: number = 0
): EarlyPayoffResult => {
  const originalTotalInterest = principal * monthlyRate * originalMonths;
  const originalTotalPayment = principal + originalTotalInterest + processingFee;
  const originalMonthly = originalTotalPayment / originalMonths;
  const newMonthly = originalMonthly + extraPayment;

  // With add-on interest (flat rate), paying extra reduces number of months
  // totalPayment = principal + principal*rate*months + fee
  // newMonthly * newMonths = principal + principal*rate*newMonths + fee
  // newMonthly * newMonths = principal*(1 + rate*newMonths) + fee
  // Solve for newMonths: newMonthly*m = principal + principal*rate*m + fee
  // m*(newMonthly - principal*rate) = principal + fee
  // m = (principal + fee) / (newMonthly - principal*rate)
  const denominator = newMonthly - principal * monthlyRate;
  let newMonths: number;
  if (denominator <= 0) {
    newMonths = originalMonths; // Extra payment too small to accelerate
  } else {
    newMonths = Math.ceil((principal + processingFee) / denominator);
    newMonths = Math.max(1, Math.min(newMonths, originalMonths));
  }

  const newTotalInterest = principal * monthlyRate * newMonths;
  const newTotalPayment = principal + newTotalInterest + processingFee;
  return {
    originalMonths,
    newMonths,
    monthsSaved: originalMonths - newMonths,
    originalTotalInterest,
    newTotalInterest,
    interestSaved: originalTotalInterest - newTotalInterest,
    originalTotalPayment,
    newTotalPayment,
  };
};

// ============================================
// Interest Rate Converter (#8)
// ============================================
export interface RateConversionResult {
  flatRateMonthly: number;
  flatRateAnnual: number;
  totalInterestPercent: number;
  eirMonthly: number;
  eirAnnual: number;
  factorRate: number;
}

export const convertInterestRate = (flatRateMonthly: number, months: number): RateConversionResult => {
  const totalInterestPercent = flatRateMonthly * months * 100;
  const factorRate = (1 + flatRateMonthly * months) / months;
  const eirMonthly = calculateRate(months, -factorRate, 1);
  const eirAnnual = eirMonthly * 12;
  return {
    flatRateMonthly: flatRateMonthly * 100,
    flatRateAnnual: flatRateMonthly * 12 * 100,
    totalInterestPercent,
    eirMonthly: eirMonthly * 100,
    eirAnnual: eirAnnual * 100,
    factorRate,
  };
};

// ============================================
// Break-Even Analyzer (#9)
// ============================================
export interface BreakEvenResult {
  breakEvenMonth: number | null;
  cashPrice: number;
  installmentPriceZero: number;
  monthlyData: Array<{
    month: number;
    bankTotal: number;
    merchantTotal: number;
    bankCheaper: boolean;
  }>;
}

export const calculateBreakEven = (
  cashPrice: number,
  installmentPriceZero: number,
  monthlyRate: number,
  processingFee: number,
  maxMonths: number = 36
): BreakEvenResult => {
  const monthlyData: BreakEvenResult["monthlyData"] = [];
  let breakEvenMonth: number | null = null;

  for (let m = 1; m <= maxMonths; m++) {
    const bankInterest = cashPrice * monthlyRate * m;
    const bankTotal = cashPrice + bankInterest + processingFee;
    const merchantTotal = installmentPriceZero;
    const bankCheaper = bankTotal < merchantTotal;
    monthlyData.push({ month: m, bankTotal, merchantTotal, bankCheaper });
    if (bankCheaper && breakEvenMonth === null) {
      breakEvenMonth = m;
    }
  }
  return { breakEvenMonth, cashPrice, installmentPriceZero, monthlyData };
};

// ============================================
// In-House Loan Calculator (#10)
// ============================================
export interface InHouseLoanResult {
  totalPrice: number;
  downPayment: number;
  loanAmount: number;
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  balloonPayment: number;
}

export const calculateInHouseLoan = (
  totalPrice: number,
  downPaymentPercent: number,
  monthlyRate: number,
  months: number,
  balloonPayment: number = 0
): InHouseLoanResult => {
  const downPayment = totalPrice * (downPaymentPercent / 100);
  const loanAmount = totalPrice - downPayment - balloonPayment;
  const totalInterest = loanAmount * monthlyRate * months;
  const totalPayment = loanAmount + totalInterest;
  const monthlyPayment = totalPayment / months;
  return {
    totalPrice,
    downPayment,
    loanAmount,
    monthlyPayment,
    totalInterest,
    totalPayment: totalPayment + downPayment + balloonPayment,
    balloonPayment,
  };
};

// ============================================
// Salary Calculator - PH (#11)
// ============================================
export interface SalaryBreakdown {
  grossMonthly: number;
  sss: number;
  philHealth: number;
  pagIbig: number;
  totalContributions: number;
  taxableIncome: number;
  withholdingTax: number;
  netTakeHome: number;
}

const calculateSSS = (monthlySalary: number): number => {
  // 2024 SSS contribution table (employee share)
  // MSC ranges from 4000 to 30000, contribution rate is 14% (split 4.5% employee, 9.5% employer)
  // Employee share is 4.5% of MSC
  if (monthlySalary < 4250) return 180;
  const msc = Math.min(Math.ceil(monthlySalary / 500) * 500, 30000);
  return msc * 0.045;
};

const calculatePhilHealth = (monthlySalary: number): number => {
  // 2024: 5% of salary, split 50/50. Employee share = 2.5%
  // Floor: 10000, Ceiling: 100000
  const base = Math.max(10000, Math.min(monthlySalary, 100000));
  return base * 0.025;
};

const calculatePagIbig = (monthlySalary: number): number => {
  // Employee: 1% if salary ≤ 1500, 2% if > 1500, max contribution base 10000
  // So max employee share = 200
  if (monthlySalary <= 1500) return monthlySalary * 0.01;
  return Math.min(monthlySalary, 10000) * 0.02;
};

const calculateWithholdingTax = (taxableIncome: number): number => {
  // Monthly TRAIN law tax table (2023 onwards)
  // Annual brackets divided by 12
  const annualTaxable = taxableIncome * 12;
  let annualTax: number;
  if (annualTaxable <= 250000) {
    annualTax = 0;
  } else if (annualTaxable <= 400000) {
    annualTax = (annualTaxable - 250000) * 0.15;
  } else if (annualTaxable <= 800000) {
    annualTax = 22500 + (annualTaxable - 400000) * 0.2;
  } else if (annualTaxable <= 2000000) {
    annualTax = 102500 + (annualTaxable - 800000) * 0.25;
  } else if (annualTaxable <= 8000000) {
    annualTax = 402500 + (annualTaxable - 2000000) * 0.3;
  } else {
    annualTax = 2202500 + (annualTaxable - 8000000) * 0.35;
  }
  return annualTax / 12;
};

export const calculateSalary = (grossMonthly: number): SalaryBreakdown => {
  const sss = calculateSSS(grossMonthly);
  const philHealth = calculatePhilHealth(grossMonthly);
  const pagIbig = calculatePagIbig(grossMonthly);
  const totalContributions = sss + philHealth + pagIbig;
  const taxableIncome = grossMonthly - totalContributions;
  const withholdingTax = calculateWithholdingTax(taxableIncome);
  const netTakeHome = grossMonthly - totalContributions - withholdingTax;
  return { grossMonthly, sss, philHealth, pagIbig, totalContributions, taxableIncome, withholdingTax, netTakeHome };
};

// ============================================
// Tax Calculator - PH (#12)
// ============================================
export interface TaxResult {
  annualIncome: number;
  taxDue: number;
  effectiveTaxRate: number;
  bracket: string;
  monthlyTax: number;
  afterTaxAnnual: number;
  afterTaxMonthly: number;
}

export interface FreelancerTaxComparison {
  graduated: TaxResult;
  flatRate: { annualIncome: number; taxDue: number; effectiveTaxRate: number; afterTaxAnnual: number };
  recommended: "graduated" | "flat";
}

export const calculateIncomeTax = (annualIncome: number): TaxResult => {
  let taxDue: number;
  let bracket: string;

  if (annualIncome <= 250000) {
    taxDue = 0;
    bracket = "0% (Tax-exempt)";
  } else if (annualIncome <= 400000) {
    taxDue = (annualIncome - 250000) * 0.15;
    bracket = "15% (₱250K–₱400K)";
  } else if (annualIncome <= 800000) {
    taxDue = 22500 + (annualIncome - 400000) * 0.2;
    bracket = "20% (₱400K–₱800K)";
  } else if (annualIncome <= 2000000) {
    taxDue = 102500 + (annualIncome - 800000) * 0.25;
    bracket = "25% (₱800K–₱2M)";
  } else if (annualIncome <= 8000000) {
    taxDue = 402500 + (annualIncome - 2000000) * 0.3;
    bracket = "30% (₱2M–₱8M)";
  } else {
    taxDue = 2202500 + (annualIncome - 8000000) * 0.35;
    bracket = "35% (Over ₱8M)";
  }

  const effectiveTaxRate = annualIncome > 0 ? (taxDue / annualIncome) * 100 : 0;
  return {
    annualIncome,
    taxDue,
    effectiveTaxRate,
    bracket,
    monthlyTax: taxDue / 12,
    afterTaxAnnual: annualIncome - taxDue,
    afterTaxMonthly: (annualIncome - taxDue) / 12,
  };
};

export const calculateFreelancerTax = (annualIncome: number): FreelancerTaxComparison => {
  const graduated = calculateIncomeTax(annualIncome);
  // 8% flat rate option (on gross income exceeding 250K)
  const flatTaxDue = annualIncome > 250000 ? (annualIncome - 250000) * 0.08 : 0;
  const flatRate = {
    annualIncome,
    taxDue: flatTaxDue,
    effectiveTaxRate: annualIncome > 0 ? (flatTaxDue / annualIncome) * 100 : 0,
    afterTaxAnnual: annualIncome - flatTaxDue,
  };
  return {
    graduated,
    flatRate,
    recommended: flatTaxDue <= graduated.taxDue ? "flat" : "graduated",
  };
};

// ============================================
// Debt Snowball / Avalanche Planner (#13)
// ============================================
export interface DebtItem {
  name: string;
  balance: number;
  monthlyRate: number;
  minimumPayment: number;
}

export interface DebtPayoffResult {
  method: "snowball" | "avalanche";
  totalMonths: number;
  totalPaid: number;
  totalInterest: number;
  order: string[];
  schedule: Array<{
    month: number;
    payments: Array<{ name: string; payment: number; remaining: number }>;
    totalRemaining: number;
  }>;
}

export const calculateDebtPayoff = (
  debts: DebtItem[],
  extraPayment: number,
  method: "snowball" | "avalanche"
): DebtPayoffResult => {
  // Sort debts based on method
  const sorted = [...debts].sort((a, b) =>
    method === "snowball" ? a.balance - b.balance : b.monthlyRate - a.monthlyRate
  );

  const balances = sorted.map((d) => d.balance);
  const order = sorted.map((d) => d.name);
  const schedule: DebtPayoffResult["schedule"] = [];
  let totalPaid = 0;
  let month = 0;
  const maxMonths = 600; // Safety limit

  while (balances.some((b) => b > 0.01) && month < maxMonths) {
    month++;
    let availableExtra = extraPayment;
    const payments: DebtPayoffResult["schedule"][0]["payments"] = [];

    for (let i = 0; i < sorted.length; i++) {
      if (balances[i] <= 0) {
        payments.push({ name: sorted[i].name, payment: 0, remaining: 0 });
        continue;
      }
      // Add interest (add-on style for simplicity)
      const interest = balances[i] * sorted[i].monthlyRate;
      balances[i] += interest;
      let payment = sorted[i].minimumPayment;

      // Apply extra payment to the first debt with balance (priority debt)
      const isFirstWithBalance = balances.findIndex((b) => b > 0.01) === i;
      if (isFirstWithBalance) {
        payment += availableExtra;
        availableExtra = 0;
      }

      payment = Math.min(payment, balances[i]);
      balances[i] -= payment;
      totalPaid += payment;
      payments.push({ name: sorted[i].name, payment, remaining: Math.max(0, balances[i]) });
    }

    schedule.push({
      month,
      payments,
      totalRemaining: balances.reduce((sum, b) => sum + Math.max(0, b), 0),
    });
  }

  const totalOriginal = debts.reduce((sum, d) => sum + d.balance, 0);
  return { method, totalMonths: month, totalPaid, totalInterest: totalPaid - totalOriginal, order, schedule };
};

// ============================================
// Savings Goal Calculator (#14)
// ============================================
export interface SavingsGoalResult {
  targetAmount: number;
  months: number;
  monthlyDeposit: number;
  totalDeposited: number;
  totalInterestEarned: number;
  milestones: Array<{ percent: number; month: number; amount: number }>;
}

export const calculateSavingsGoal = (
  targetAmount: number,
  months: number,
  annualRate: number = 0
): SavingsGoalResult => {
  const monthlyRate = annualRate / 12;
  let monthlyDeposit: number;

  if (monthlyRate > 0) {
    // FV = PMT * ((1+r)^n - 1) / r → PMT = FV * r / ((1+r)^n - 1)
    const factor = Math.pow(1 + monthlyRate, months) - 1;
    monthlyDeposit = (targetAmount * monthlyRate) / factor;
  } else {
    monthlyDeposit = targetAmount / months;
  }

  // Calculate milestones
  const milestones: SavingsGoalResult["milestones"] = [];
  let accumulated = 0;
  const targets = [25, 50, 75, 100];
  let targetIdx = 0;

  for (let m = 1; m <= months && targetIdx < targets.length; m++) {
    accumulated = accumulated * (1 + monthlyRate) + monthlyDeposit;
    const pct = (accumulated / targetAmount) * 100;
    if (pct >= targets[targetIdx]) {
      milestones.push({ percent: targets[targetIdx], month: m, amount: accumulated });
      targetIdx++;
    }
  }

  const totalDeposited = monthlyDeposit * months;
  return {
    targetAmount,
    months,
    monthlyDeposit,
    totalDeposited,
    totalInterestEarned: targetAmount - totalDeposited,
    milestones,
  };
};

// ============================================
// SSS Loan Calculator (#15)
// ============================================
export interface SSSLoanResult {
  loanAmount: number;
  monthlyAmortization: number;
  totalPayment: number;
  totalInterest: number;
  term: number;
}

export const calculateSSSLoan = (loanAmount: number, annualRate: number = 0.1, termMonths: number = 24): SSSLoanResult => {
  // SSS salary loan: 10% annual interest, 2-year term
  const monthlyRate = annualRate / 12;
  const totalInterest = loanAmount * monthlyRate * termMonths;
  const totalPayment = loanAmount + totalInterest;
  const monthlyAmortization = totalPayment / termMonths;
  return { loanAmount, monthlyAmortization, totalPayment, totalInterest, term: termMonths };
};

// ============================================
// Pag-IBIG Housing Loan Calculator (#16)
// ============================================
export interface PagIBIGLoanResult {
  loanAmount: number;
  monthlyAmortization: number;
  totalPayment: number;
  totalInterest: number;
  term: number;
  annualRate: number;
  mri: number;
  fireInsurance: number;
}

export const calculatePagIBIGLoan = (
  loanAmount: number,
  termYears: number = 30
): PagIBIGLoanResult => {
  // Pag-IBIG interest rates (2024):
  // ≤ 750K: 3% for first 5 yrs, 5.375% for remaining (use blended)
  // > 750K to 6M: 6.375%
  let annualRate: number;
  if (loanAmount <= 750000) {
    annualRate = termYears <= 5 ? 0.03 : 0.04; // Blended approximation
  } else {
    annualRate = 0.06375;
  }
  const monthlyRate = annualRate / 12;
  const termMonths = termYears * 12;

  // Standard amortization: PMT = P * r * (1+r)^n / ((1+r)^n - 1)
  const factor = Math.pow(1 + monthlyRate, termMonths);
  const monthlyAmortization = loanAmount * (monthlyRate * factor) / (factor - 1);
  const totalPayment = monthlyAmortization * termMonths;
  const totalInterest = totalPayment - loanAmount;

  // MRI and fire insurance estimates
  const mri = loanAmount * 0.0025; // Approximate annual MRI
  const fireInsurance = loanAmount * 0.001; // Approximate annual

  return { loanAmount, monthlyAmortization, totalPayment, totalInterest, term: termMonths, annualRate, mri, fireInsurance };
};

// ============================================
// Credit Card Payoff Calculator (#17)
// ============================================
export interface CreditCardPayoffResult {
  balance: number;
  minimumPaymentMonths: number;
  minimumPaymentTotal: number;
  minimumPaymentInterest: number;
  fixedPaymentMonths: number;
  fixedPaymentTotal: number;
  fixedPaymentInterest: number;
  timeSaved: number;
  interestSaved: number;
}

export const calculateCreditCardPayoff = (
  balance: number,
  annualRate: number,
  minimumPaymentPercent: number = 0.03,
  minimumPaymentFloor: number = 500,
  fixedPayment: number = 0
): CreditCardPayoffResult => {
  const monthlyRate = annualRate / 12;

  // Calculate with minimum payments
  let remaining = balance;
  let minTotal = 0;
  let minMonths = 0;
  const maxIter = 600;

  while (remaining > 0.01 && minMonths < maxIter) {
    minMonths++;
    const interest = remaining * monthlyRate;
    const minPayment = Math.max(remaining * minimumPaymentPercent, minimumPaymentFloor);
    const payment = Math.min(minPayment, remaining + interest);
    remaining = remaining + interest - payment;
    minTotal += payment;
  }

  // Calculate with fixed payment
  remaining = balance;
  let fixedTotal = 0;
  let fixedMonths = 0;
  const actualFixed = fixedPayment > 0 ? fixedPayment : Math.max(balance * minimumPaymentPercent, minimumPaymentFloor) * 2;

  while (remaining > 0.01 && fixedMonths < maxIter) {
    fixedMonths++;
    const interest = remaining * monthlyRate;
    const payment = Math.min(actualFixed, remaining + interest);
    remaining = remaining + interest - payment;
    fixedTotal += payment;
  }

  return {
    balance,
    minimumPaymentMonths: minMonths,
    minimumPaymentTotal: minTotal,
    minimumPaymentInterest: minTotal - balance,
    fixedPaymentMonths: fixedMonths,
    fixedPaymentTotal: fixedTotal,
    fixedPaymentInterest: fixedTotal - balance,
    timeSaved: minMonths - fixedMonths,
    interestSaved: (minTotal - balance) - (fixedTotal - balance),
  };
};

// ============================================
// Car Loan Calculator (#18)
// ============================================
export interface CarLoanResult {
  vehiclePrice: number;
  downPayment: number;
  loanAmount: number;
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  chattelMortgageFee: number;
}

export const calculateCarLoan = (
  vehiclePrice: number,
  downPaymentPercent: number,
  monthlyRate: number,
  months: number
): CarLoanResult => {
  const downPayment = vehiclePrice * (downPaymentPercent / 100);
  const loanAmount = vehiclePrice - downPayment;
  // Chattel mortgage fee ~1-2% of loan
  const chattelMortgageFee = loanAmount * 0.015;
  const totalInterest = loanAmount * monthlyRate * months;
  const totalPayment = loanAmount + totalInterest + chattelMortgageFee;
  const monthlyPayment = (loanAmount + totalInterest) / months;
  return { vehiclePrice, downPayment, loanAmount, monthlyPayment, totalInterest, totalPayment, chattelMortgageFee };
};

// ============================================
// Forex / Remittance Calculator (#19)
// ============================================
export interface RemittanceResult {
  sendAmount: number;
  sendCurrency: string;
  receiveAmount: number;
  receiveCurrency: string;
  exchangeRate: number;
  fee: number;
  totalCost: number;
  effectiveRate: number;
}

export const calculateRemittance = (
  sendAmount: number,
  exchangeRate: number,
  fee: number,
  sendCurrency: string = "USD",
  receiveCurrency: string = "PHP"
): RemittanceResult => {
  const totalCost = sendAmount + fee;
  const receiveAmount = sendAmount * exchangeRate;
  const effectiveRate = receiveAmount / totalCost;
  return { sendAmount, sendCurrency, receiveAmount, receiveCurrency, exchangeRate, fee, totalCost, effectiveRate };
};

// ============================================
// Investment Return Calculator (#20)
// ============================================
export interface InvestmentResult {
  initialAmount: number;
  monthlyContribution: number;
  years: number;
  annualReturn: number;
  finalAmount: number;
  totalContributed: number;
  totalReturns: number;
  withholdingTax: number;
  afterTaxReturns: number;
  yearlyBreakdown: Array<{
    year: number;
    balance: number;
    contributed: number;
    returns: number;
  }>;
}

export const calculateInvestmentReturn = (
  initialAmount: number,
  monthlyContribution: number,
  years: number,
  annualReturn: number,
  taxRate: number = 0.2 // 20% withholding tax on interest/dividends in PH
): InvestmentResult => {
  const monthlyRate = annualReturn / 12;
  const totalMonths = years * 12;
  let balance = initialAmount;
  const yearlyBreakdown: InvestmentResult["yearlyBreakdown"] = [];

  for (let m = 1; m <= totalMonths; m++) {
    balance = balance * (1 + monthlyRate) + monthlyContribution;
    if (m % 12 === 0) {
      const year = m / 12;
      const contributed = initialAmount + monthlyContribution * m;
      yearlyBreakdown.push({
        year,
        balance,
        contributed,
        returns: balance - contributed,
      });
    }
  }

  const totalContributed = initialAmount + monthlyContribution * totalMonths;
  const totalReturns = balance - totalContributed;
  const withholdingTax = totalReturns * taxRate;
  return {
    initialAmount,
    monthlyContribution,
    years,
    annualReturn,
    finalAmount: balance,
    totalContributed,
    totalReturns,
    withholdingTax,
    afterTaxReturns: totalReturns - withholdingTax,
    yearlyBreakdown,
  };
};

// ============================================
// Retirement Calculator (#21)
// ============================================
export interface RetirementResult {
  currentAge: number;
  retirementAge: number;
  yearsToRetirement: number;
  monthlyNeeded: number;
  projectedFund: number;
  targetFund: number;
  gap: number;
  onTrack: boolean;
  additionalMonthlyNeeded: number;
}

export const calculateRetirement = (
  currentAge: number,
  retirementAge: number,
  currentSavings: number,
  monthlySavings: number,
  expectedReturn: number,
  monthlyExpenseInRetirement: number,
  retirementDuration: number = 25 // Years of retirement
): RetirementResult => {
  const yearsToRetirement = retirementAge - currentAge;
  const monthsToRetirement = yearsToRetirement * 12;
  const monthlyRate = expectedReturn / 12;

  // Project current savings + monthly contributions
  let projectedFund = currentSavings;
  for (let m = 0; m < monthsToRetirement; m++) {
    projectedFund = projectedFund * (1 + monthlyRate) + monthlySavings;
  }

  // Target fund needed (present value of retirement expenses)
  const retirementMonths = retirementDuration * 12;
  const withdrawalRate = expectedReturn / 2 / 12; // Conservative rate during retirement
  let targetFund: number;
  if (withdrawalRate > 0) {
    targetFund = monthlyExpenseInRetirement * (1 - Math.pow(1 + withdrawalRate, -retirementMonths)) / withdrawalRate;
  } else {
    targetFund = monthlyExpenseInRetirement * retirementMonths;
  }

  const gap = targetFund - projectedFund;
  const onTrack = gap <= 0;

  // How much more per month to close the gap
  let additionalMonthlyNeeded = 0;
  if (gap > 0 && monthsToRetirement > 0) {
    if (monthlyRate > 0) {
      const factor = Math.pow(1 + monthlyRate, monthsToRetirement) - 1;
      additionalMonthlyNeeded = (gap * monthlyRate) / factor;
    } else {
      additionalMonthlyNeeded = gap / monthsToRetirement;
    }
  }

  return {
    currentAge,
    retirementAge,
    yearsToRetirement,
    monthlyNeeded: monthlyExpenseInRetirement,
    projectedFund,
    targetFund,
    gap: Math.max(0, gap),
    onTrack,
    additionalMonthlyNeeded,
  };
};

// ============================================
// Emergency Fund Calculator (#22)
// ============================================
export interface EmergencyFundResult {
  monthlyExpenses: number;
  targetMonths: number;
  targetAmount: number;
  currentSavings: number;
  remaining: number;
  monthlySavingsNeeded: number;
  monthsToGoal: number;
  coverageMonths: number;
}

export const calculateEmergencyFund = (
  monthlyExpenses: number,
  targetMonths: number = 6,
  currentSavings: number = 0,
  monthlySavingsCapacity: number = 0
): EmergencyFundResult => {
  const targetAmount = monthlyExpenses * targetMonths;
  const remaining = Math.max(0, targetAmount - currentSavings);
  const coverageMonths = monthlyExpenses > 0 ? currentSavings / monthlyExpenses : 0;
  const monthlySavingsNeeded = remaining > 0 && monthlySavingsCapacity > 0 ? monthlySavingsCapacity : remaining / 12;
  const monthsToGoal = monthlySavingsNeeded > 0 ? Math.ceil(remaining / monthlySavingsNeeded) : 0;

  return {
    monthlyExpenses,
    targetMonths,
    targetAmount,
    currentSavings,
    remaining,
    monthlySavingsNeeded,
    monthsToGoal,
    coverageMonths,
  };
};
