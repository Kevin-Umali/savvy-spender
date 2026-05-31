"use client";

import { HeaderRow, Row, Td, TdNum, TableShell } from "./table-primitives";
import { formatCurrency } from "@/lib/client";
import type { OptionResult } from "../_lib/types";

export const FeesTable: React.FC<{ results: OptionResult[] }> = ({ results }) => (
  <TableShell
    title="Fees comparison"
    subtitle="Counted fees exclude anything already inside the quoted monthly or down payment. Waived fees add ₱0."
  >
    <HeaderRow
      cols={["Option", "Itemized fees", "Insurance", "Registration", "Total fees", "Waived"]}
      align={["left", "right", "right", "right", "right", "right"]}
    />
    <tbody>
      {results.map((r) => (
        <Row key={r.id}>
          <Td className="font-medium">
            {r.name}
            {r.fees.length > 0 && (
              <span className="block text-[10px] text-muted-foreground">
                {r.fees
                  .map((f) => `${f.name}${f.waived ? " (waived)" : !f.counted ? " (incl.)" : ""}`)
                  .join(", ")}
              </span>
            )}
          </Td>
          <TdNum>{formatCurrency(r.feesInTotal)}</TdNum>
          <TdNum>{r.insuranceTotal > 0 ? formatCurrency(r.insuranceTotal) : "—"}</TdNum>
          <TdNum>{r.registrationTotal > 0 ? formatCurrency(r.registrationTotal) : "—"}</TdNum>
          <TdNum strong>
            {formatCurrency(r.feesInTotal + r.insuranceTotal + r.registrationTotal)}
          </TdNum>
          <TdNum className="text-emerald-600 dark:text-emerald-400">
            {r.waivedFeesTotal > 0 ? formatCurrency(r.waivedFeesTotal) : "—"}
          </TdNum>
        </Row>
      ))}
    </tbody>
  </TableShell>
);
