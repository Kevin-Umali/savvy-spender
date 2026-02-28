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
import type { EarlyPayoffResult } from "@/lib/calculators";
import { formatCurrency } from "@/lib/client";

interface FormState {
  principal: string;
  monthlyRate: string;
  originalTerm: string;
  extraPayment: string;
  processingFee: string;
}

type FormAction =
  | { type: "SET_FIELD"; field: keyof FormState; value: string }
  | { type: "RESET" };

const initialState: FormState = {
  principal: "",
  monthlyRate: "",
  originalTerm: "",
  extraPayment: "",
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

export default function EarlyPayoffCalculator() {
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
  } = useToolCalculator<EarlyPayoffResult>("early-payoff");

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseFloat(form.principal);
    const rate = parseFloat(form.monthlyRate) / 100;
    const term = parseInt(form.originalTerm, 10);
    const extra = parseFloat(form.extraPayment);
    const fee = form.processingFee ? parseFloat(form.processingFee) : 0;

    if (isNaN(p) || isNaN(rate) || isNaN(term) || isNaN(extra)) return;

    await calculate({
      principal: p,
      monthlyRate: rate,
      originalMonths: term,
      extraPayment: extra,
      processingFee: fee,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Early Payoff Calculator</CardTitle>
        <CardDescription>
          See how much time and money you can save by making extra monthly
          payments on your loan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCalculate} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label className="font-mono-label text-[10px] uppercase tracking-[0.15em]" htmlFor="ep-principal">Principal</Label>
              <Input
                id="ep-principal"
                type="number"
                placeholder="e.g. 100000"
                value={form.principal}
                onChange={(e) => setField("principal", e.target.value)}
                required
                min={0}
                step={0.01}
              />
              <p className="text-xs text-muted-foreground">
                Original loan amount before interest
              </p>
            </div>
            <div className="space-y-2">
              <Label className="font-mono-label text-[10px] uppercase tracking-[0.15em]" htmlFor="ep-rate">Monthly Rate (%)</Label>
              <Input
                id="ep-rate"
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
                Monthly add-on (flat) interest rate on the loan
              </p>
            </div>
            <div className="space-y-2">
              <Label className="font-mono-label text-[10px] uppercase tracking-[0.15em]" htmlFor="ep-term">Original Term (months)</Label>
              <Input
                id="ep-term"
                type="number"
                placeholder="e.g. 24"
                value={form.originalTerm}
                onChange={(e) => setField("originalTerm", e.target.value)}
                required
                min={1}
                max={360}
                step={1}
              />
              <p className="text-xs text-muted-foreground">
                Number of months in the original loan agreement
              </p>
            </div>
            <div className="space-y-2">
              <Label className="font-mono-label text-[10px] uppercase tracking-[0.15em]" htmlFor="ep-extra">Extra Monthly Payment</Label>
              <Input
                id="ep-extra"
                type="number"
                placeholder="e.g. 2000"
                value={form.extraPayment}
                onChange={(e) => setField("extraPayment", e.target.value)}
                required
                min={0}
                step={0.01}
              />
              <p className="text-xs text-muted-foreground">
                Additional amount you plan to pay each month on top of the
                regular installment
              </p>
            </div>
            <div className="space-y-2">
              <Label className="font-mono-label text-[10px] uppercase tracking-[0.15em]" htmlFor="ep-fee">Processing Fee (optional)</Label>
              <Input
                id="ep-fee"
                type="number"
                placeholder="e.g. 500"
                value={form.processingFee}
                onChange={(e) => setField("processingFee", e.target.value)}
                min={0}
                step={0.01}
              />
              <p className="text-xs text-muted-foreground">
                One-time fee included in the total loan cost
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
          <div
            className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            role="region"
            aria-label="Early payoff results"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Original Schedule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Term</span>
                  <span className="font-medium">
                    {result.originalMonths} months
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Interest</span>
                  <span className="font-medium">
                    {formatCurrency(result.originalTotalInterest)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Payment</span>
                  <span className="font-medium">
                    {formatCurrency(result.originalTotalPayment)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Accelerated Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Term</span>
                  <span className="font-medium">
                    {result.newMonths} months
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Interest</span>
                  <span className="font-medium">
                    {formatCurrency(result.newTotalInterest)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Payment</span>
                  <span className="font-medium">
                    {formatCurrency(result.newTotalPayment)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">You Save</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Months Saved</span>
                  <span className="font-medium text-green-600">
                    {result.monthsSaved} months
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Interest Saved</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(result.interestSaved)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
