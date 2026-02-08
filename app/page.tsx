"use client";

import { CALCULATOR_CONFIG } from "@/constant";
import { AllInstallmentOption, PaymentDifferences } from "@/interfaces";
import { CalculateForm } from "@/schema";
import { useState } from "react";
import { toast } from "sonner";

import CardInstallmentForm from "@/components/installment/card-form";
import CardSelectedPlan from "@/components/installment/selected-plan";
import OtherPlanTable from "@/components/installment/other-plan-table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import type { CalculatorType } from "@/constant";

export default function Home() {
  const [calculatedData, setCalculatedData] = useState<AllInstallmentOption>();
  const [paymentDifferences, setPaymentDifferences] = useState<PaymentDifferences>();
  const [hasCalculated, setHasCalculated] = useState(false);

  const calculateInstallmentData = async (values: CalculateForm) => {
    try {
      const calculatorType = (values.calculatorType ?? "balance-conversion") as CalculatorType;
      const config = CALCULATOR_CONFIG[calculatorType];

      const response = await fetch("/api", {
        method: "POST",
        body: JSON.stringify({ ...values, installmentPlanList: config.installmentPlans }),
      });

      if (!response.ok) {
        throw new Error("Error fetching data");
      }

      const res = await response.json();
      setCalculatedData(res);

      const installmentAmount = values.installmentAmount ?? 0;
      setPaymentDifferences({
        totalFullPayment: values.amount,
        totalInstallmentWithInterest: +res.selected.totalPayment,
        totalInstallmentWithZeroPercent: installmentAmount > 0 ? installmentAmount : undefined,
      });

      setHasCalculated(true);
    } catch (error) {
      toast.error("Error fetching data");
    }
  };

  const onSubmit = (values: CalculateForm) => {
    calculateInstallmentData(values);
  };

  return (
    <main className="items-center justify-between p-4 space-y-4">
      {hasCalculated && (
        <Alert className="border-green-200 text-green-800 bg-green-50 dark:border-green-200 dark:bg-green-100 dark:text-green-800 [&>svg]:text-green-800">
          <CheckCircledIcon className="h-4 w-4" />
          <AlertTitle>Ready to Explore Your Options</AlertTitle>
          <AlertDescription>
            Select a plan that best fits your financial goals. Compare different installment options to find your ideal
            plan.
          </AlertDescription>
        </Alert>
      )}

      {/* Installment Form */}
      <CardInstallmentForm onSubmit={onSubmit} />

      {/* Selected Installment Plan and Difference */}
      <CardSelectedPlan calculatedData={calculatedData} paymentDifferences={paymentDifferences} />

      {/* Table of Other Installment Plan */}
      <OtherPlanTable calculatedData={calculatedData} budget={calculatedData?.monthlyBudget} />
    </main>
  );
}
