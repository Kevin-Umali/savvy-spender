import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/client";
import { InstallmentOption } from "@/interfaces";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";

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
  const [isExpanded, setIsExpanded] = useState(false);

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
    <Card>
      <CardHeader className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Amortization Schedule</CardTitle>
            <CardDescription>Month-by-month payment breakdown for {+selected.months} months.</CardDescription>
          </div>
          <Button variant="ghost" size="sm">
            {isExpanded ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent>
          <p className="text-xs text-muted-foreground mb-3">
            Using the add-on (flat) rate method, both the principal and interest portions are constant each month. The
            bank charges interest on the original full principal for every month — your balance does not &quot;diminish&quot; for
            interest calculation purposes.
          </p>
          <div className="overflow-x-auto -mx-6 px-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Month</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Principal</TableHead>
                  <TableHead>Interest</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Total Paid</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedule.map((row) => (
                  <TableRow key={row.month}>
                    <TableCell className="font-medium">{row.month}</TableCell>
                    <TableCell>{formatCurrency(row.payment)}</TableCell>
                    <TableCell>{formatCurrency(row.principalPortion)}</TableCell>
                    <TableCell className="text-orange-600 dark:text-orange-400">
                      {formatCurrency(row.interestPortion)}
                    </TableCell>
                    <TableCell>{formatCurrency(row.remainingBalance)}</TableCell>
                    <TableCell className="text-muted-foreground">{formatCurrency(row.totalPaidSoFar)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default AmortizationSchedule;
