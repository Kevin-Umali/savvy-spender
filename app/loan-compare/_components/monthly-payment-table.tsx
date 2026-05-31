"use client";

import { formatCurrency } from "@/lib/client";
import { cn } from "@/lib/utils";
import { HeaderRow, Row, Td, TdNum, TableShell } from "./table-primitives";
import type { OptionResult } from "../_lib/types";

interface MonthlyPaymentTableProps {
  results: OptionResult[];
  cheapestId: string | null;
}

export const MonthlyPaymentTable: React.FC<MonthlyPaymentTableProps> = ({ results, cheapestId }) => {
  const sorted = [...results].sort((a, b) => a.totalLoanPayments - b.totalLoanPayments);

  return (
    <TableShell
      title="Loan payment comparison"
      subtitle="Financing only — monthly, total payments, and interest by the rate each option used."
    >
      <HeaderRow
        cols={["Option", "Rate used", "Monthly", "Total loan payments", "Total interest", "EIRPA"]}
        align={["left", "left", "right", "right", "right", "right"]}
      />
      <tbody>
        {sorted.map((result) => (
          <Row
            key={result.id}
            className={cn(result.id === cheapestId && "bg-emerald-50/50 dark:bg-emerald-950/20")}
          >
            <Td className="font-medium">{result.name}</Td>
            <Td className="text-muted-foreground text-xs">
              {result.monthlyLabel}
              {(result.monthlyMode === "monthly_addon" ||
                result.monthlyMode === "total_addon") && (
                <span className="block opacity-70">
                  eff. add-on {result.effectiveAddOnRate.toFixed(2)}% ·{" "}
                  {result.monthlyAddOnEquivalent.toFixed(4)}%/mo
                </span>
              )}
            </Td>
            <TdNum strong>{formatCurrency(result.monthlyPayment)}</TdNum>
            <TdNum>{formatCurrency(result.totalLoanPayments)}</TdNum>
            <TdNum>{formatCurrency(result.totalInterest)}</TdNum>
            <TdNum className="text-muted-foreground">
              {result.eirpa ? `${result.eirpa}%` : "—"}
            </TdNum>
          </Row>
        ))}
      </tbody>
    </TableShell>
  );
};
