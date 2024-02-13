import { calculateInstallmentOption, suggestPrincipalBinarySearch } from "@/lib/server";
import { NextRequest, NextResponse } from "next/server";

interface InstallmentRequest {
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
    amount,
    installmentAmount,
    interestRate,
    processingFee,
    monthlyBudget,
    numInstallments,
    installmentPlanList,
  } = (await request.json()) as InstallmentRequest;

  const allInstallmentPlans = installmentPlanList.map((installment) =>
    calculateInstallmentOption(amount, installmentAmount, interestRate, +installment, processingFee)
  );

  const selectedInstallmentPlan = allInstallmentPlans.find((plan) => plan.months === +numInstallments);

  const otherInstallmentPlans = allInstallmentPlans.filter((plan) => plan.months !== +numInstallments);

  return NextResponse.json({
    selected: selectedInstallmentPlan,
    others: otherInstallmentPlans,
    monthlyBudget,
  });
}
