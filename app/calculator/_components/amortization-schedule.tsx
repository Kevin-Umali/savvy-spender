"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/client";
import { InstallmentOption } from "../_lib/types";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

interface AmortizationScheduleProps {
  selected: InstallmentOption | undefined;
  principal: number;
  monthlyRate: number;
}

interface AmortizationRow {
  month: number;
  payment: number;
  principalPortion: number;
  interestPortion: number;
  remainingBalance: number;
  totalPaidSoFar: number;
}

const AmortizationSchedule: React.FC<AmortizationScheduleProps> = ({ selected, principal, monthlyRate }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const schedule = useMemo(() => {
    if (!selected) return [];

    const months = +selected.months;
    const monthlyPayment = +selected.monthlyPayment;
    const interestPerMonth = principal * monthlyRate;
    const principalPerMonth = monthlyPayment - interestPerMonth;

    const rows: AmortizationRow[] = [];
    let remainingBalance = principal;

    for (let i = 1; i <= months; i++) {
      remainingBalance = Math.max(0, remainingBalance - principalPerMonth);
      rows.push({
        month: i,
        payment: monthlyPayment,
        principalPortion: principalPerMonth,
        interestPortion: interestPerMonth,
        remainingBalance: i === months ? 0 : remainingBalance,
        totalPaidSoFar: monthlyPayment * i,
      });
    }

    return rows;
  }, [selected, principal, monthlyRate]);

  if (!selected || schedule.length === 0) return null;

  return (
    <Card className="border-border">
      <CardHeader
        className="cursor-pointer pb-3"
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-muted-foreground opacity-60">
              Schedule
            </p>
            <CardTitle className="font-display font-light text-xl tracking-tight mt-0.5">
              Month-by-Month
            </CardTitle>
            <CardDescription className="text-[12px] mt-1">
              <span className="tabular-nums">{+selected.months}</span>{" "}
              month{+selected.months === 1 ? "" : "s"} · constant payments via add-on (flat) rate.
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" aria-label={isExpanded ? "Collapse schedule" : "Expand schedule"}>
            {isExpanded ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent>
          <div className="max-h-[480px] overflow-y-auto -mx-6 px-6 border-t">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead className={cn("font-mono-label text-[10px] uppercase tracking-[0.18em] text-muted-foreground opacity-60 w-[64px]")}>
                    Month
                  </TableHead>
                  <TableHead className="font-mono-label text-[10px] uppercase tracking-[0.18em] text-muted-foreground opacity-60">
                    Payment
                  </TableHead>
                  <TableHead className="font-mono-label text-[10px] uppercase tracking-[0.18em] text-muted-foreground opacity-60">
                    Principal
                  </TableHead>
                  <TableHead className="font-mono-label text-[10px] uppercase tracking-[0.18em] text-muted-foreground opacity-60">
                    Interest
                  </TableHead>
                  <TableHead className="font-mono-label text-[10px] uppercase tracking-[0.18em] text-muted-foreground opacity-60">
                    Balance
                  </TableHead>
                  <TableHead className="font-mono-label text-[10px] uppercase tracking-[0.18em] text-muted-foreground opacity-60">
                    Total Paid
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedule.map((row) => (
                  <TableRow key={row.month}>
                    <TableCell className="font-medium tabular-nums">{row.month}</TableCell>
                    <TableCell className="tabular-nums">{formatCurrency(row.payment)}</TableCell>
                    <TableCell className="tabular-nums">{formatCurrency(row.principalPortion)}</TableCell>
                    <TableCell className="tabular-nums text-orange-600 dark:text-orange-400">
                      {formatCurrency(row.interestPortion)}
                    </TableCell>
                    <TableCell className="tabular-nums">{formatCurrency(row.remainingBalance)}</TableCell>
                    <TableCell className="tabular-nums text-muted-foreground">{formatCurrency(row.totalPaidSoFar)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="text-[11px] text-muted-foreground/80 mt-3 leading-relaxed">
            Under the add-on (flat) method, principal and interest portions are constant. Interest is charged on the
            original principal every month — your balance does not diminish for interest calculation purposes.
          </p>
        </CardContent>
      )}
    </Card>
  );
};

export default AmortizationSchedule;
