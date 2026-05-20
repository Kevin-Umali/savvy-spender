"use client";

import { formatCurrency } from "@/lib/client";
import { DISCOUNT_APPLIES_OPTIONS } from "../_lib/options";
import type { LoanCompareResponse } from "../_lib/types";
import { Row, TableShell } from "./table-primitives";

export function KeyAssumptionsTable({ response }: { response: LoanCompareResponse }) {
  const { vehicleName, originalPrice, dealerDiscount, results } = response;
  return (
    <TableShell title="Table 1" caption="Key assumptions">
      <table className="w-full text-sm">
        <tbody className="[&_tr]:border-b last:[&_tr]:border-0">
          <Row label="Vehicle" value={vehicleName || "—"} />
          <Row label="Original price" value={formatCurrency(originalPrice)} />
          <Row label="Dealer discount" value={formatCurrency(dealerDiscount)} />
          <Row
            label="Discount applies to"
            value={
              DISCOUNT_APPLIES_OPTIONS.find((o) => o.value === response.discountAppliesTo)?.label ??
              "—"
            }
          />
          {results.map((r) => (
            <Row
              key={r.key}
              label={`${r.label} — discounted price`}
              value={`${formatCurrency(r.discountedPrice)}${r.discountApplied ? "" : " (no discount)"}`}
            />
          ))}
          {results.map((r) => (
            <Row
              key={`${r.key}-loan`}
              label={`${r.label} — loan amount (${r.termMonths} mo)`}
              value={formatCurrency(r.loanAmount)}
            />
          ))}
        </tbody>
      </table>
    </TableShell>
  );
}
