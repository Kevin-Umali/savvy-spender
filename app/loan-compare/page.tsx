"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatCurrency, formatPercent } from "@/lib/client";
import { cn } from "@/lib/utils";
import { FINANCING_TYPES, TERM_OPTIONS, type FinancingKey } from "@/constant/loan-compare-data";
import { ChevronDownIcon, InfoCircledIcon, UpdateIcon } from "@radix-ui/react-icons";
import type { LoanCompareResult } from "@/app/api/loan-compare/route";

interface OptionInputs {
  downPaymentPct: number;
  interestRate: number;
  termMonths: number;
  processingFee: number;
  chattelMortgageFee: number;
  docStampTax: number;
  showAdvanced: boolean;
}

type OptionsState = Record<FinancingKey, OptionInputs>;

function defaultInputs(key: FinancingKey): OptionInputs {
  const config = FINANCING_TYPES.find((f) => f.key === key)!;
  return {
    downPaymentPct: config.defaultDpPct,
    interestRate: config.defaultRate,
    termMonths: config.defaultTerm,
    processingFee: config.defaultProcessingFee,
    chattelMortgageFee: config.defaultChattelMortgage,
    docStampTax: config.defaultDocStamp,
    showAdvanced: false,
  };
}

const InfoTip: React.FC<{ content: string }> = ({ content }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <InfoCircledIcon className="ml-1.5 h-3.5 w-3.5 inline-block text-muted-foreground cursor-help align-text-bottom" />
    </TooltipTrigger>
    <TooltipContent side="top" className="max-w-[250px] text-xs font-normal leading-relaxed">
      <p>{content}</p>
    </TooltipContent>
  </Tooltip>
);

type WinnerKeys = { lowestMonthly: string | null; lowestTotal: string | null; lowestEir: string | null };

function computeWinners(results: LoanCompareResult[]): WinnerKeys {
  if (!results.length) return { lowestMonthly: null, lowestTotal: null, lowestEir: null };
  return {
    lowestMonthly: results.reduce((a, b) => (a.monthlyPayment < b.monthlyPayment ? a : b)).type,
    lowestTotal: results.reduce((a, b) => (a.totalCostWithDP < b.totalCostWithDP ? a : b)).type,
    lowestEir: results.reduce((a, b) => (a.eirPA < b.eirPA ? a : b)).type,
  };
}

const TONE_CLASSES: Record<string, string> = {
  monthly: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900",
  total: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-900",
  eir: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-900",
};

export default function LoanComparePage() {
  const [vehiclePrice, setVehiclePrice] = useState<number>(500000);
  const [options, setOptions] = useState<OptionsState>({
    "in-house": defaultInputs("in-house"),
    "bank-auto": defaultInputs("bank-auto"),
    "credit-to-cash": defaultInputs("credit-to-cash"),
  });
  const [results, setResults] = useState<LoanCompareResult[]>([]);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const updateOption = useCallback(<K extends keyof OptionInputs>(
    key: FinancingKey,
    field: K,
    value: OptionInputs[K]
  ) => {
    setOptions((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
  }, []);

  const handleCalculate = async () => {
    if (!vehiclePrice || vehiclePrice <= 0) {
      toast.error("Please enter a valid vehicle price.");
      return;
    }
    setIsLoading(true);
    try {
      const body = {
        vehiclePrice,
        options: FINANCING_TYPES.map((f) => {
          const opt = options[f.key];
          return {
            type: f.key,
            downPaymentPct: opt.downPaymentPct,
            interestRate: opt.interestRate,
            termMonths: opt.termMonths,
            processingFee: opt.processingFee,
            chattelMortgageFee: opt.chattelMortgageFee,
            docStampTax: opt.docStampTax,
          };
        }),
      };
      const res = await fetch("/api/loan-compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Calculation failed");
      const data = await res.json();
      setResults(data.results);
      setHasCalculated(true);
    } catch {
      toast.error("Failed to calculate. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setVehiclePrice(500000);
    setOptions({
      "in-house": defaultInputs("in-house"),
      "bank-auto": defaultInputs("bank-auto"),
      "credit-to-cash": defaultInputs("credit-to-cash"),
    });
    setResults([]);
    setHasCalculated(false);
  };

  const winners = computeWinners(results);

  return (
    <TooltipProvider delayDuration={200}>
      <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {/* Page Header */}
        <div className="mb-8 max-w-3xl">
          <p className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-muted-foreground opacity-60 mb-2">
            Tool
          </p>
          <h1 className="font-display italic font-light text-3xl sm:text-4xl lg:text-5xl tracking-tight">
            Loan Comparison
          </h1>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
            Compare in-house financing, bank auto loan, and credit-to-cash side by side. See the real cost of each option including down payment, fees, and effective interest rate.
          </p>
        </div>

        <div className="grid lg:grid-cols-[400px_1fr] gap-6 lg:gap-10">
          {/* Form panel */}
          <aside className="lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-2 -mr-2">
            <Card className="border-border">
              <CardHeader className="pb-4">
                <p className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-muted-foreground opacity-60">
                  Inputs
                </p>
                <CardTitle className="font-display italic font-light text-xl tracking-tight">
                  Configure your scenario
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Vehicle price */}
                <div>
                  <Label className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-muted-foreground opacity-60 mb-2 block">
                    Vehicle / Asset Price
                  </Label>
                  <Input
                    type="number"
                    min={1}
                    value={vehiclePrice}
                    onChange={(e) => setVehiclePrice(+e.target.value)}
                    placeholder="500000"
                    className="tabular-nums"
                    disabled={isLoading}
                  />
                  <p className="mt-1.5 text-[11px] text-muted-foreground">
                    Total sticker / cash price before any down payment.
                  </p>
                </div>

                <div className="border-t pt-4 space-y-4">
                  <p className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-muted-foreground opacity-60">
                    Financing Options
                  </p>
                  {FINANCING_TYPES.map((ftype) => {
                    const opt = options[ftype.key];
                    return (
                      <OptionPanel
                        key={ftype.key}
                        ftype={ftype}
                        opt={opt}
                        isLoading={isLoading}
                        onChange={(field, value) => updateOption(ftype.key, field, value)}
                        onToggleAdvanced={() => updateOption(ftype.key, "showAdvanced", !opt.showAdvanced)}
                      />
                    );
                  })}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={handleCalculate}
                    disabled={isLoading}
                    className="flex-1 font-mono-label text-[11px] uppercase tracking-[0.15em]"
                  >
                    {isLoading ? (
                      <>
                        <UpdateIcon className="mr-2 h-3.5 w-3.5 animate-spin" />
                        Calculating
                      </>
                    ) : (
                      "Compare"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    disabled={isLoading}
                    className="font-mono-label text-[11px] uppercase tracking-[0.15em]"
                  >
                    Reset
                  </Button>
                </div>

                <p className="text-[10px] text-muted-foreground/70 leading-relaxed border-t pt-3">
                  Results are estimates using add-on (flat) interest. EIR is computed via Newton-Raphson. Verify all rates and fees with your lender.
                </p>
              </CardContent>
            </Card>
          </aside>

          {/* Results panel */}
          <section className="space-y-6 min-w-0">
            {!hasCalculated && !isLoading ? (
              <EmptyState />
            ) : isLoading ? (
              <LoadingSkeleton />
            ) : (
              <>
                {/* Summary cards */}
                <div className="grid grid-cols-1 gap-4">
                  {FINANCING_TYPES.map((ftype) => {
                    const result = results.find((r) => r.type === ftype.key);
                    if (!result) return null;
                    return (
                      <ResultCard
                        key={ftype.key}
                        label={ftype.label}
                        shortLabel={ftype.shortLabel}
                        result={result}
                        winners={winners}
                        notes={ftype.notes}
                      />
                    );
                  })}
                </div>

                {/* Side-by-side comparison table */}
                <ComparisonTable results={results} vehiclePrice={vehiclePrice} winners={winners} />
              </>
            )}
          </section>
        </div>
      </main>
    </TooltipProvider>
  );
}

/* ── Sub-components ───────────────────────────────────────────────── */

interface OptionPanelProps {
  ftype: (typeof FINANCING_TYPES)[number];
  opt: OptionInputs;
  isLoading: boolean;
  onChange: <K extends keyof OptionInputs>(field: K, value: OptionInputs[K]) => void;
  onToggleAdvanced: () => void;
}

function OptionPanel({ ftype, opt, isLoading, onChange, onToggleAdvanced }: OptionPanelProps) {
  return (
    <div className="rounded-sm border p-3 space-y-3">
      <div>
        <p className="font-display italic font-light text-base">{ftype.label}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">{ftype.rateRange}</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {ftype.requiresDP && (
          <div>
            <Label className="font-mono-label text-[10px] uppercase tracking-[0.18em] text-muted-foreground opacity-60 mb-1 block">
              Down Payment (%)
            </Label>
            <Input
              type="number"
              min={0}
              max={100}
              step={5}
              value={opt.downPaymentPct}
              onChange={(e) => onChange("downPaymentPct", +e.target.value)}
              className="tabular-nums h-8 text-sm"
              disabled={isLoading}
            />
          </div>
        )}
        <div className={ftype.requiresDP ? "" : "col-span-2"}>
          <Label className="font-mono-label text-[10px] uppercase tracking-[0.18em] text-muted-foreground opacity-60 mb-1 block">
            Monthly Rate (%)
            <InfoTip content="Monthly add-on (flat) rate. Interest is computed on the original principal every month." />
          </Label>
          <Input
            type="number"
            min={0}
            step={0.01}
            value={opt.interestRate}
            onChange={(e) => onChange("interestRate", +e.target.value)}
            className="tabular-nums h-8 text-sm"
            disabled={isLoading}
          />
        </div>
      </div>

      <div>
        <Label className="font-mono-label text-[10px] uppercase tracking-[0.18em] text-muted-foreground opacity-60 mb-1.5 block">
          Term (Months)
        </Label>
        <div className="flex flex-wrap gap-1">
          {TERM_OPTIONS.map((t) => (
            <button
              key={t}
              type="button"
              disabled={isLoading}
              onClick={() => onChange("termMonths", +t)}
              className={cn(
                "font-mono-label text-[11px] tabular-nums rounded-sm px-2 py-1 border transition-colors",
                opt.termMonths === +t
                  ? "border-foreground bg-foreground text-background"
                  : "border-foreground/20 hover:border-foreground/50"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced fees */}
      <div className="border-t pt-2">
        <button
          type="button"
          onClick={onToggleAdvanced}
          className="flex items-center gap-1.5 font-mono-label text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronDownIcon className={cn("h-3 w-3 transition-transform", opt.showAdvanced && "rotate-180")} />
          Fees
        </button>
        {opt.showAdvanced && (
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div>
              <Label className="font-mono-label text-[10px] uppercase tracking-[0.15em] text-muted-foreground/70 mb-1 block">
                Processing Fee
              </Label>
              <Input
                type="number"
                min={0}
                value={opt.processingFee}
                onChange={(e) => onChange("processingFee", +e.target.value)}
                className="tabular-nums h-7 text-xs"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label className="font-mono-label text-[10px] uppercase tracking-[0.15em] text-muted-foreground/70 mb-1 block">
                Chattel Mortgage
              </Label>
              <Input
                type="number"
                min={0}
                value={opt.chattelMortgageFee}
                onChange={(e) => onChange("chattelMortgageFee", +e.target.value)}
                className="tabular-nums h-7 text-xs"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label className="font-mono-label text-[10px] uppercase tracking-[0.15em] text-muted-foreground/70 mb-1 block">
                Doc Stamp Tax
              </Label>
              <Input
                type="number"
                min={0}
                value={opt.docStampTax}
                onChange={(e) => onChange("docStampTax", +e.target.value)}
                className="tabular-nums h-7 text-xs"
                disabled={isLoading}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ResultCard({
  label,
  shortLabel: _shortLabel,
  result,
  winners,
  notes,
}: {
  label: string;
  shortLabel: string;
  result: LoanCompareResult;
  winners: WinnerKeys;
  notes: string;
}) {
  const isLowestMonthly = result.type === winners.lowestMonthly;
  const isLowestTotal = result.type === winners.lowestTotal;
  const isLowestEir = result.type === winners.lowestEir;

  return (
    <Card className="border-border overflow-hidden">
      <div className="bg-muted/30 px-5 py-3 border-b flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-muted-foreground opacity-60">
            Financing
          </p>
          <h2 className="font-display italic font-light text-lg mt-0.5">{label}</h2>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {isLowestMonthly && <WinBadge tone="monthly">Lowest /mo</WinBadge>}
          {isLowestTotal && <WinBadge tone="total">Lowest total</WinBadge>}
          {isLowestEir && <WinBadge tone="eir">Lowest EIR</WinBadge>}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0">
        <Stat label="Monthly Payment" value={formatCurrency(result.monthlyPayment)} accent="primary" />
        <Stat label="Total Cost (w/ DP)" value={formatCurrency(result.totalCostWithDP)} accent="primary" />
        <Stat label="Total Interest" value={formatCurrency(result.totalInterest)} accent="warning" />
        <Stat label="EIR (per annum)" value={`${result.eirPA}%`} accent="neutral" />
      </div>

      {(result.downPayment > 0 || result.totalFees > 0) && (
        <div className="border-t bg-muted/10 px-5 py-2.5">
          <dl className="flex flex-wrap gap-x-6 gap-y-1 text-[11px]">
            {result.downPayment > 0 && (
              <>
                <dt className="font-mono-label text-[10px] uppercase tracking-[0.18em] text-muted-foreground opacity-60">
                  Down Payment
                </dt>
                <dd className="tabular-nums font-medium">{formatCurrency(result.downPayment)}</dd>
              </>
            )}
            <dt className="font-mono-label text-[10px] uppercase tracking-[0.18em] text-muted-foreground opacity-60">
              Loan Amount
            </dt>
            <dd className="tabular-nums font-medium">{formatCurrency(result.principal)}</dd>
            {result.totalFees > 0 && (
              <>
                <dt className="font-mono-label text-[10px] uppercase tracking-[0.18em] text-muted-foreground opacity-60">
                  Fees
                </dt>
                <dd className="tabular-nums font-medium">{formatCurrency(result.totalFees)}</dd>
              </>
            )}
          </dl>
        </div>
      )}

      <div className="px-5 py-2 border-t">
        <p className="text-[11px] text-muted-foreground leading-relaxed">{notes}</p>
      </div>
    </Card>
  );
}

function ComparisonTable({
  results,
  vehiclePrice,
  winners,
}: {
  results: LoanCompareResult[];
  vehiclePrice: number;
  winners: WinnerKeys;
}) {
  if (!results.length) return null;

  const rows: { label: string; getValue: (r: LoanCompareResult) => string; winnerKey?: keyof WinnerKeys }[] = [
    { label: "Down Payment", getValue: (r) => formatCurrency(r.downPayment) },
    { label: "Loan Amount", getValue: (r) => formatCurrency(r.principal) },
    { label: "Monthly Payment", getValue: (r) => formatCurrency(r.monthlyPayment), winnerKey: "lowestMonthly" },
    { label: "Simple Interest", getValue: (r) => formatPercent(r.simpleInterest) },
    { label: "Total Interest", getValue: (r) => formatCurrency(r.totalInterest) },
    { label: "Fees", getValue: (r) => formatCurrency(r.totalFees) },
    { label: "Total (loan + fees)", getValue: (r) => formatCurrency(r.totalPayment) },
    { label: "Total Cost (incl. DP)", getValue: (r) => formatCurrency(r.totalCostWithDP), winnerKey: "lowestTotal" },
    { label: "EIR (per annum)", getValue: (r) => `${r.eirPA}%`, winnerKey: "lowestEir" },
  ];

  const getWinnerType = (key: keyof WinnerKeys) => winners[key];

  return (
    <Card className="border-border overflow-hidden">
      <CardHeader className="pb-3">
        <p className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-muted-foreground opacity-60">
          Full Breakdown
        </p>
        <CardTitle className="font-display italic font-light text-xl tracking-tight mt-0.5">
          Side-by-Side Comparison
        </CardTitle>
        <p className="text-[11px] text-muted-foreground">
          Vehicle price:{" "}
          <span className="tabular-nums font-medium text-foreground">{formatCurrency(vehiclePrice)}</span>
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left font-mono-label text-[10px] uppercase tracking-[0.18em] text-muted-foreground opacity-60 py-2 pr-4 w-44">
                  Metric
                </th>
                {FINANCING_TYPES.map((f) => (
                  <th
                    key={f.key}
                    className="text-right font-mono-label text-[10px] uppercase tracking-[0.18em] text-muted-foreground opacity-60 py-2 px-3"
                  >
                    {f.shortLabel}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-b last:border-0">
                  <td className="py-2 pr-4 text-[12px] text-muted-foreground">{row.label}</td>
                  {FINANCING_TYPES.map((f) => {
                    const result = results.find((r) => r.type === f.key);
                    if (!result) return <td key={f.key} className="py-2 px-3 text-right tabular-nums">—</td>;
                    const isWinner = row.winnerKey && getWinnerType(row.winnerKey) === f.key;
                    return (
                      <td
                        key={f.key}
                        className={cn(
                          "py-2 px-3 text-right tabular-nums",
                          isWinner && "font-semibold text-emerald-700 dark:text-emerald-400"
                        )}
                      >
                        {row.getValue(result)}
                        {isWinner && (
                          <span className="ml-1 text-[10px] opacity-70">★</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: "primary" | "warning" | "neutral";
}) {
  return (
    <div className="px-5 py-4">
      <p className="font-mono-label text-[10px] uppercase tracking-[0.18em] text-muted-foreground opacity-60">{label}</p>
      <p
        className={cn(
          "mt-1.5 font-display italic font-light text-2xl tabular-nums tracking-tight",
          accent === "warning" && "text-orange-600 dark:text-orange-400"
        )}
      >
        {value}
      </p>
    </div>
  );
}

function WinBadge({ tone, children }: { tone: "monthly" | "total" | "eir"; children: React.ReactNode }) {
  return (
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
}

function EmptyState() {
  return (
    <div className="border border-dashed rounded-md p-10 text-center">
      <p className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-muted-foreground opacity-60 mb-3">
        No comparison yet
      </p>
      <h2 className="font-display italic font-light text-xl sm:text-2xl mb-2">
        Configure your options and compare
      </h2>
      <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
        Set the vehicle price and adjust each financing option on the left, then hit Compare to see monthly payments,
        total cost, and effective interest rates side by side.
      </p>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="border-border overflow-hidden">
          <div className="bg-muted/30 px-5 py-3 border-b">
            <div className="animate-pulse bg-muted rounded h-5 w-40" />
          </div>
          <div className="grid grid-cols-4 divide-x">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="px-5 py-4 space-y-2">
                <div className="animate-pulse bg-muted rounded h-3 w-20" />
                <div className="animate-pulse bg-muted rounded h-7 w-24" />
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
