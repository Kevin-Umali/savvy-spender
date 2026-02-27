"use client";

import { CALCULATOR_CONFIG } from "@/constant";
import { AllInstallmentOption, PaymentDifferences } from "@/interfaces";
import { CalculateForm } from "@/schema";
import { useState, useCallback } from "react";
import { toast } from "sonner";

import CardInstallmentForm from "@/components/installment/card-form";
import CardSelectedPlan from "@/components/installment/selected-plan";
import OtherPlanTable from "@/components/installment/other-plan-table";
import CostBreakdown from "@/components/installment/cost-breakdown";
import AmortizationSchedule from "@/components/installment/amortization-schedule";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import { Calculator } from "lucide-react";
import type { CalculatorType } from "@/constant";

export default function CalculatorPage() {
  const [calculatedData, setCalculatedData] = useState<AllInstallmentOption>();
  const [paymentDifferences, setPaymentDifferences] = useState<PaymentDifferences>();
  const [hasCalculated, setHasCalculated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formValues, setFormValues] = useState<{ amount: number; monthlyRate: number }>({ amount: 0, monthlyRate: 0 });

  const calculateInstallmentData = useCallback(async (values: CalculateForm) => {
    setIsLoading(true);
    try {
      const calculatorType = (values.calculatorType ?? "balance-conversion") as CalculatorType;
      const config = CALCULATOR_CONFIG[calculatorType];

      const installmentPlanList = values.customPlanList && values.customPlanList.length > 0
        ? values.customPlanList
        : config.installmentPlans;

      const response = await fetch("/api", {
        method: "POST",
        body: JSON.stringify({ ...values, installmentPlanList }),
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

      setFormValues({
        amount: values.amount,
        monthlyRate: values.interestRate / 100,
      });

      setHasCalculated(true);
    } catch (error) {
      toast.error("Error fetching data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const onSubmit = (values: CalculateForm) => {
    calculateInstallmentData(values);
  };

  return (
    <main className="max-w-5xl mx-auto p-4 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-display italic font-light text-3xl sm:text-4xl tracking-tight">
          Installment Calculator
        </h1>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          Compare balance conversion, credit-to-cash, and personal loan installment plans.
        </p>
      </div>

      {hasCalculated && !isLoading && (
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
      <CardInstallmentForm onSubmit={onSubmit} isLoading={isLoading} />

      {/* Selected Installment Plan and Difference */}
      <CardSelectedPlan calculatedData={calculatedData} paymentDifferences={paymentDifferences} isLoading={isLoading} />

      {/* Cost Breakdown */}
      {(hasCalculated || isLoading) && (
        <CostBreakdown calculatedData={calculatedData} amount={formValues.amount} />
      )}

      {/* Table of Other Installment Plan */}
      <OtherPlanTable calculatedData={calculatedData} budget={calculatedData?.monthlyBudget} isLoading={isLoading} />

      {/* Amortization Schedule */}
      {hasCalculated && (
        <AmortizationSchedule
          selected={calculatedData?.selected}
          principal={formValues.amount}
          monthlyRate={formValues.monthlyRate}
        />
      )}
    </main>
  );
}
