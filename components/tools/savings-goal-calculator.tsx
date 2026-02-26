"use client";

import { useReducer, useCallback } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
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
import type { SavingsGoalResult } from "@/lib/calculators";
import { formatCurrency } from "@/lib/client";

interface FormState {
  targetAmount: string;
  months: string;
  annualRate: string;
}

type FormAction =
  | { type: "SET_FIELD"; field: keyof FormState; value: string }
  | { type: "RESET" };

const initialState: FormState = {
  targetAmount: "",
  months: "",
  annualRate: "0",
};

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "RESET":
      return initialState;
  }
}

export default function SavingsGoalCalculator() {
  const [form, dispatch] = useReducer(formReducer, initialState);
  const {
    data: results,
    isLoading,
    error,
    calculate,
  } = useToolCalculator<SavingsGoalResult>("savings-goal");

  const handleCalculate = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const target = parseFloat(form.targetAmount);
      const m = parseInt(form.months);
      const rate = parseFloat(form.annualRate) || 0;

      if (isNaN(target) || isNaN(m) || target <= 0 || m <= 0) return;

      await calculate({
        targetAmount: target,
        months: m,
        annualRate: rate / 100,
      });
    },
    [form, calculate]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Savings Goal Calculator</CardTitle>
        <CardDescription>
          Find out how much you need to save each month to reach your financial
          goal.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCalculate} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="sg-target">Target Amount</Label>
              <Input
                id="sg-target"
                type="number"
                placeholder="e.g. 100000"
                value={form.targetAmount}
                onChange={(e) =>
                  dispatch({
                    type: "SET_FIELD",
                    field: "targetAmount",
                    value: e.target.value,
                  })
                }
                required
                min="0.01"
                step="0.01"
              />
              <p className="text-xs text-muted-foreground">
                Your financial goal amount
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sg-months">Months to Reach Goal</Label>
              <Input
                id="sg-months"
                type="number"
                placeholder="e.g. 24"
                value={form.months}
                onChange={(e) =>
                  dispatch({
                    type: "SET_FIELD",
                    field: "months",
                    value: e.target.value,
                  })
                }
                required
                min="1"
                max="600"
                step="1"
              />
              <p className="text-xs text-muted-foreground">
                Number of months to reach your goal
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sg-rate">Annual Interest Rate (%)</Label>
              <Input
                id="sg-rate"
                type="number"
                placeholder="e.g. 4"
                value={form.annualRate}
                onChange={(e) =>
                  dispatch({
                    type: "SET_FIELD",
                    field: "annualRate",
                    value: e.target.value,
                  })
                }
                min="0"
                max="100"
                step="0.01"
              />
              <p className="text-xs text-muted-foreground">
                Expected annual return on savings (e.g., high-yield savings or
                money market)
              </p>
            </div>
          </div>

          <Button type="submit" disabled={isLoading}>
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
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {results && (
          <div className="mt-6 space-y-4" aria-label="Savings goal results">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-md border p-3">
                <p className="text-sm text-muted-foreground">
                  Monthly Deposit Needed
                </p>
                <p className="text-lg font-semibold">
                  {formatCurrency(results.monthlyDeposit)}
                </p>
              </div>
              <div className="rounded-md border p-3">
                <p className="text-sm text-muted-foreground">
                  Total Deposited
                </p>
                <p className="text-lg font-semibold">
                  {formatCurrency(results.totalDeposited)}
                </p>
              </div>
              <div className="rounded-md border p-3">
                <p className="text-sm text-muted-foreground">
                  Interest Earned
                </p>
                <p className="text-lg font-semibold">
                  {formatCurrency(results.totalInterestEarned)}
                </p>
              </div>
            </div>

            {results.milestones.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium">Milestones</p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Milestone</TableHead>
                      <TableHead>Month</TableHead>
                      <TableHead>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.milestones.map((m) => (
                      <TableRow key={m.percent}>
                        <TableCell>{m.percent}%</TableCell>
                        <TableCell>Month {m.month}</TableCell>
                        <TableCell>{formatCurrency(m.amount)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
