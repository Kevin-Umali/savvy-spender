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
import type { PagIBIGLoanResult } from "@/lib/calculators";
import { formatCurrency, formatPercent } from "@/lib/client";

interface FormState {
  loanAmount: string;
  termYears: string;
}

type FormAction =
  | { type: "SET_FIELD"; field: keyof FormState; value: string }
  | { type: "RESET" };

const initialState: FormState = {
  loanAmount: "",
  termYears: "30",
};

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "RESET":
      return initialState;
  }
}

export default function PagIBIGLoanCalculator() {
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
  } = useToolCalculator<PagIBIGLoanResult>("pagibig-loan");

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(form.loanAmount);
    const years = parseInt(form.termYears, 10);

    if (isNaN(amount) || isNaN(years)) return;

    await calculate({
      loanAmount: amount,
      termYears: years,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pag-IBIG Loan Calculator</CardTitle>
        <CardDescription>
          Estimate your Pag-IBIG housing loan monthly amortization, total
          payment, and insurance costs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCalculate} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="pag-amount" className="font-mono-label text-[10px] uppercase tracking-[0.15em]">Loan Amount</Label>
              <Input
                id="pag-amount"
                type="number"
                placeholder="e.g. 1000000"
                value={form.loanAmount}
                onChange={(e) => setField("loanAmount", e.target.value)}
                required
                min={0}
                step={0.01}
              />
              <p className="text-xs text-muted-foreground">
                Total Pag-IBIG housing loan amount you wish to borrow
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pag-term" className="font-mono-label text-[10px] uppercase tracking-[0.15em]">Term (years)</Label>
              <Input
                id="pag-term"
                type="number"
                placeholder="30"
                value={form.termYears}
                onChange={(e) => setField("termYears", e.target.value)}
                required
                min={1}
                max={30}
                step={1}
              />
              <p className="text-xs text-muted-foreground">
                Loan repayment period in years (max 30 years)
              </p>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={isLoading} className="font-mono-label uppercase tracking-[0.1em]">
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
          <div className="mt-6" role="region" aria-label="Pag-IBIG loan results">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Pag-IBIG Loan Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Loan Amount
                      </span>
                      <span className="font-medium">
                        {formatCurrency(result.loanAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Term
                      </span>
                      <span className="font-medium">
                        {result.term / 12} years ({result.term} months)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Interest Rate
                      </span>
                      <span className="font-medium">
                        {formatPercent(result.annualRate * 100)} per year
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-3">
                      <span className="text-muted-foreground">
                        Monthly Amortization
                      </span>
                      <span className="font-medium text-lg">
                        {formatCurrency(result.monthlyAmortization)}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm">
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
                    <div className="flex justify-between border-t pt-3">
                      <span className="text-muted-foreground">
                        MRI (annual)
                      </span>
                      <span className="font-medium">
                        {formatCurrency(result.mri)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Mortgage Redemption Insurance — protects the lender if borrower passes away
                    </p>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Fire Insurance (annual)
                      </span>
                      <span className="font-medium">
                        {formatCurrency(result.fireInsurance)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Required annual coverage for the property
                    </p>
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
