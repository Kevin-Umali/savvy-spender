"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/client";
import { cn } from "@/lib/utils";
import type { OptionResult } from "../_lib/types";
import { HeaderRow, TableShell, Td, TdNum } from "./table-primitives";

export function TotalCostTable({ results }: { results: OptionResult[] }) {
  const cheapest = useMemo(
    () => results.reduce((a, b) => (a.totalCost < b.totalCost ? a : b)),
    [results]
  );
  return (
    <TableShell title="Table 4" caption="Total cost comparison">
      <table className="w-full text-sm">
        <thead>
          <HeaderRow
            cols={[
              "Option",
              "Total monthly",
              "Upfront cash",
              "Total fees",
              "Total cost",
              "Vs cheapest",
              "Cost above price",
            ]}
          />
        </thead>
        <tbody className="[&_tr]:border-b last:[&_tr]:border-0">
          {results.map((r) => {
            const diff = r.totalCost - cheapest.totalCost;
            const isCheapest = r.key === cheapest.key;
            return (
              <tr key={r.key}>
                <Td>
                  {r.label}
                  {isCheapest && (
                    <Badge
                      variant="outline"
                      className="ml-2 font-mono-label text-[9px] uppercase tracking-[0.12em] border-emerald-300 text-emerald-700 dark:text-emerald-400"
                    >
                      Cheapest
                    </Badge>
                  )}
                </Td>
                <TdNum>{formatCurrency(r.totalMonthlyPayments)}</TdNum>
                <TdNum>{formatCurrency(r.upfrontCash)}</TdNum>
                <TdNum>{formatCurrency(r.totalFees)}</TdNum>
                <TdNum strong>{formatCurrency(r.totalCost)}</TdNum>
                <TdNum
                  className={cn(
                    isCheapest ? "text-emerald-700 dark:text-emerald-400 font-medium" : ""
                  )}
                >
                  {isCheapest ? "—" : `+${formatCurrency(diff)}`}
                </TdNum>
                <TdNum className="text-amber-700 dark:text-amber-400">
                  {formatCurrency(r.financingCostAboveDiscounted)}
                </TdNum>
              </tr>
            );
          })}
        </tbody>
      </table>
    </TableShell>
  );
}
