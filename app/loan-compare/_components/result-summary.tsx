"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/client";
import type { OptionResult } from "../_lib/types";
import { SectionLabel } from "./form-controls";

export function ResultSummary({ results }: { results: OptionResult[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {results.map((r) => (
        <Card key={r.key} className="border-border">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <SectionLabel>Option</SectionLabel>
                <p className="font-display font-light text-base mt-0.5">{r.label}</p>
              </div>
              {r.discountApplied && (
                <Badge
                  variant="outline"
                  className="font-mono-label text-[9px] uppercase tracking-[0.12em]"
                >
                  Discount applied
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
              <span className="text-muted-foreground">Monthly</span>
              <span className="text-right tabular-nums font-medium">
                {formatCurrency(r.monthlyPayment)}
              </span>
              <span className="text-muted-foreground">Upfront cash</span>
              <span className="text-right tabular-nums font-medium">
                {formatCurrency(r.upfrontCash)}
              </span>
              <span className="text-muted-foreground">Total cost</span>
              <span className="text-right tabular-nums font-semibold">
                {formatCurrency(r.totalCost)}
              </span>
            </div>
            {r.warnings.length > 0 && (
              <p className="text-[10px] text-amber-700 dark:text-amber-400 leading-snug pt-1 border-t">
                ⚠ {r.warnings.join(" ")}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
