import { calculateInstallmentOption } from "@/app/calculator/_lib/calc";
import { DST_EXEMPTION_THRESHOLD, DST_RATE_PER_200 } from "@/app/calculator/_lib/config";
import { NextRequest, NextResponse } from "next/server";

interface InstallmentRequest {
  calculatorType: string;
  amount: number;
  installmentAmount: number;
  interestRate: number;
  processingFee: number;
  monthlyBudget: number;
  numInstallments: string;
  installmentPlanList: string[];
}

export async function POST(request: NextRequest) {
  const {
    calculatorType,
    amount,
    installmentAmount,
    interestRate,
    processingFee,
    monthlyBudget,
    numInstallments,
    installmentPlanList,
  } = (await request.json()) as InstallmentRequest;

  // Calculate DST for personal loans (₱1.50 per ₱200, exempt if ≤ ₱250K)
  const dst =
    calculatorType === "personal-loan" && amount > DST_EXEMPTION_THRESHOLD
      ? Math.ceil(amount / 200) * DST_RATE_PER_200
      : 0;

  const totalFees = (processingFee || 0) + dst;
  const netProceeds = amount - totalFees;

  const allInstallmentPlans = installmentPlanList.map((installment) =>
    calculateInstallmentOption(amount, installmentAmount, interestRate, +installment, totalFees)
  );

  const selectedInstallmentPlan = allInstallmentPlans.find((plan) => plan.months === +numInstallments);

  const otherInstallmentPlans = allInstallmentPlans.filter((plan) => plan.months !== +numInstallments);

  return NextResponse.json({
    selected: selectedInstallmentPlan,
    others: otherInstallmentPlans,
    monthlyBudget,
    calculatorType,
    dst,
    netProceeds,
  });
}
