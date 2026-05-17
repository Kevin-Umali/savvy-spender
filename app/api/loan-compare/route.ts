import { calculateInstallmentOption } from "@/lib/server";
import { NextRequest, NextResponse } from "next/server";

interface FinancingOption {
  type: "in-house" | "bank-auto" | "credit-to-cash";
  downPaymentPct: number;
  interestRate: number;   // monthly add-on percentage (e.g. 1.5 = 1.5%/mo)
  termMonths: number;
  processingFee?: number;
  chattelMortgageFee?: number;
  docStampTax?: number;
}

interface LoanCompareRequest {
  vehiclePrice: number;
  options: FinancingOption[];
}

export interface LoanCompareResult {
  type: string;
  downPaymentPct: number;
  downPayment: number;
  principal: number;
  totalFees: number;
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  totalCostWithDP: number;
  eirPA: number;
  simpleInterest: number;
}

export async function POST(request: NextRequest) {
  const { vehiclePrice, options } = (await request.json()) as LoanCompareRequest;

  if (!vehiclePrice || vehiclePrice <= 0 || !Array.isArray(options) || options.length === 0) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const results: LoanCompareResult[] = options.map((opt) => {
    const downPayment = (vehiclePrice * (opt.downPaymentPct ?? 0)) / 100;
    const principal = vehiclePrice - downPayment;
    const monthlyRate = (opt.interestRate ?? 0) / 100;
    const totalFees = (opt.processingFee ?? 0) + (opt.chattelMortgageFee ?? 0) + (opt.docStampTax ?? 0);

    const installment = calculateInstallmentOption(principal, 0, monthlyRate, opt.termMonths, totalFees);

    return {
      type: opt.type,
      downPaymentPct: opt.downPaymentPct ?? 0,
      downPayment,
      principal,
      totalFees,
      monthlyPayment: +installment.monthlyPayment,
      totalInterest: +installment.interest,
      totalPayment: +installment.totalPayment,
      totalCostWithDP: +installment.totalPayment + downPayment,
      eirPA: +installment.eirPA,
      simpleInterest: +installment.simpleInterest,
    };
  });

  return NextResponse.json({ results, vehiclePrice });
}
