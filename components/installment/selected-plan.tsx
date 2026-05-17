"use client";

import { Card, CardContent } from "@/components/ui/card";
import { AllInstallmentOption, PaymentDifferences } from "@/interfaces";
import { formatCurrency, formatPercent } from "@/lib/client";
import { cn } from "@/lib/utils";

interface CardSelectedPlanProps {
  calculatedData: AllInstallmentOption | undefined;
  paymentDifferences: PaymentDifferences | undefined;
  isLoading?: boolean;
}

const Skeleton: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={cn("animate-pulse bg-muted rounded", className)} />
);

const StatBlock: React.FC<{
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  accent?: "primary" | "warning" | "success" | "danger" | "neutral";
  size?: "lg" | "md";
}> = ({ label, value, hint, accent = "neutral", size = "md" }) => (
  <div className="px-5 py-4 sm:px-6 sm:py-5">
    <p className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-muted-foreground opacity-60">
      {label}
    </p>
    <p
      className={cn(
        "mt-1.5 font-display italic font-light tabular-nums tracking-tight leading-none",
        size === "lg" ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl",
        accent === "primary" && "text-foreground",
        accent === "warning" && "text-orange-600 dark:text-orange-400",
        accent === "success" && "text-emerald-600 dark:text-emerald-400",
        accent === "danger" && "text-red-600 dark:text-red-400"
      )}
    >
      {value}
    </p>
    {hint && (
      <p className="mt-1.5 text-[11px] text-muted-foreground leading-relaxed">{hint}</p>
    )}
  </div>
);

const CardSelectedPlan: React.FC<CardSelectedPlanProps> = ({ calculatedData, paymentDifferences, isLoading = false }) => {
  const hasBudget = (calculatedData?.monthlyBudget ?? 0) > 0;
  const isBalanceConversion = calculatedData?.calculatorType === "balance-conversion";
  const isPersonalLoan = calculatedData?.calculatorType === "personal-loan";

  if (isLoading) {
    return (
      <Card className="border-border overflow-hidden">
        <div className="bg-muted/20 px-5 py-3 border-b">
          <Skeleton className="h-3 w-32" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="px-5 py-4 sm:px-6 sm:py-5 space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (!calculatedData?.selected) return null;

  const selected = calculatedData.selected;
  const monthlyPayment = +selected.monthlyPayment;
  const budget = calculatedData.monthlyBudget ?? 0;
  const monthlyAccent = !hasBudget ? "primary" : monthlyPayment <= budget ? "success" : "danger";
  const monthlyHint = hasBudget ? (
    monthlyPayment <= budget ? (
      <>Fits your <span className="tabular-nums">{formatCurrency(budget)}</span> budget</>
    ) : (
      <>Exceeds budget by <span className="tabular-nums">{formatCurrency(monthlyPayment - budget)}</span></>
    )
  ) : null;

  const fullPayment = paymentDifferences?.totalFullPayment ?? 0;
  const totalPayment = +selected.totalPayment;
  const extraCost = totalPayment - fullPayment;

  return (
    <Card className="border-border overflow-hidden">
      {/* Header strip */}
      <div className="bg-muted/30 px-5 py-3 border-b flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-muted-foreground opacity-70">
            Selected Plan
          </p>
          <p className="text-sm mt-0.5">
            <span className="font-display italic font-light text-lg tabular-nums">{selected.months}</span>{" "}
            <span className="text-muted-foreground">months</span>
            <span className="mx-2 text-muted-foreground/40">·</span>
            <span className="tabular-nums">{formatPercent(selected.simpleInterest)}</span>{" "}
            <span className="text-muted-foreground">simple</span>
            <span className="mx-2 text-muted-foreground/40">·</span>
            <span className="tabular-nums">{formatPercent(selected.eirPA)}</span>{" "}
            <span className="text-muted-foreground">EIR</span>
          </p>
        </div>
        <div className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-muted-foreground opacity-60">
          Factor <span className="text-foreground tabular-nums">{selected.factorRate}</span>
        </div>
      </div>

      {/* Hero stat grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0">
        <StatBlock
          label="Monthly Payment"
          value={formatCurrency(selected.monthlyPayment)}
          hint={monthlyHint}
          accent={monthlyAccent}
          size="lg"
        />
        <StatBlock
          label="Total Payable"
          value={formatCurrency(selected.totalPayment)}
          hint={
            fullPayment > 0 && extraCost > 0 ? (
              <>
                +<span className="tabular-nums">{formatCurrency(extraCost)}</span> over cash
              </>
            ) : null
          }
          accent="primary"
          size="lg"
        />
        <StatBlock
          label="Total Interest"
          value={formatCurrency(selected.interest)}
          hint={
            fullPayment > 0 ? (
              <span className="tabular-nums">
                {((+selected.interest / fullPayment) * 100).toFixed(1)}% of principal
              </span>
            ) : null
          }
          accent="warning"
        />
        <StatBlock
          label="Effective Rate (PA)"
          value={formatPercent(selected.eirPA)}
          hint={<>Factor rate <span className="tabular-nums">{selected.factorRate}</span></>}
          accent="primary"
        />
      </div>

      {/* Extra context strip — personal loan disbursement + balance-conversion optimal principal */}
      {(isPersonalLoan && calculatedData.dst !== undefined) ||
      (isBalanceConversion &&
        selected.suggestedPrincipal &&
        +selected.suggestedPrincipal.suggested > 0) ||
      (paymentDifferences?.totalInstallmentWithZeroPercent ?? 0) > 0 ? (
        <CardContent className="border-t bg-muted/10 py-3 px-5">
          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-2 text-[12px]">
            {isPersonalLoan && calculatedData.dst !== undefined && (
              <div className="flex items-baseline justify-between sm:justify-start sm:gap-2">
                <dt className="font-mono-label text-[10px] uppercase tracking-[0.18em] text-muted-foreground opacity-60">
                  DST
                </dt>
                <dd className="tabular-nums font-medium">
                  {calculatedData.dst > 0 ? formatCurrency(calculatedData.dst) : "Exempt"}
                </dd>
              </div>
            )}
            {isPersonalLoan && calculatedData.netProceeds !== undefined && (
              <div className="flex items-baseline justify-between sm:justify-start sm:gap-2">
                <dt className="font-mono-label text-[10px] uppercase tracking-[0.18em] text-muted-foreground opacity-60">
                  Net Proceeds
                </dt>
                <dd className="tabular-nums font-semibold">{formatCurrency(calculatedData.netProceeds)}</dd>
              </div>
            )}
            {isBalanceConversion &&
              selected.suggestedPrincipal &&
              +selected.suggestedPrincipal.suggested > 0 && (
                <div className="flex items-baseline justify-between sm:justify-start sm:gap-2 sm:col-span-2">
                  <dt className="font-mono-label text-[10px] uppercase tracking-[0.18em] text-muted-foreground opacity-60">
                    Optimal Principal
                  </dt>
                  <dd className="tabular-nums font-medium">
                    {formatCurrency(selected.suggestedPrincipal.suggested)}{" "}
                    <span className="text-muted-foreground text-[11px]">
                      → {formatCurrency(selected.suggestedPrincipal.totalPayment)} total
                    </span>
                  </dd>
                </div>
              )}
            {isBalanceConversion &&
              (paymentDifferences?.totalInstallmentWithZeroPercent ?? 0) > 0 && (
                <div className="flex items-baseline justify-between sm:justify-start sm:gap-2">
                  <dt className="font-mono-label text-[10px] uppercase tracking-[0.18em] text-muted-foreground opacity-60">
                    0% Merchant
                  </dt>
                  <dd className="tabular-nums font-medium">
                    {formatCurrency(paymentDifferences!.totalInstallmentWithZeroPercent!)}
                  </dd>
                </div>
              )}
          </dl>
        </CardContent>
      ) : null}
    </Card>
  );
};

export default CardSelectedPlan;
