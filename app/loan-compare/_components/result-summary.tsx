"use client";

import { AlertTriangle, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/client";
import type { OptionResult } from "../_lib/types";

interface MetricProps {
  label: string;
  value: string;
}

const Metric: React.FC<MetricProps> = ({ label, value }) => (
  <div>
    <p className="font-mono-label text-[9px] uppercase tracking-[0.15em] text-muted-foreground opacity-60">
      {label}
    </p>
    <p className="tabular-nums text-sm font-medium leading-tight">{value}</p>
  </div>
);

interface ResultSummaryProps {
  results: OptionResult[];
  cheapestId: string | null;
}

export const ResultSummary: React.FC<ResultSummaryProps> = ({ results, cheapestId }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
    {results.map((result) => {
      const isCheapest = result.id === cheapestId;
      return (
        <Card
          key={result.id}
          className={cn(
            "border-border",
            isCheapest && "border-emerald-500/60 bg-emerald-50/40 dark:bg-emerald-950/20"
          )}
        >
          <CardContent className="pt-4 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium text-sm leading-tight">{result.name}</p>
                <p className="text-[11px] text-muted-foreground">
                  {result.typeLabel}
                  {result.provider ? ` · ${result.provider}` : ""}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                {isCheapest && (
                  <Badge className="bg-emerald-600 hover:bg-emerald-600 gap-1 text-[9px] uppercase tracking-wider">
                    <Trophy className="h-3 w-3" /> Cheapest
                  </Badge>
                )}
                {result.discountApplied && (
                  <Badge variant="outline" className="text-[9px] uppercase tracking-wider">
                    Discount applied
                  </Badge>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
              <Metric label="Monthly" value={formatCurrency(result.monthlyPayment)} />
              <Metric label="Upfront" value={formatCurrency(result.upfrontCash)} />
              <Metric label="Total" value={formatCurrency(result.totalCost)} />
            </div>

            {result.warnings.length > 0 && (
              <ul className="space-y-1 pt-1">
                {result.warnings.map((warning, i) => (
                  <li
                    key={i}
                    className="flex gap-1.5 text-[10px] text-amber-700 dark:text-amber-400 leading-snug"
                  >
                    <AlertTriangle className="h-3 w-3 shrink-0 mt-0.5" />
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      );
    })}
  </div>
);
