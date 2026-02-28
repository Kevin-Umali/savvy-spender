"use client";

import { useReducer } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UpdateIcon } from "@radix-ui/react-icons";
import { useToolCalculator } from "@/hooks/use-tool-calculator";
import type { RateConversionResult } from "@/lib/calculators";
import { formatPercent } from "@/lib/client";

interface FormState {
  flatRate: string;
  termMonths: string;
}

type FormAction =
  | { type: "SET_FIELD"; field: keyof FormState; value: string }
  | { type: "RESET" };

const initialState: FormState = {
  flatRate: "",
  termMonths: "",
};

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "RESET":
      return initialState;
  }
}

export default function InterestRateConverter() {
  const [form, dispatch] = useReducer(formReducer, initialState);
  const { data: result, isLoading, error, calculate } = useToolCalculator<RateConversionResult>("rate-converter");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const rate = parseFloat(form.flatRate);
    const months = parseInt(form.termMonths);
    if (isNaN(rate) || isNaN(months) || months <= 0) return;
    await calculate({ flatRateMonthly: rate / 100, months });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interest Rate Converter</CardTitle>
        <CardDescription>
          Convert flat monthly rates to effective interest rates (EIR) and factor rates.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="flat-rate" className="font-mono-label text-[10px] uppercase tracking-[0.15em]">Flat Monthly Rate (%)</Label>
              <Input
                id="flat-rate"
                type="number"
                step="0.01"
                min="0"
                max="100"
                placeholder="e.g. 0.99"
                value={form.flatRate}
                onChange={(e) => dispatch({ type: "SET_FIELD", field: "flatRate", value: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">
                The monthly add-on rate advertised by the bank (e.g. 0.99% or 1.5%).
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="term-months" className="font-mono-label text-[10px] uppercase tracking-[0.15em]">Term (Months)</Label>
              <Input
                id="term-months"
                type="number"
                step="1"
                min="1"
                max="360"
                placeholder="e.g. 12"
                value={form.termMonths}
                onChange={(e) => dispatch({ type: "SET_FIELD", field: "termMonths", value: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">
                Number of monthly installments for the loan.
              </p>
            </div>
          </div>
          <Button type="submit" className="w-full sm:w-auto font-mono-label uppercase tracking-[0.1em]" disabled={isLoading}>
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
          <div className="space-y-4" aria-label="Conversion results">
            <h4 className="text-sm font-semibold text-muted-foreground">Conversion Results</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="rounded-lg border p-3">
                <Label className="font-mono-label text-[10px] uppercase tracking-[0.15em] text-xs text-muted-foreground">Flat Rate (Monthly)</Label>
                <p className="text-lg font-semibold">{formatPercent(result.flatRateMonthly.toFixed(2))}</p>
              </div>
              <div className="rounded-lg border p-3">
                <Label className="font-mono-label text-[10px] uppercase tracking-[0.15em] text-xs text-muted-foreground">Flat Rate (Annual)</Label>
                <p className="text-lg font-semibold">{formatPercent(result.flatRateAnnual.toFixed(2))}</p>
              </div>
              <div className="rounded-lg border p-3">
                <Label className="font-mono-label text-[10px] uppercase tracking-[0.15em] text-xs text-muted-foreground">Total Interest %</Label>
                <p className="text-lg font-semibold">{formatPercent(result.totalInterestPercent.toFixed(2))}</p>
              </div>
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
                <Label className="font-mono-label text-[10px] uppercase tracking-[0.15em] text-xs text-muted-foreground">EIR (Monthly)</Label>
                <p className="text-lg font-bold text-primary">{formatPercent(result.eirMonthly.toFixed(4))}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Effective Interest Rate per month, accounting for diminishing principal.
                </p>
              </div>
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
                <Label className="font-mono-label text-[10px] uppercase tracking-[0.15em] text-xs text-muted-foreground">EIR (Annual)</Label>
                <p className="text-lg font-bold text-primary">{formatPercent(result.eirAnnual.toFixed(2))}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  The true annual cost of the loan, comparable across products.
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <Label className="font-mono-label text-[10px] uppercase tracking-[0.15em] text-xs text-muted-foreground">Factor Rate</Label>
                <p className="text-lg font-semibold">{result.factorRate.toFixed(6)}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
