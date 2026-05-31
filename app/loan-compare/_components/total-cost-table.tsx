"use client";

import { formatCurrency } from "@/lib/client";
import { cn } from "@/lib/utils";
import { COMPARISON_SCOPE_OPTIONS, type ComparisonScope } from "../_lib/options";
import { HeaderRow, Row, Td, TdNum, TableShell } from "./table-primitives";
import type { OptionResult } from "../_lib/types";

interface TotalCostTableProps {
  results: OptionResult[];
  cheapestId: string | null;
  scope: ComparisonScope;
}

export const TotalCostTable: React.FC<TotalCostTableProps> = ({ results, cheapestId, scope }) => {
  const scopeLabel =
    COMPARISON_SCOPE_OPTIONS.find((o) => o.value === scope)?.label ?? "Full car purchase";
  const sorted = [...results].sort((a, b) => a.differenceVsCheapest - b.differenceVsCheapest);

  return (
    <TableShell
      title="Total cost comparison"
      subtitle={`Ranked by the "${scopeLabel}" scope. "Vs cheapest" is the gap on that same metric.`}
    >
      <HeaderRow
        cols={[
          "Option",
          "Upfront cash",
          "Total loan payments",
          "Fees",
          "Total cost",
          "Cost above price",
          "Vs cheapest",
        ]}
        align={["left", "right", "right", "right", "right", "right", "right"]}
      />
      <tbody>
        {sorted.map((result) => {
          const isCheapest = result.id === cheapestId;
          return (
            <Row
              key={result.id}
              className={cn(isCheapest && "bg-emerald-50/50 dark:bg-emerald-950/20")}
            >
              <Td className="font-medium">{result.name}</Td>
              <TdNum>{formatCurrency(result.upfrontCash)}</TdNum>
              <TdNum>{formatCurrency(result.totalLoanPayments)}</TdNum>
              <TdNum>
                {formatCurrency(
                  result.feesInTotal + result.insuranceTotal + result.registrationTotal
                )}
              </TdNum>
              <TdNum strong>{formatCurrency(result.totalCost)}</TdNum>
              <TdNum className="text-amber-700 dark:text-amber-400">
                {formatCurrency(result.financingCostAboveDiscounted)}
              </TdNum>
              <TdNum
                className={cn(isCheapest && "text-emerald-600 dark:text-emerald-400 font-semibold")}
              >
                {isCheapest ? "Cheapest" : `+${formatCurrency(result.differenceVsCheapest)}`}
              </TdNum>
            </Row>
          );
        })}
      </tbody>
    </TableShell>
  );
};
