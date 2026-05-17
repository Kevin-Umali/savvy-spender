"use client";

import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AllInstallmentOption, InstallmentOption } from "@/interfaces";
import { formatCurrency, formatPercent } from "@/lib/client";
import { cn } from "@/lib/utils";

interface OtherPlanTableProps {
  calculatedData: AllInstallmentOption | undefined;
  budget?: number;
  isLoading?: boolean;
}

const Skeleton: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={cn("animate-pulse bg-muted rounded", className)} />
);

type WinnerMap = {
  lowestMonthly: number | string | null;
  lowestTotal: number | string | null;
  budgetFriendly: Set<number | string>;
};

const computeWinners = (plans: InstallmentOption[], budget: number): WinnerMap => {
  if (plans.length === 0) {
    return { lowestMonthly: null, lowestTotal: null, budgetFriendly: new Set() };
  }
  let minMonthly = Infinity;
  let minMonthlyMonths: number | string | null = null;
  let minTotal = Infinity;
  let minTotalMonths: number | string | null = null;
  const budgetFriendly = new Set<number | string>();

  for (const p of plans) {
    const m = +p.monthlyPayment;
    const t = +p.totalPayment;
    if (m < minMonthly) {
      minMonthly = m;
      minMonthlyMonths = p.months;
    }
    if (t < minTotal) {
      minTotal = t;
      minTotalMonths = p.months;
    }
    if (budget > 0 && m <= budget) {
      budgetFriendly.add(p.months);
    }
  }
  return { lowestMonthly: minMonthlyMonths, lowestTotal: minTotalMonths, budgetFriendly };
};

const OtherPlanTable: React.FC<OtherPlanTableProps> = ({ calculatedData, budget = 0, isLoading = false }) => {
  const hasBudget = budget > 0;
  const isBalanceConversion = calculatedData?.calculatorType === "balance-conversion";

  // Combine selected + others into one sorted list; remember which row is selected
  const allPlans = useMemo(() => {
    if (!calculatedData) return [];
    const list: InstallmentOption[] = [
      ...(calculatedData.selected ? [calculatedData.selected] : []),
      ...(calculatedData.others ?? []),
    ];
    return [...list].sort((a, b) => +a.months - +b.months);
  }, [calculatedData]);

  const winners = useMemo(() => computeWinners(allPlans, budget), [allPlans, budget]);
  const selectedMonths = calculatedData?.selected?.months;

  if (isLoading) {
    return (
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="font-display italic font-light text-xl tracking-tight">Compare Terms</CardTitle>
          <CardDescription>All installment terms side by side.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (allPlans.length === 0) return null;

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-baseline justify-between gap-3 flex-wrap">
          <div>
            <p className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-muted-foreground opacity-60">
              Comparison
            </p>
            <CardTitle className="font-display italic font-light text-xl tracking-tight mt-0.5">
              All Terms Side by Side
            </CardTitle>
          </div>
          <div className="flex flex-wrap gap-1.5 items-center">
            <LegendDot label="Selected" tone="selected" />
            <LegendDot label="Lowest monthly" tone="monthly" />
            <LegendDot label="Lowest total" tone="total" />
            {hasBudget && <LegendDot label="In budget" tone="budget" />}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto -mx-6 px-6">
          <Table>
            <TableHeader>
              <TableRow className="border-b">
                <TableHead className="font-mono-label text-[10px] uppercase tracking-[0.18em] text-muted-foreground opacity-60 w-[64px]">
                  Months
                </TableHead>
                <TableHead className="font-mono-label text-[10px] uppercase tracking-[0.18em] text-muted-foreground opacity-60">
                  Monthly
                </TableHead>
                <TableHead className="font-mono-label text-[10px] uppercase tracking-[0.18em] text-muted-foreground opacity-60">
                  Interest
                </TableHead>
                <TableHead className="font-mono-label text-[10px] uppercase tracking-[0.18em] text-muted-foreground opacity-60">
                  Total
                </TableHead>
                <TableHead className="font-mono-label text-[10px] uppercase tracking-[0.18em] text-muted-foreground opacity-60">
                  EIR
                </TableHead>
                <TableHead className="font-mono-label text-[10px] uppercase tracking-[0.18em] text-muted-foreground opacity-60">
                  Factor
                </TableHead>
                {isBalanceConversion && (
                  <TableHead className="font-mono-label text-[10px] uppercase tracking-[0.18em] text-muted-foreground opacity-60">
                    Optimal Principal
                  </TableHead>
                )}
                <TableHead className="font-mono-label text-[10px] uppercase tracking-[0.18em] text-muted-foreground opacity-60 text-right">
                  Notes
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allPlans.map((p) => {
                const isSelected = p.months === selectedMonths;
                const isLowestMonthly = p.months === winners.lowestMonthly;
                const isLowestTotal = p.months === winners.lowestTotal;
                const inBudget = winners.budgetFriendly.has(p.months);
                const monthlyExceedsBudget = hasBudget && +p.monthlyPayment > budget;

                return (
                  <TableRow
                    key={p.months}
                    className={cn(
                      "transition-colors",
                      isSelected && "bg-foreground/[0.04] hover:bg-foreground/[0.06]"
                    )}
                  >
                    <TableCell className="font-medium tabular-nums relative">
                      {isSelected && (
                        <span
                          aria-hidden
                          className="absolute left-0 top-1.5 bottom-1.5 w-[2px] bg-foreground rounded-full"
                        />
                      )}
                      {p.months}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "tabular-nums",
                        monthlyExceedsBudget && "text-red-600 dark:text-red-400",
                        hasBudget && +p.monthlyPayment <= budget && "text-emerald-700 dark:text-emerald-400"
                      )}
                    >
                      {formatCurrency(p.monthlyPayment)}
                    </TableCell>
                    <TableCell className="tabular-nums text-orange-600 dark:text-orange-400">
                      {formatCurrency(p.interest)}
                    </TableCell>
                    <TableCell className="tabular-nums font-semibold">
                      {formatCurrency(p.totalPayment)}
                    </TableCell>
                    <TableCell className="tabular-nums">{formatPercent(p.eirPA)}</TableCell>
                    <TableCell className="tabular-nums text-muted-foreground">{p.factorRate}</TableCell>
                    {isBalanceConversion && (
                      <TableCell className="tabular-nums text-[12px] text-muted-foreground">
                        {p.suggestedPrincipal && +p.suggestedPrincipal.suggested > 0 ? (
                          <>
                            {formatCurrency(p.suggestedPrincipal.suggested)}
                            <span className="block text-[10px] opacity-70">
                              → {formatCurrency(p.suggestedPrincipal.totalPayment)}
                            </span>
                          </>
                        ) : (
                          <span className="text-muted-foreground/50">—</span>
                        )}
                      </TableCell>
                    )}
                    <TableCell className="text-right">
                      <div className="flex flex-wrap gap-1 justify-end">
                        {isSelected && <WinnerBadge tone="selected">Selected</WinnerBadge>}
                        {isLowestMonthly && <WinnerBadge tone="monthly">Lowest /mo</WinnerBadge>}
                        {isLowestTotal && <WinnerBadge tone="total">Lowest total</WinnerBadge>}
                        {inBudget && !monthlyExceedsBudget && (
                          <WinnerBadge tone="budget">In budget</WinnerBadge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

const TONE_CLASSES: Record<string, string> = {
  selected: "bg-foreground text-background border-foreground",
  monthly: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900",
  total: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-900",
  budget: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900",
};

const WinnerBadge: React.FC<{ tone: "selected" | "monthly" | "total" | "budget"; children: React.ReactNode }> = ({
  tone,
  children,
}) => (
  <Badge
    variant="outline"
    className={cn(
      "font-mono-label text-[9px] uppercase tracking-[0.12em] px-1.5 py-0 font-normal",
      TONE_CLASSES[tone]
    )}
  >
    {children}
  </Badge>
);

const DOT_TONE: Record<string, string> = {
  selected: "bg-foreground",
  monthly: "bg-blue-500",
  total: "bg-violet-500",
  budget: "bg-emerald-500",
};

const LegendDot: React.FC<{ label: string; tone: "selected" | "monthly" | "total" | "budget" }> = ({ label, tone }) => (
  <span className="inline-flex items-center gap-1 font-mono-label text-[9px] uppercase tracking-[0.12em] text-muted-foreground opacity-70">
    <span className={cn("h-1.5 w-1.5 rounded-full", DOT_TONE[tone])} />
    {label}
  </span>
);

export default OtherPlanTable;
