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
    } catch {
      toast.error("Error fetching data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const onSubmit = (values: CalculateForm) => {
    calculateInstallmentData(values);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
      {/* Page Header */}
      <div className="mb-8 max-w-3xl">
        <p className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-muted-foreground opacity-60 mb-2">
          Tool
        </p>
        <h1 className="font-display italic font-light text-3xl sm:text-4xl lg:text-5xl tracking-tight">
          Installment Calculator
        </h1>
        <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
          Compare balance conversion, credit-to-cash, and personal loan installment plans across multiple terms.
        </p>
      </div>

      <div className="grid lg:grid-cols-[380px_1fr] gap-6 lg:gap-10">
        {/* Form column — sticky on desktop */}
        <aside className="lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-2 -mr-2">
          <CardInstallmentForm onSubmit={onSubmit} isLoading={isLoading} />
        </aside>

        {/* Results column */}
        <section className="space-y-6 min-w-0">
          {!hasCalculated && !isLoading ? (
            <EmptyState />
          ) : (
            <>
              <CardSelectedPlan
                calculatedData={calculatedData}
                paymentDifferences={paymentDifferences}
                isLoading={isLoading}
              />
              <OtherPlanTable
                calculatedData={calculatedData}
                budget={calculatedData?.monthlyBudget}
                isLoading={isLoading}
              />
              {(hasCalculated || isLoading) && (
                <CostBreakdown calculatedData={calculatedData} amount={formValues.amount} />
              )}
              {hasCalculated && (
                <AmortizationSchedule
                  selected={calculatedData?.selected}
                  principal={formValues.amount}
                  monthlyRate={formValues.monthlyRate}
                />
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}

function EmptyState() {
  return (
    <div className="border border-dashed rounded-md p-10 text-center">
      <p className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-muted-foreground opacity-60 mb-3">
        No calculation yet
      </p>
      <h2 className="font-display italic font-light text-xl sm:text-2xl mb-2">
        Enter your details to begin
      </h2>
      <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
        Fill out the form on the left and hit calculate to compare installment terms, monthly payments,
        effective interest, and the full amortization schedule.
      </p>
    </div>
  );
}
