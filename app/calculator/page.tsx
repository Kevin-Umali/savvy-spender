"use client";

import { Suspense, useMemo } from "react";
import { useQueryStates } from "nuqs";
import { calculatorParsers, calculatorUrlKeys } from "./_lib/url-state";
import { CalculateFormSchema } from "./_lib/schema";
import { computeInstallments } from "./_lib/compute";
import { CopyLinkButton } from "@/app/_components/copy-link-button";
import { useShareSnapshot } from "@/components/share-state-provider";

import CardInstallmentForm from "./_components/card-form";
import CardSelectedPlan from "./_components/selected-plan";
import OtherPlanTable from "./_components/other-plan-table";
import CostBreakdown from "./_components/cost-breakdown";
import AmortizationSchedule from "./_components/amortization-schedule";
import { CALCULATOR_CONFIG } from "./_lib/config";
import type { PaymentDifferences } from "./_lib/types";
import type { CalculateForm } from "./_lib/schema";
import { ToolHeader } from "@/app/_components/tool-header";
import { HowItWorks } from "@/app/_components/how-it-works";
import { Glossary } from "@/app/_components/glossary";

const CALC_GLOSSARY = [
  {
    term: "Add-on rate",
    def: "A flat monthly % charged on the original principal, not the declining balance — common for PH installments.",
  },
  {
    term: "EIR / EIRPA",
    def: "Compounded annual effective cost from monthly cash flows including upfront fees. Lender disclosure conventions may differ.",
  },
  {
    term: "Factor rate",
    def: "The monthly payment divided by principal; multiply principal by this factor to estimate the monthly installment.",
  },
  {
    term: "DST",
    def: "0.75% debt-instrument tax, prorated for short terms. Exemptions are conditional; confirm with lender.",
  },
];

function Calculator() {
  const [query, setQuery] = useQueryStates(calculatorParsers, {
    urlKeys: calculatorUrlKeys,
  });
  useShareSnapshot(
    calculatorParsers,
    {
      ...query,
      customPlanList:
        query.customPlanList ??
        Array.from(
          new Set([
            ...CALCULATOR_CONFIG[query.calculatorType].installmentPlans,
            query.numInstallments,
          ]),
        ),
    },
    calculatorUrlKeys,
  );
  const calculatedData = useMemo(() => {
    const parsed = CalculateFormSchema.safeParse({
      ...query,
      customPlanList: query.customPlanList ?? undefined,
    });
    return parsed.success ? computeInstallments(parsed.data) : undefined;
  }, [query]);
  const hasCalculated = Boolean(calculatedData);
  const isLoading = false; // Pure local computation; no network round-trip.
  const paymentDifferences: PaymentDifferences = {
    totalFullPayment: query.amount,
    totalInstallmentWithInterest: Number(
      calculatedData?.selected?.totalPayment ?? 0,
    ),
    totalInstallmentWithZeroPercent:
      query.installmentAmount > 0 ? query.installmentAmount : undefined,
  };
  const formValues = {
    amount: query.amount,
    monthlyRate: query.interestRate / 100,
  };
  const onSubmit = (values: CalculateForm) => {
    void setQuery({ ...values, customPlanList: values.customPlanList ?? null });
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
      <ToolHeader
        title="Installment Calculator"
        description="Compare balance conversion, credit-to-cash, and personal loan installment plans across multiple terms — with monthly payments, effective interest, and a full amortization schedule."
      />
      <div className="flex justify-end mb-4">
        <CopyLinkButton disabled={!calculatedData} />
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
                <CostBreakdown
                  calculatedData={calculatedData}
                  amount={formValues.amount}
                />
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
              {
                heading: "What it does",
                body: "Turns a lump sum into fixed monthly installments across terms and shows the true cost of each.",
              },
              {
                heading: "Reading it",
                body: "The lowest monthly payment isn't always the cheapest — check total interest and the effective interest rate (EIR), which annualizes the real cost.",
              },
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
        Fill out the form on the left and hit calculate to compare installment
        terms, monthly payments, effective interest, and the full amortization
        schedule.
      </p>
    </div>
  );
}

export default function CalculatorPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-10 text-sm text-muted-foreground">
          Loading…
        </div>
      }
    >
      <Calculator />
    </Suspense>
  );
}
