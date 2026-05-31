"use client";

import { formatCurrency } from "@/lib/client";
import { HeaderRow, Row, Td, TdNum, TableShell } from "./table-primitives";
import type { OptionResult } from "../_lib/types";

interface UpfrontCashTableProps {
  results: OptionResult[];
}

export const UpfrontCashTable: React.FC<UpfrontCashTableProps> = ({ results }) => (
  <TableShell
    title="Upfront cash comparison"
    subtitle="Cash needed at signing: down payment / cash portion, one-month advance, reservation, upfront fees, insurance, registration."
  >
    <HeaderRow
      cols={[
        "Option",
        "DP / cash",
        "1-mo advance",
        "Reservation",
        "Upfront fees",
        "Ins. + reg.",
        "Total upfront",
      ]}
      align={["left", "right", "right", "right", "right", "right", "right"]}
    />
    <tbody>
      {results.map((result) => (
        <Row key={result.id}>
          <Td className="font-medium">{result.name}</Td>
          <TdNum>{formatCurrency(result.downPayment + result.cashPortion)}</TdNum>
          <TdNum>
            {result.oneMonthAdvance > 0 ? formatCurrency(result.oneMonthAdvance) : "—"}
          </TdNum>
          <TdNum>{result.reservationFee > 0 ? formatCurrency(result.reservationFee) : "—"}</TdNum>
          <TdNum>{result.upfrontFees > 0 ? formatCurrency(result.upfrontFees) : "—"}</TdNum>
          <TdNum>{formatCurrency(result.insuranceTotal + result.registrationTotal)}</TdNum>
          <TdNum strong>{formatCurrency(result.upfrontCash)}</TdNum>
        </Row>
      ))}
    </tbody>
  </TableShell>
);
