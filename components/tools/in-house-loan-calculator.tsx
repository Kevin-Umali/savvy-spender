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
import type { InHouseLoanResult } from "@/lib/calculators";
import { formatCurrency, formatPercent } from "@/lib/client";

interface FormState {
  totalPrice: string;
  downPaymentPercent: string;
  monthlyRate: string;
  termMonths: string;
  balloonPayment: string;
}

type FormAction =
  | { type: "SET_FIELD"; field: keyof FormState; value: string }
  | { type: "RESET" };

const initialState: FormState = {
  totalPrice: "",
  downPaymentPercent: "",
  monthlyRate: "",
  termMonths: "",
  balloonPayment: "",
};

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "RESET":
      return initialState;
  }
}

export default function InHouseLoanCalculator() {
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
  } = useToolCalculator<InHouseLoanResult>("in-house-loan");

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(form.totalPrice);
    const dp = parseFloat(form.downPaymentPercent);
    const rate = parseFloat(form.monthlyRate) / 100;
    const term = parseInt(form.termMonths, 10);
    const balloon = form.balloonPayment ? parseFloat(form.balloonPayment) : 0;

    if (isNaN(price) || isNaN(dp) || isNaN(rate) || isNaN(term)) return;

    await calculate({
      totalPrice: price,
      downPaymentPercent: dp,
      monthlyRate: rate,
      months: term,
      balloonPayment: balloon,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>In-House Loan Calculator</CardTitle>
        <CardDescription>
          Calculate monthly payments for in-house financing with down payment and
          optional balloon payment.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCalculate} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label className="font-mono-label text-[10px] uppercase tracking-[0.15em]" htmlFor="ih-price">Total Price</Label>
              <Input
                id="ih-price"
                type="number"
                placeholder="e.g. 2000000"
                value={form.totalPrice}
                onChange={(e) => setField("totalPrice", e.target.value)}
                required
                min={0}
                step={0.01}
              />
              <p className="text-xs text-muted-foreground">
                Full purchase price of the property or item
              </p>
            </div>
            <div className="space-y-2">
              <Label className="font-mono-label text-[10px] uppercase tracking-[0.15em]" htmlFor="ih-dp">Down Payment (%)</Label>
              <Input
                id="ih-dp"
                type="number"
                placeholder="e.g. 20"
                value={form.downPaymentPercent}
                onChange={(e) => setField("downPaymentPercent", e.target.value)}
                required
                min={0}
                max={100}
                step={0.01}
              />
              <p className="text-xs text-muted-foreground">
                Percentage of the total price paid upfront
              </p>
            </div>
            <div className="space-y-2">
              <Label className="font-mono-label text-[10px] uppercase tracking-[0.15em]" htmlFor="ih-rate">Monthly Rate (%)</Label>
              <Input
                id="ih-rate"
                type="number"
                placeholder="e.g. 1.25"
                value={form.monthlyRate}
                onChange={(e) => setField("monthlyRate", e.target.value)}
                required
                min={0}
                max={100}
                step={0.01}
              />
              <p className="text-xs text-muted-foreground">
                Monthly add-on (flat) interest rate charged by the developer
              </p>
            </div>
            <div className="space-y-2">
              <Label className="font-mono-label text-[10px] uppercase tracking-[0.15em]" htmlFor="ih-term">Term (months)</Label>
              <Input
                id="ih-term"
                type="number"
                placeholder="e.g. 60"
                value={form.termMonths}
                onChange={(e) => setField("termMonths", e.target.value)}
                required
                min={1}
                max={360}
                step={1}
              />
              <p className="text-xs text-muted-foreground">
                Number of monthly installments
              </p>
            </div>
            <div className="space-y-2">
              <Label className="font-mono-label text-[10px] uppercase tracking-[0.15em]" htmlFor="ih-balloon">Balloon Payment (optional)</Label>
              <Input
                id="ih-balloon"
                type="number"
                placeholder="e.g. 100000"
                value={form.balloonPayment}
                onChange={(e) => setField("balloonPayment", e.target.value)}
                min={0}
                step={0.01}
              />
              <p className="text-xs text-muted-foreground">
                Optional lump-sum payment due at end of term
              </p>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="font-mono-label uppercase tracking-[0.1em]" disabled={isLoading}>
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
          <div className="mt-6" role="region" aria-label="In-house loan results">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Loan Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Total Price
                      </span>
                      <span className="font-medium">
                        {formatCurrency(result.totalPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Down Payment ({formatPercent(parseFloat(form.downPaymentPercent))})
                      </span>
                      <span className="font-medium">
                        {formatCurrency(result.downPayment)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Loan Amount
                      </span>
                      <span className="font-medium">
                        {formatCurrency(result.loanAmount)}
                      </span>
                    </div>
                    {result.balloonPayment > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Balloon Payment
                        </span>
                        <span className="font-medium">
                          {formatCurrency(result.balloonPayment)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Monthly Payment
                      </span>
                      <span className="font-medium text-lg">
                        {formatCurrency(result.monthlyPayment)}
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
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Total Cost
                      </span>
                      <span className="font-medium">
                        {formatCurrency(result.totalPayment)}
                      </span>
                    </div>
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
