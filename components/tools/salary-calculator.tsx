"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { calculateSalary, type SalaryBreakdown } from "@/lib/calculators";
import { formatCurrency } from "@/lib/client";

export default function SalaryCalculator() {
  const [grossSalary, setGrossSalary] = useState("");
  const [result, setResult] = useState<SalaryBreakdown | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const salary = parseFloat(grossSalary);
    if (isNaN(salary) || salary <= 0) return;
    setResult(calculateSalary(salary));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Salary Calculator (Philippines)</CardTitle>
        <CardDescription>
          Compute your net take-home pay after SSS, PhilHealth, Pag-IBIG, and withholding tax.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="max-w-sm space-y-2">
            <Label htmlFor="gross-salary">Gross Monthly Salary</Label>
            <Input
              id="gross-salary"
              type="number"
              step="0.01"
              min="0"
              placeholder="e.g. 35000"
              value={grossSalary}
              onChange={(e) => setGrossSalary(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full sm:w-auto">Calculate</Button>
        </form>

        {result && (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-muted-foreground">Salary Breakdown</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Gross Monthly Salary</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(result.grossMonthly)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6 text-muted-foreground">SSS Contribution</TableCell>
                  <TableCell className="text-right text-orange-600 dark:text-orange-400">
                    -{formatCurrency(result.sss)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6 text-muted-foreground">PhilHealth Contribution</TableCell>
                  <TableCell className="text-right text-orange-600 dark:text-orange-400">
                    -{formatCurrency(result.philHealth)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6 text-muted-foreground">Pag-IBIG Contribution</TableCell>
                  <TableCell className="text-right text-orange-600 dark:text-orange-400">
                    -{formatCurrency(result.pagIbig)}
                  </TableCell>
                </TableRow>
                <TableRow className="border-t-2">
                  <TableCell className="font-medium">Total Contributions</TableCell>
                  <TableCell className="text-right font-medium text-orange-600 dark:text-orange-400">
                    -{formatCurrency(result.totalContributions)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Taxable Income</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(result.taxableIncome)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Withholding Tax</TableCell>
                  <TableCell className="text-right font-medium text-red-600 dark:text-red-400">
                    -{formatCurrency(result.withholdingTax)}
                  </TableCell>
                </TableRow>
                <TableRow className="border-t-2 bg-primary/5">
                  <TableCell className="font-bold text-primary">Net Take-Home Pay</TableCell>
                  <TableCell className="text-right text-xl font-bold text-primary">
                    {formatCurrency(result.netTakeHome)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
