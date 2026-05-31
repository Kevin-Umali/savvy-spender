"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/client";
import { solveForBreakEven } from "../_lib/solver";
import type { RentVsBuyInput } from "../_lib/types";

/**
 * Goal-seek: the precise belief each lever needs for the verdict to flip. Turns
 * "buying wins" into a falsifiable claim the user can check against the market.
 */
export function GoalSeekCard({ input }: { input: RentVsBuyInput }) {
  const items = useMemo(() => {
    const appr = solveForBreakEven(input, "appreciationPct", -5, 20);
    const ret = solveForBreakEven(input, "investReturnPct", 0, 20);
    const rent = solveForBreakEven(input, "monthlyRent", 0, Math.max(80_000, input.monthlyRent * 4));

    return [
      {
        label: "Appreciation needed",
        body: appr.solved
          ? `Buying breaks even if the home appreciates at least ${appr.value}% / yr (you assumed ${input.appreciationPct}%).`
          : appr.message,
      },
      {
        label: "Return that flips it",
        body: ret.solved
          ? `Renting wins once your investments return more than ${ret.value}% / yr (you assumed ${input.investReturnPct}%).`
          : ret.message,
      },
      {
        label: "Rent threshold",
        body: rent.solved
          ? `Buying wins only while equivalent rent stays above ${formatCurrency(rent.value!)} / mo (you assumed ${formatCurrency(input.monthlyRent)}).`
          : rent.message,
      },
    ];
  }, [input]);

  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <p className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-muted-foreground opacity-60">
          Goal-seek
        </p>
        <CardTitle className="font-display font-light text-xl tracking-tight mt-0.5">
          What you&apos;d have to believe
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <div key={item.label} className="rounded-sm border border-border px-3 py-2">
            <p className="font-mono-label text-[9px] uppercase tracking-[0.16em] text-muted-foreground opacity-60 mb-0.5">
              {item.label}
            </p>
            <p className="text-sm leading-relaxed">{item.body}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
