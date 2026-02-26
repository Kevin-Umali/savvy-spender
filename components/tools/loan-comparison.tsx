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
import { Badge } from "@/components/ui/badge";
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
import type { LoanComparisonResult } from "@/lib/calculators";
import { formatCurrency } from "@/lib/client";

const TERM_OPTIONS = [3, 6, 9, 12, 18, 24, 36];

interface FormState {
  loanAmount: string;
  bankAName: string;
  bankARate: string;
  bankAFee: string;
  bankBName: string;
  bankBRate: string;
  bankBFee: string;
}

type FormAction =
  | { type: "SET_FIELD"; field: keyof FormState; value: string }
  | { type: "RESET" };

const initialState: FormState = {
  loanAmount: "",
  bankAName: "",
  bankARate: "",
  bankAFee: "",
  bankBName: "",
  bankBRate: "",
  bankBFee: "",
};

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "RESET":
      return initialState;
  }
}

export default function LoanComparison() {
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
  } = useToolCalculator<LoanComparisonResult[]>("loan-comparison");

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    const principal = parseFloat(form.loanAmount);
    const rateA = parseFloat(form.bankARate) / 100;
    const feeA = parseFloat(form.bankAFee) || 0;
    const rateB = parseFloat(form.bankBRate) / 100;
    const feeB = parseFloat(form.bankBFee) || 0;

    if (isNaN(principal) || isNaN(rateA) || isNaN(rateB)) return;

    await calculate({
      principal,
      offerA: {
        name: form.bankAName || "Bank A",
        rate: rateA,
        processingFee: feeA,
      },
      offerB: {
        name: form.bankBName || "Bank B",
        rate: rateB,
        processingFee: feeB,
      },
      months: TERM_OPTIONS,
    });
  };

  const nameA = form.bankAName || "Bank A";
  const nameB = form.bankBName || "Bank B";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Loan Comparison</CardTitle>
        <CardDescription>
          Compare two bank loan offers side by side across different terms.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCalculate} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="lc-amount">Loan Amount</Label>
            <Input
              id="lc-amount"
              type="number"
              placeholder="e.g. 100000"
              value={form.loanAmount}
              onChange={(e) => setField("loanAmount", e.target.value)}
              required
              min={0}
              step={0.01}
            />
            <p className="text-xs text-muted-foreground">
              The total loan principal you want to borrow
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-3 rounded-lg border p-4">
              <h4 className="font-medium">Bank A</h4>
              <div className="space-y-2">
                <Label htmlFor="lc-a-name">Name</Label>
                <Input
                  id="lc-a-name"
                  type="text"
                  placeholder="e.g. BDO"
                  value={form.bankAName}
                  onChange={(e) => setField("bankAName", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Label for the first bank offer
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lc-a-rate">Monthly Rate (%)</Label>
                <Input
                  id="lc-a-rate"
                  type="number"
                  placeholder="e.g. 1.5"
                  value={form.bankARate}
                  onChange={(e) => setField("bankARate", e.target.value)}
                  required
                  min={0}
                  max={100}
                  step={0.01}
                />
                <p className="text-xs text-muted-foreground">
                  Monthly add-on interest rate offered by this bank
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lc-a-fee">Processing Fee</Label>
                <Input
                  id="lc-a-fee"
                  type="number"
                  placeholder="e.g. 500"
                  value={form.bankAFee}
                  onChange={(e) => setField("bankAFee", e.target.value)}
                  min={0}
                  step={0.01}
                />
                <p className="text-xs text-muted-foreground">
                  One-time processing fee charged by this bank
                </p>
              </div>
            </div>

            <div className="space-y-3 rounded-lg border p-4">
              <h4 className="font-medium">Bank B</h4>
              <div className="space-y-2">
                <Label htmlFor="lc-b-name">Name</Label>
                <Input
                  id="lc-b-name"
                  type="text"
                  placeholder="e.g. BPI"
                  value={form.bankBName}
                  onChange={(e) => setField("bankBName", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Label for the second bank offer
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lc-b-rate">Monthly Rate (%)</Label>
                <Input
                  id="lc-b-rate"
                  type="number"
                  placeholder="e.g. 1.2"
                  value={form.bankBRate}
                  onChange={(e) => setField("bankBRate", e.target.value)}
                  required
                  min={0}
                  max={100}
                  step={0.01}
                />
                <p className="text-xs text-muted-foreground">
                  Monthly add-on interest rate offered by this bank
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lc-b-fee">Processing Fee</Label>
                <Input
                  id="lc-b-fee"
                  type="number"
                  placeholder="e.g. 1000"
                  value={form.bankBFee}
                  onChange={(e) => setField("bankBFee", e.target.value)}
                  min={0}
                  step={0.01}
                />
                <p className="text-xs text-muted-foreground">
                  One-time processing fee charged by this bank
                </p>
              </div>
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
          <div className="mt-6" role="region" aria-label="Loan comparison results">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Months</TableHead>
                  <TableHead>{nameA} Monthly</TableHead>
                  <TableHead>{nameA} Total</TableHead>
                  <TableHead>{nameB} Monthly</TableHead>
                  <TableHead>{nameB} Total</TableHead>
                  <TableHead>Savings</TableHead>
                  <TableHead>Winner</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((row) => (
                  <TableRow key={row.months}>
                    <TableCell>{row.months}</TableCell>
                    <TableCell>
                      {formatCurrency(row.offerA.monthlyPayment)}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(row.offerA.totalPayment)}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(row.offerB.monthlyPayment)}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(row.offerB.totalPayment)}
                    </TableCell>
                    <TableCell>{formatCurrency(row.savings)}</TableCell>
                    <TableCell>
                      {row.winner === "tie" ? (
                        <Badge variant="secondary">Tie</Badge>
                      ) : (
                        <Badge>
                          {row.winner === "A" ? nameA : nameB}
                        </Badge>
                      )}
                    </TableCell>
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
