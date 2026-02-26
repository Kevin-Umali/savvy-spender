"use client";

import { useReducer } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UpdateIcon } from "@radix-ui/react-icons";
import { useToolCalculator } from "@/hooks/use-tool-calculator";
import type { SalaryBreakdown } from "@/lib/calculators";
import { formatCurrency } from "@/lib/client";
import SalaryDonutChart from "@/components/charts/salary-donut-chart";

interface FormState {
  grossSalary: string;
}

type FormAction =
  | { type: "SET_FIELD"; field: keyof FormState; value: string }
  | { type: "RESET" };

const initialState: FormState = {
  grossSalary: "",
};

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "RESET":
      return initialState;
  }
}

export default function SalaryCalculator() {
  const [form, dispatch] = useReducer(formReducer, initialState);
  const { data: result, isLoading, error, calculate } = useToolCalculator<SalaryBreakdown>("salary");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const salary = parseFloat(form.grossSalary);
    if (isNaN(salary) || salary <= 0) return;
    await calculate({ grossMonthly: salary });
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
              value={form.grossSalary}
              onChange={(e) => dispatch({ type: "SET_FIELD", field: "grossSalary", value: e.target.value })}
              required
            />
            <p className="text-xs text-muted-foreground">
              Based on 2024 PH contribution tables and TRAIN law tax brackets.
            </p>
          </div>
          <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
            {isLoading ? (
              <>
                <UpdateIcon className="mr-2 h-4 w-4 animate-spin" />
                Calculating...
              </>
            ) : (
              "Calculate"
            )}
          </Button>
        </form>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <div className="space-y-6" aria-label="Salary breakdown results">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-lg border p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Gross Salary</p>
                <p className="text-lg font-bold">{formatCurrency(result.grossMonthly)}</p>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Total Deductions</p>
                <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                  -{formatCurrency(result.totalContributions + result.withholdingTax)}
                </p>
              </div>
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Net Take-Home</p>
                <p className="text-xl font-bold text-primary">{formatCurrency(result.netTakeHome)}</p>
              </div>
            </div>

            {/* Chart */}
            <div className="rounded-lg border p-4">
              <h4 className="text-sm font-semibold mb-2">Where Your Salary Goes</h4>
              <SalaryDonutChart data={result} />
            </div>

            {/* Detailed Table */}
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground mb-3">Detailed Breakdown</h4>
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
          </div>
        )}
      </CardContent>
    </Card>
  );
}
