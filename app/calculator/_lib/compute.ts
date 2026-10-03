import { calculateInstallmentOption } from "./calc";
import { CALCULATOR_CONFIG } from "./config";
import type { CalculateForm } from "./schema";

/** RA 12214: 0.75%; short debt terms prorated by actual days / 365.
 * Without actual dates this planner uses months / 12 as an explicit estimate. */
export function estimateDST(amount: number, months: number, exempt: boolean) {
  if (exempt && amount <= 250000) return 0;
  return amount * 0.0075 * Math.min(1, months / 12);
}

export function computeInstallments(values: CalculateForm) {
  const plans = Array.from(
    new Set([
      ...(values.customPlanList?.length
        ? values.customPlanList
        : CALCULATOR_CONFIG[values.calculatorType].installmentPlans),
      values.numInstallments,
    ]),
  );
  const personal = values.calculatorType === "personal-loan";
  const dstFor = (months: number) =>
    personal ? estimateDST(values.amount, months, values.dstExempt) : 0;
  const selectedDst = dstFor(+values.numInstallments);
  const all = plans.map((term) =>
    calculateInstallmentOption(
      values.amount,
      values.installmentAmount,
      values.interestRate / 100,
      +term,
      (values.processingFee || 0) + dstFor(+term),
    ),
  );
  return {
    selected: all.find((p) => p.months === +values.numInstallments),
    others: all.filter((p) => p.months !== +values.numInstallments),
    monthlyBudget: values.monthlyBudget,
    calculatorType: values.calculatorType,
    dst: selectedDst,
    netProceeds: values.amount - (values.processingFee || 0) - selectedDst,
  };
}
