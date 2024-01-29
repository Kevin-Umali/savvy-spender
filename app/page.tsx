"use client";

import { INSTALLMENT_PLAN_LIST } from "@/constant";
import { AllInstallmentOption, PaymentDifferences } from "@/interfaces";
import { CalculateForm } from "@/schema";
import { useState } from "react";
import { toast } from "sonner";

import CardInstallmentForm from "@/components/installment/card-form";
import CardSelectedPlan from "@/components/installment/selected-plan";
import OtherPlanTable from "@/components/installment/other-plan-table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircledIcon } from "@radix-ui/react-icons";

export default function Home() {
  const [calculatedData, setCalculatedData] = useState<AllInstallmentOption>();
  const [paymentDifferences, setPaymentDifferences] = useState<PaymentDifferences>();
  const [isLoading, setIsLoading] = useState(true);

  const calculateInstallmentData = async (values: CalculateForm) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api", {
        method: "POST",
        body: JSON.stringify({ ...values, installmentPlanList: INSTALLMENT_PLAN_LIST }),
      });

      if (!response.ok) {
        throw new Error("Error fetching data");
      }

      const res = await response.json();
      setCalculatedData(res);
      setPaymentDifferences({
        totalFullPayment: values.amount,
        totalInstallmentWithInterest: +res.selected.totalPayment,
        totalInstallmentWithZeroPercent: values.installmentAmount,
      });
    } catch (error) {
      toast.error("Error fetching data");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (values: CalculateForm) => {
    calculateInstallmentData(values);
  };

  return (
    <main className="items-center justify-between p-4 space-y-4">
      {!isLoading && (
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
