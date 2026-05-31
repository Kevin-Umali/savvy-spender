"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/client";
import { toRealPesos } from "../_lib/compute";
import type { MonteCarloResult, RentVsBuyResult } from "../_lib/types";

interface Props {
  result: RentVsBuyResult;
  mc: MonteCarloResult;
  realPesos: boolean;
}

export const ResultSummary: React.FC<Props> = ({ result, mc, realPesos }) => {
  const horizon = result.input.horizonYears;
  const inflation = result.input.costInflationPct;
  const show = (v: number) => formatCurrency(realPesos ? toRealPesos(v, horizon, inflation) : v);

  const buyWins = result.buyWins;
  const gap = Math.abs(result.buyNetWorthAtHorizon - result.rentNetWorthAtHorizon);
  const pPct = Math.round(mc.pBuyWins * 100);

  return (
    <div className="space-y-4">
      {/* Verdict banner */}
      <Card
        className={cn(
          "border-2",
          buyWins
            ? "border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/20"
            : "border-sky-500/50 bg-sky-50/50 dark:bg-sky-950/20"
        )}
      >
        <CardContent className="py-4">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <p className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-muted-foreground opacity-70">
                Verdict over {horizon} years
              </p>
              <p className="font-display font-light text-2xl sm:text-3xl tracking-tight mt-1">
                {buyWins ? "Buying comes out ahead" : "Renting comes out ahead"}
              </p>
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                {buyWins ? "Buying" : "Renting"} leaves you{" "}
                <span className="font-medium text-foreground tabular-nums">{show(gap)}</span> richer
                {result.breakEvenYear
                  ? ` — buying overtakes renting in year ${result.breakEvenYear}.`
                  : " — buying never overtakes renting within your horizon."}
              </p>
            </div>
            <Badge
              className={cn(
                "font-mono-label text-[10px] uppercase tracking-[0.12em] shrink-0",
                pPct >= 50
                  ? "bg-emerald-600 hover:bg-emerald-600"
                  : "bg-sky-600 hover:bg-sky-600"
              )}
            >
              {pPct}% chance buying wins
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Stat grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="Buy net worth" value={show(result.buyNetWorthAtHorizon)} accent="emerald" />
        <Stat label="Rent net worth" value={show(result.rentNetWorthAtHorizon)} accent="sky" />
        <Stat label="Monthly mortgage" value={formatCurrency(result.monthlyMortgage)} />
        <Stat label="Upfront cash" value={formatCurrency(result.upfrontCash)} />
        <Stat
          label="Break-even year"
          value={result.breakEvenYear ? `Year ${result.breakEvenYear}` : "Never"}
        />
        <Stat
          label="Typical break-even"
          value={mc.breakEvenP50 ? `~Year ${mc.breakEvenP50}` : "Beyond horizon"}
          hint={`across ${mc.runs.toLocaleString()} scenarios`}
        />
        <Stat label="Total interest" value={formatCurrency(result.totalInterest)} />
        {result.mortgagePctOfIncome !== null ? (
          <Stat
            label="Mortgage of income"
            value={`${result.mortgagePctOfIncome.toFixed(0)}%`}
            accent={result.mortgagePctOfIncome > 30 ? "amber" : undefined}
            hint={result.mortgagePctOfIncome > 30 ? "above the ~30% rule" : "within the ~30% rule"}
          />
        ) : (
          <Stat label="Price-to-rent" value={result.priceToRent.toFixed(1)} />
        )}
      </div>
    </div>
  );
};

interface StatProps {
  label: string;
  value: string;
  hint?: string;
  accent?: "emerald" | "sky" | "amber";
}

const Stat: React.FC<StatProps> = ({ label, value, hint, accent }) => {
  return (
    <Card className="border-border">
      <CardContent className="py-3">
        <p className="font-mono-label text-[9px] uppercase tracking-[0.16em] text-muted-foreground opacity-60">
          {label}
        </p>
        <p
          className={cn(
            "tabular-nums text-base font-medium mt-1",
            accent === "emerald" && "text-emerald-600 dark:text-emerald-400",
            accent === "sky" && "text-sky-600 dark:text-sky-400",
            accent === "amber" && "text-amber-600 dark:text-amber-400"
          )}
        >
          {value}
        </p>
        {hint && <p className="text-[10px] text-muted-foreground mt-0.5">{hint}</p>}
      </CardContent>
    </Card>
  );
};
