"use client";

import { useReducer } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UpdateIcon } from "@radix-ui/react-icons";
import { useToolCalculator } from "@/hooks/use-tool-calculator";
import type { CreditCardPayoffResult } from "@/lib/calculators";
import { formatCurrency } from "@/lib/client";

interface FormState {
  balance: string;
  annualRate: string;
  minPaymentPercent: string;
  minFloor: string;
  fixedPayment: string;
}

type FormAction =
  | { type: "SET_FIELD"; field: keyof FormState; value: string }
  | { type: "RESET" };

const initialState: FormState = {
  balance: "",
  annualRate: "",
  minPaymentPercent: "3",
  minFloor: "500",
  fixedPayment: "",
};

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "RESET":
      return initialState;
  }
}

export default function CreditCardPayoff() {
  const [form, dispatch] = useReducer(formReducer, initialState);
  const { data: result, isLoading, error, calculate } = useToolCalculator<CreditCardPayoffResult>("credit-card-payoff");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const bal = parseFloat(form.balance);
    const rate = parseFloat(form.annualRate);
    const minPct = parseFloat(form.minPaymentPercent);
    const floor = parseFloat(form.minFloor);
    const fixed = parseFloat(form.fixedPayment);
    if (isNaN(bal) || isNaN(rate) || bal <= 0) return;
    await calculate({
      balance: bal,
      annualRate: rate / 100,
      minimumPaymentPercent: (isNaN(minPct) ? 3 : minPct) / 100,
      minimumPaymentFloor: isNaN(floor) ? 500 : floor,
      fixedPayment: isNaN(fixed) ? 0 : fixed,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Credit Card Payoff Calculator</CardTitle>
        <CardDescription>
          Compare minimum payments vs fixed monthly payments and see how much you can save.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cc-balance" className="font-mono-label text-[10px] uppercase tracking-[0.15em]">Outstanding Balance</Label>
              <Input
                id="cc-balance"
                type="number"
                step="0.01"
                min="1"
                placeholder="e.g. 50000"
                value={form.balance}
                onChange={(e) => dispatch({ type: "SET_FIELD", field: "balance", value: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">
                Your current outstanding credit card balance.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cc-annual-rate" className="font-mono-label text-[10px] uppercase tracking-[0.15em]">Annual Interest Rate (%)</Label>
              <Input
                id="cc-annual-rate"
                type="number"
                step="0.01"
                min="0"
                max="100"
                placeholder="e.g. 24"
                value={form.annualRate}
                onChange={(e) => dispatch({ type: "SET_FIELD", field: "annualRate", value: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">
                The annual interest rate on your credit card (typically 24-36% in PH).
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cc-min-pct" className="font-mono-label text-[10px] uppercase tracking-[0.15em]">Minimum Payment (%)</Label>
              <Input
                id="cc-min-pct"
                type="number"
                step="0.1"
                min="0"
                max="100"
                placeholder="3"
                value={form.minPaymentPercent}
                onChange={(e) => dispatch({ type: "SET_FIELD", field: "minPaymentPercent", value: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Percentage of outstanding balance as minimum payment (typically 3%).
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cc-min-floor" className="font-mono-label text-[10px] uppercase tracking-[0.15em]">Minimum Floor Amount</Label>
              <Input
                id="cc-min-floor"
                type="number"
                step="1"
                min="0"
                placeholder="500"
                value={form.minFloor}
                onChange={(e) => dispatch({ type: "SET_FIELD", field: "minFloor", value: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Minimum payment floor amount (typically &#8369;500). You pay at least this much even if the percentage is lower.
              </p>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="cc-fixed" className="font-mono-label text-[10px] uppercase tracking-[0.15em]">Fixed Monthly Payment</Label>
              <Input
                id="cc-fixed"
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g. 5000"
                value={form.fixedPayment}
                onChange={(e) => dispatch({ type: "SET_FIELD", field: "fixedPayment", value: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                A fixed amount you plan to pay monthly to pay off faster. Leave blank to auto-calculate as 2x the minimum.
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
          <div className="space-y-4" aria-label="Payoff comparison results">
            <h4 className="text-sm font-semibold text-muted-foreground">Payoff Comparison</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Minimum Payment */}
              <div className="rounded-lg border p-4 space-y-3">
                <h5 className="font-semibold text-sm">Minimum Payments</h5>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Months to Payoff</span>
                    <span className="font-medium">{result.minimumPaymentMonths}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Paid</span>
                    <span className="font-medium">{formatCurrency(result.minimumPaymentTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Interest</span>
                    <span className="font-medium text-orange-600 dark:text-orange-400">
                      {formatCurrency(result.minimumPaymentInterest)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Fixed Payment */}
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-3">
                <h5 className="font-semibold text-sm">Fixed Payments</h5>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Months to Payoff</span>
                    <span className="font-medium">{result.fixedPaymentMonths}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Paid</span>
                    <span className="font-medium">{formatCurrency(result.fixedPaymentTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Interest</span>
                    <span className="font-medium text-orange-600 dark:text-orange-400">
                      {formatCurrency(result.fixedPaymentInterest)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Savings highlight */}
            {result.interestSaved > 0 && (
              <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-center">
                <p className="text-sm text-muted-foreground">By using fixed payments, you save</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(result.interestSaved)}
                </p>
                <p className="text-sm text-muted-foreground">
                  in interest and pay off {result.timeSaved} months sooner
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
