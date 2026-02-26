import { NextRequest, NextResponse } from "next/server";
import {
  calculateAffordability,
  compareLoanOffers,
  calculateEarlyPayoff,
  convertInterestRate,
  calculateBreakEven,
  calculateInHouseLoan,
  calculateSalary,
  calculateIncomeTax,
  calculateFreelancerTax,
  calculateDebtPayoff,
  calculateSavingsGoal,
  calculateSSSLoan,
  calculatePagIBIGLoan,
  calculateCreditCardPayoff,
  calculateCarLoan,
  calculateRemittance,
  calculateInvestmentReturn,
  calculateRetirement,
  calculateEmergencyFund,
} from "@/lib/calculators";

type ToolName =
  | "affordability"
  | "loan-comparison"
  | "early-payoff"
  | "rate-converter"
  | "break-even"
  | "in-house-loan"
  | "salary"
  | "tax"
  | "debt-planner"
  | "savings-goal"
  | "sss-loan"
  | "pagibig-loan"
  | "credit-card-payoff"
  | "car-loan"
  | "remittance"
  | "investment"
  | "retirement"
  | "emergency-fund";

interface ToolRequest {
  tool: ToolName;
  params: Record<string, unknown>;
}

function handleTool(tool: ToolName, params: Record<string, unknown>): unknown {
  switch (tool) {
    case "affordability": {
      const { monthlyBudget, monthlyRate, months, processingFee = 0 } = params as {
        monthlyBudget: number;
        monthlyRate: number;
        months: number[];
        processingFee?: number;
      };
      return months.map((m) => calculateAffordability(monthlyBudget, monthlyRate, m, processingFee));
    }

    case "loan-comparison": {
      const { principal, offerA, offerB, months } = params as {
        principal: number;
        offerA: { name: string; rate: number; processingFee: number };
        offerB: { name: string; rate: number; processingFee: number };
        months: number[];
      };
      return months.map((m) => compareLoanOffers(principal, offerA, offerB, m));
    }

    case "early-payoff": {
      const { principal, monthlyRate, originalMonths, extraPayment, processingFee = 0 } = params as {
        principal: number;
        monthlyRate: number;
        originalMonths: number;
        extraPayment: number;
        processingFee?: number;
      };
      return calculateEarlyPayoff(principal, monthlyRate, originalMonths, extraPayment, processingFee);
    }

    case "rate-converter": {
      const { flatRateMonthly, months } = params as { flatRateMonthly: number; months: number };
      return convertInterestRate(flatRateMonthly, months);
    }

    case "break-even": {
      const { cashPrice, installmentPriceZero, monthlyRate, processingFee, maxMonths = 36 } = params as {
        cashPrice: number;
        installmentPriceZero: number;
        monthlyRate: number;
        processingFee: number;
        maxMonths?: number;
      };
      return calculateBreakEven(cashPrice, installmentPriceZero, monthlyRate, processingFee, maxMonths);
    }

    case "in-house-loan": {
      const { totalPrice, downPaymentPercent, monthlyRate, months, balloonPayment = 0 } = params as {
        totalPrice: number;
        downPaymentPercent: number;
        monthlyRate: number;
        months: number;
        balloonPayment?: number;
      };
      return calculateInHouseLoan(totalPrice, downPaymentPercent, monthlyRate, months, balloonPayment);
    }

    case "salary": {
      const { grossMonthly } = params as { grossMonthly: number };
      return calculateSalary(grossMonthly);
    }

    case "tax": {
      const { annualIncome, isFreelancer = false } = params as { annualIncome: number; isFreelancer?: boolean };
      return isFreelancer ? calculateFreelancerTax(annualIncome) : calculateIncomeTax(annualIncome);
    }

    case "debt-planner": {
      const { debts, extraPayment, method } = params as {
        debts: Array<{ name: string; balance: number; monthlyRate: number; minimumPayment: number }>;
        extraPayment: number;
        method: "snowball" | "avalanche";
      };
      return calculateDebtPayoff(debts, extraPayment, method);
    }

    case "savings-goal": {
      const { targetAmount, months, annualRate = 0 } = params as {
        targetAmount: number;
        months: number;
        annualRate?: number;
      };
      return calculateSavingsGoal(targetAmount, months, annualRate);
    }

    case "sss-loan": {
      const { loanAmount, annualRate = 0.1, termMonths = 24 } = params as {
        loanAmount: number;
        annualRate?: number;
        termMonths?: number;
      };
      return calculateSSSLoan(loanAmount, annualRate, termMonths);
    }

    case "pagibig-loan": {
      const { loanAmount, termYears = 30 } = params as { loanAmount: number; termYears?: number };
      return calculatePagIBIGLoan(loanAmount, termYears);
    }

    case "credit-card-payoff": {
      const {
        balance,
        annualRate,
        minimumPaymentPercent = 0.03,
        minimumPaymentFloor = 500,
        fixedPayment = 0,
      } = params as {
        balance: number;
        annualRate: number;
        minimumPaymentPercent?: number;
        minimumPaymentFloor?: number;
        fixedPayment?: number;
      };
      return calculateCreditCardPayoff(balance, annualRate, minimumPaymentPercent, minimumPaymentFloor, fixedPayment);
    }

    case "car-loan": {
      const { vehiclePrice, downPaymentPercent, monthlyRate, months } = params as {
        vehiclePrice: number;
        downPaymentPercent: number;
        monthlyRate: number;
        months: number;
      };
      return calculateCarLoan(vehiclePrice, downPaymentPercent, monthlyRate, months);
    }

    case "remittance": {
      const { sendAmount, exchangeRate, fee, sendCurrency = "USD", receiveCurrency = "PHP" } = params as {
        sendAmount: number;
        exchangeRate: number;
        fee: number;
        sendCurrency?: string;
        receiveCurrency?: string;
      };
      return calculateRemittance(sendAmount, exchangeRate, fee, sendCurrency, receiveCurrency);
    }

    case "investment": {
      const { initialAmount, monthlyContribution, years, annualReturn, taxRate = 0.2 } = params as {
        initialAmount: number;
        monthlyContribution: number;
        years: number;
        annualReturn: number;
        taxRate?: number;
      };
      return calculateInvestmentReturn(initialAmount, monthlyContribution, years, annualReturn, taxRate);
    }

    case "retirement": {
      const {
        currentAge,
        retirementAge,
        currentSavings,
        monthlySavings,
        expectedReturn,
        monthlyExpenseInRetirement,
        retirementDuration = 25,
      } = params as {
        currentAge: number;
        retirementAge: number;
        currentSavings: number;
        monthlySavings: number;
        expectedReturn: number;
        monthlyExpenseInRetirement: number;
        retirementDuration?: number;
      };
      return calculateRetirement(
        currentAge,
        retirementAge,
        currentSavings,
        monthlySavings,
        expectedReturn,
        monthlyExpenseInRetirement,
        retirementDuration
      );
    }

    case "emergency-fund": {
      const { monthlyExpenses, targetMonths = 6, currentSavings = 0, monthlySavingsCapacity = 0 } = params as {
        monthlyExpenses: number;
        targetMonths?: number;
        currentSavings?: number;
        monthlySavingsCapacity?: number;
      };
      return calculateEmergencyFund(monthlyExpenses, targetMonths, currentSavings, monthlySavingsCapacity);
    }

    default:
      throw new Error(`Unknown tool: ${tool}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { tool, params } = (await request.json()) as ToolRequest;

    if (!tool || !params) {
      return NextResponse.json({ error: "Missing 'tool' or 'params' field" }, { status: 400 });
    }

    const result = handleTool(tool, params);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
