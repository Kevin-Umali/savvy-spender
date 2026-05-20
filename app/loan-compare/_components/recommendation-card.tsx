"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/client";
import { PRIORITY_OPTIONS, type Priority } from "../_lib/options";
import {
  computeRecommendations,
  pickByPriority,
  priorityRationale,
} from "../_lib/recommendation";
import type { OptionResult } from "../_lib/types";
import { FieldLabel, SectionLabel } from "./form-controls";
import { Row } from "./table-primitives";

export function RecommendationCard({
  results,
  priority,
  setPriority,
}: {
  results: OptionResult[];
  priority: Priority;
  setPriority: (p: Priority) => void;
}) {
  const recs = useMemo(() => computeRecommendations(results), [results]);
  const priorityWinner = pickByPriority(results, priority);

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <SectionLabel>Table 5</SectionLabel>
        <CardTitle className="font-display font-light text-lg tracking-tight">
          Recommendation summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-sm">
            <tbody className="[&_tr]:border-b last:[&_tr]:border-0">
              <Row
                label="Lowest monthly payment"
                value={recs.lowestMonthly.label}
                sub={formatCurrency(recs.lowestMonthly.monthlyPayment)}
              />
              <Row
                label="Lowest upfront cash"
                value={recs.lowestUpfront.label}
                sub={formatCurrency(recs.lowestUpfront.upfrontCash)}
              />
              <Row
                label="Lowest total cost"
                value={recs.lowestTotal.label}
                sub={formatCurrency(recs.lowestTotal.totalCost)}
              />
              <Row
                label="Simplest process"
                value="Credit-to-Cash"
                sub="Treated as a cash purchase, no chattel"
              />
              <Row
                label="No chattel mortgage"
                value={recs.noChattel.label}
                sub={formatCurrency(recs.noChattel.totalCost)}
              />
            </tbody>
          </table>
        </div>

        <div className="border-t pt-4">
          <FieldLabel>Your priority</FieldLabel>
          <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
            <SelectTrigger className="h-9 text-sm max-w-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRIORITY_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {priorityWinner && (
            <div className="mt-4 rounded-md border border-emerald-200 dark:border-emerald-900 bg-emerald-50/60 dark:bg-emerald-950/30 p-4">
              <SectionLabel>Best for your priority</SectionLabel>
              <p className="font-display font-light text-xl mt-1">{priorityWinner.label}</p>
              <p className="text-[12px] text-muted-foreground mt-1 leading-relaxed">
                {priorityRationale(priority, priorityWinner)}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
