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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UpdateIcon } from "@radix-ui/react-icons";
import { useToolCalculator } from "@/hooks/use-tool-calculator";
import type { SSSLoanResult } from "@/lib/calculators";
import { formatCurrency } from "@/lib/client";

interface FormState {
  loanAmount: string;
  annualRate: string;
  termMonths: string;
}

type FormAction =
  | { type: "SET_FIELD"; field: keyof FormState; value: string }
  | { type: "RESET" };

const initialState: FormState = {
  loanAmount: "",
  annualRate: "10",
  termMonths: "24",
};

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "RESET":
      return initialState;
  }
}

export default function SSSLoanCalculator() {
  const [form, formDispatch] = useReducer(formReducer, initialState);
  const setField = useCallback(
    (field: keyof FormState, value: string) =>
      formDispatch({ type: "SET_FIELD", field, value }),
    []
  );

  const {
    data: result,
    isLoading,
    error,
    calculate,
  } = useToolCalculator<SSSLoanResult>("sss-loan");

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(form.loanAmount);
    const rate = parseFloat(form.annualRate) / 100;
    const term = parseInt(form.termMonths, 10);

    if (isNaN(amount) || isNaN(rate) || isNaN(term)) return;

    await calculate({
      loanAmount: amount,
      annualRate: rate,
      termMonths: term,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>SSS Loan Calculator</CardTitle>
        <CardDescription>
          Compute your SSS salary loan amortization, total payment, and total
          interest.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCalculate} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="sss-amount">Loan Amount</Label>
              <Input
                id="sss-amount"
                type="number"
                placeholder="e.g. 20000"
                value={form.loanAmount}
                onChange={(e) => setField("loanAmount", e.target.value)}
                required
                min={0}
                step={0.01}
              />
              <p className="text-xs text-muted-foreground">
                SSS salary loan amount (max depends on contributions)
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sss-rate">Annual Rate (%)</Label>
              <Input
                id="sss-rate"
                type="number"
                placeholder="10"
                value={form.annualRate}
                onChange={(e) => setField("annualRate", e.target.value)}
                required
                min={0}
                max={100}
                step={0.01}
              />
              <p className="text-xs text-muted-foreground">
                SSS charges 10% per annum on salary loans
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sss-term">Term (months)</Label>
              <Input
                id="sss-term"
                type="number"
                placeholder="24"
                value={form.termMonths}
                onChange={(e) => setField("termMonths", e.target.value)}
                required
                min={1}
                max={360}
                step={1}
              />
              <p className="text-xs text-muted-foreground">
                Standard SSS salary loan term is 24 months
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

        {result && (
          <div className="mt-6" role="region" aria-label="SSS loan results">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">SSS Loan Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Loan Amount</span>
                    <span className="font-medium">
                      {formatCurrency(result.loanAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Term
                    </span>
                    <span className="font-medium">{result.term} months</span>
                  </div>
                  <div className="flex justify-between border-t pt-3">
                    <span className="text-muted-foreground">
                      Monthly Amortization
                    </span>
                    <span className="font-medium text-lg">
                      {formatCurrency(result.monthlyAmortization)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Total Payment
                    </span>
                    <span className="font-medium">
                      {formatCurrency(result.totalPayment)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Total Interest
                    </span>
                    <span className="font-medium">
                      {formatCurrency(result.totalInterest)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
