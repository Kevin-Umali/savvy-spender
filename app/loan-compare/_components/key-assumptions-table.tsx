"use client";

import { formatCurrency } from "@/lib/client";
import { HeaderRow, Row, Td, TdNum, TableShell } from "./table-primitives";
import type { LoanCompareResponse } from "../_lib/types";

interface KeyAssumptionsTableProps {
  response: LoanCompareResponse;
}

export const KeyAssumptionsTable: React.FC<KeyAssumptionsTableProps> = ({ response }) => {
  const discountLabel =
    response.discountAppliesTo === "none" || response.discountAmount === 0
      ? "None"
      : response.discountType === "percent"
      ? `${response.discountAmount}% (${response.discountAppliesTo})`
      : `${formatCurrency(response.discountAmount)} (${response.discountAppliesTo})`;

  return (
    <TableShell
      title="Key assumptions"
      subtitle={`${response.vehicleName || "Vehicle"} · discount: ${discountLabel}`}
    >
      <HeaderRow
        cols={["Option", "Type", "Discounted price", "Net price", "Loan amount", "Term"]}
        align={["left", "left", "right", "right", "right", "right"]}
      />
      <tbody>
        <Row className="bg-muted/10">
          <Td className="font-medium">Vehicle</Td>
          <Td className="text-muted-foreground text-xs">Original price</Td>
          <TdNum className="text-muted-foreground">{formatCurrency(response.originalPrice)}</TdNum>
          <TdNum className="text-muted-foreground">{discountLabel}</TdNum>
          <Td />
          <Td />
        </Row>
        {response.results.map((result) => (
          <Row key={result.id}>
            <Td className="font-medium">{result.name}</Td>
            <Td className="text-muted-foreground text-xs">{result.typeLabel}</Td>
            <TdNum>{formatCurrency(result.discountedPrice)}</TdNum>
            <TdNum>{formatCurrency(result.netVehiclePrice)}</TdNum>
            <TdNum>{formatCurrency(result.loanAmount)}</TdNum>
            <TdNum>{result.termMonths} mo</TdNum>
          </Row>
        ))}
      </tbody>
    </TableShell>
  );
};
