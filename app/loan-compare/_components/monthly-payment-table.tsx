"use client";

import { formatCurrency } from "@/lib/client";
import type { OptionResult } from "../_lib/types";
import { HeaderRow, TableShell, Td, TdNum } from "./table-primitives";

export function MonthlyPaymentTable({ results }: { results: OptionResult[] }) {
  return (
    <TableShell title="Table 3" caption="Monthly payment comparison">
      <table className="w-full text-sm">
        <thead>
          <HeaderRow cols={["Option", "Term", "Monthly", "Type", "Notes"]} />
        </thead>
        <tbody className="[&_tr]:border-b last:[&_tr]:border-0">
          {results.map((r) => (
            <tr key={r.key}>
              <Td>{r.label}</Td>
              <TdNum>{r.termMonths} mo</TdNum>
              <TdNum strong>{formatCurrency(r.monthlyPayment)}</TdNum>
              <Td>{r.paymentTypeLabel}</Td>
              <Td className="text-muted-foreground text-[11px]">
                {r.monthlyLabel}
                {r.key === "c2c" && r.eirpa ? ` · EIR ${r.eirpa}% p.a.` : ""}
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableShell>
  );
}
