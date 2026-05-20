"use client";

import { formatCurrency } from "@/lib/client";
import type { OptionResult } from "../_lib/types";
import { HeaderRow, TableShell, Td, TdNum } from "./table-primitives";

export function UpfrontCashTable({ results }: { results: OptionResult[] }) {
  return (
    <TableShell title="Table 2" caption="Upfront cash comparison">
      <table className="w-full text-sm">
        <thead>
          <HeaderRow cols={["Option", "DP / cash portion", "OMA", "Fees", "Upfront total"]} />
        </thead>
        <tbody className="[&_tr]:border-b last:[&_tr]:border-0">
          {results.map((r) => (
            <tr key={r.key}>
              <Td>{r.label}</Td>
              <TdNum>{formatCurrency(r.key === "c2c" ? r.cashPortion : r.downPayment)}</TdNum>
              <TdNum>{r.oneMonthAdvance > 0 ? formatCurrency(r.oneMonthAdvance) : "—"}</TdNum>
              <TdNum>{formatCurrency(r.totalFees)}</TdNum>
              <TdNum strong>{formatCurrency(r.upfrontCash)}</TdNum>
            </tr>
          ))}
        </tbody>
      </table>
    </TableShell>
  );
}
