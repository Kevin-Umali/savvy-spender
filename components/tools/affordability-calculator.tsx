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
import type { AffordabilityResult } from "@/lib/calculators";
import { formatCurrency } from "@/lib/client";

const TERM_OPTIONS = [3, 6, 9, 12, 18, 24, 36];

interface FormState {
  monthlyBudget: string;
  monthlyRate: string;
  processingFee: string;
}

type FormAction =
  | { type: "SET_FIELD"; field: keyof FormState; value: string }
  | { type: "RESET" };

const initialState: FormState = {
  monthlyBudget: "",
  monthlyRate: "",
  processingFee: "",
};

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "RESET":
      return initialState;
  }
}

export default function AffordabilityCalculator() {
  const [form, formDispatch] = useReducer(formReducer, initialState);
  const setField = useCallback(
    (field: keyof FormState, value: string) =>
      formDispatch({ type: "SET_FIELD", field, value }),
    []
  );

  const {
    data: results,
    isLoading,
    error,
    calculate,
  } = useToolCalculator<AffordabilityResult[]>("affordability");

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    const budget = parseFloat(form.monthlyBudget);
    const rate = parseFloat(form.monthlyRate) / 100;
    const fee = form.processingFee ? parseFloat(form.processingFee) : 0;

    if (isNaN(budget) || isNaN(rate)) return;

    await calculate({
      monthlyBudget: budget,
      monthlyRate: rate,
      months: TERM_OPTIONS,
      processingFee: fee || undefined,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Affordability Calculator</CardTitle>
        <CardDescription>
          Find out the maximum loan amount you can afford based on your monthly
          budget.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCalculate} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="aff-budget">Monthly Budget</Label>
              <Input
                id="aff-budget"
                type="number"
                placeholder="e.g. 5000"
                value={form.monthlyBudget}
                onChange={(e) => setField("monthlyBudget", e.target.value)}
                required
                min={0}
                step={0.01}
              />
              <p className="text-xs text-muted-foreground">
                The max you can pay each month toward installments
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="aff-rate">Monthly Interest Rate (%)</Label>
              <Input
                id="aff-rate"
                type="number"
                placeholder="e.g. 1.5"
                value={form.monthlyRate}
                onChange={(e) => setField("monthlyRate", e.target.value)}
                required
                min={0}
                max={100}
                step={0.01}
              />
              <p className="text-xs text-muted-foreground">
                Monthly add-on (flat) interest rate from the bank
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="aff-fee">Processing Fee (optional)</Label>
              <Input
                id="aff-fee"
                type="number"
                placeholder="e.g. 500"
                value={form.processingFee}
                onChange={(e) => setField("processingFee", e.target.value)}
                min={0}
                step={0.01}
              />
              <p className="text-xs text-muted-foreground">
                One-time fee deducted from loan proceeds
              </p>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

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

        {results && (
          <div className="mt-6" role="region" aria-label="Affordability results">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Months</TableHead>
                  <TableHead>Max Affordable Principal</TableHead>
                  <TableHead>Monthly Payment</TableHead>
                  <TableHead>Total Payment</TableHead>
                  <TableHead>Total Interest</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((row) => (
                  <TableRow key={row.months}>
                    <TableCell>{row.months}</TableCell>
                    <TableCell>{formatCurrency(row.maxPrincipal)}</TableCell>
                    <TableCell>{formatCurrency(row.monthlyPayment)}</TableCell>
                    <TableCell>{formatCurrency(row.totalPayment)}</TableCell>
                    <TableCell>{formatCurrency(row.totalInterest)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
