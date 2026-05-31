"use client";

import { Suspense, useState, useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import CardInstallmentForm from "./_components/card-form";
import CardSelectedPlan from "./_components/selected-plan";
import OtherPlanTable from "./_components/other-plan-table";
import CostBreakdown from "./_components/cost-breakdown";
import AmortizationSchedule from "./_components/amortization-schedule";
import { CALCULATOR_CONFIG, type CalculatorType } from "./_lib/config";
import type { AllInstallmentOption, PaymentDifferences } from "./_lib/types";
import type { CalculateForm } from "./_lib/schema";
import { ToolHeader } from "@/app/_components/tool-header";
import { HowItWorks } from "@/app/_components/how-it-works";
import { Glossary } from "@/app/_components/glossary";

const CALC_GLOSSARY = [
  { term: "Add-on rate", def: "A flat monthly % charged on the original principal, not the declining balance — common for PH installments." },
  { term: "EIR / EIRPA", def: "Effective interest rate per annum — the real annualized cost, so plans with different terms compare fairly." },
  { term: "Factor rate", def: "The multiplier that turns the principal into total repayment over the term." },
  { term: "DST", def: "Documentary stamp tax (₱1.50 per ₱200) applied to personal loans above ₱250,000." },
];

const CALC_DEFAULTS: CalculateForm = {
  calculatorType: "balance-conversion",
  amount: 10000,
  interestRate: 0.99,
  numInstallments: "3",
  processingFee: 0,
  installmentAmount: 0,
  monthlyBudget: 0,
};

const VALID_TYPES = ["balance-conversion", "credit-to-cash", "personal-loan"];

function Calculator() {
  const searchParams = useSearchParams();
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

  // Prefill (and auto-calculate) from URL params — used by shareable links and
  // the Bank list's "open in calculator" deep-links.
  const initialValues: Partial<CalculateForm> = {};
  const t = searchParams.get("type");
  const a = searchParams.get("amt");
  const r = searchParams.get("rate");
  const f = searchParams.get("fee");
  const n = searchParams.get("term");
  if (t && VALID_TYPES.includes(t)) initialValues.calculatorType = t as CalculatorType;
  if (a && Number.isFinite(+a)) initialValues.amount = +a;
  if (r && Number.isFinite(+r)) initialValues.interestRate = +r;
  if (f && Number.isFinite(+f)) initialValues.processingFee = +f;
  if (n && Number.isFinite(+n)) initialValues.numInstallments = n;
  const hasParams = Object.keys(initialValues).length > 0;

  const didAutoRun = useRef(false);
  useEffect(() => {
    if (didAutoRun.current || !hasParams) return;
    didAutoRun.current = true;
    calculateInstallmentData({ ...CALC_DEFAULTS, ...initialValues });
    // Run once on mount when deep-linked.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
      <ToolHeader
        title="Installment Calculator"
        description="Compare balance conversion, credit-to-cash, and personal loan installment plans across multiple terms — with monthly payments, effective interest, and a full amortization schedule."
      />

      <div className="grid lg:grid-cols-[380px_1fr] gap-6 lg:gap-10">
        {/* Form column — sticky on desktop */}
        <aside className="lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-2 -mr-2">
          <CardInstallmentForm
            onSubmit={onSubmit}
            isLoading={isLoading}
            initialValues={hasParams ? initialValues : undefined}
          />
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

          <HowItWorks
            docsHref="/docs"
            points={[
              { heading: "What it does", body: "Turns a lump sum into fixed monthly installments across terms and shows the true cost of each." },
              { heading: "Reading it", body: "The lowest monthly payment isn't always the cheapest — check total interest and the effective interest rate (EIR), which annualizes the real cost." },
            ]}
          />
          <Glossary items={CALC_GLOSSARY} />
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
      <h2 className="font-display font-light text-xl sm:text-2xl mb-2">
        Enter your details to begin
      </h2>
      <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
        Fill out the form on the left and hit calculate to compare installment terms, monthly payments,
        effective interest, and the full amortization schedule.
      </p>
    </div>
  );
}

export default function CalculatorPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-10 text-sm text-muted-foreground">Loading…</div>}>
      <Calculator />
    </Suspense>
  );
}
