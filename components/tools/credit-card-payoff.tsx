"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { calculateCreditCardPayoff, type CreditCardPayoffResult } from "@/lib/calculators";
import { formatCurrency } from "@/lib/client";

export default function CreditCardPayoff() {
  const [balance, setBalance] = useState("");
  const [annualRate, setAnnualRate] = useState("");
  const [minPaymentPercent, setMinPaymentPercent] = useState("3");
  const [minFloor, setMinFloor] = useState("500");
  const [fixedPayment, setFixedPayment] = useState("");
  const [result, setResult] = useState<CreditCardPayoffResult | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bal = parseFloat(balance);
    const rate = parseFloat(annualRate);
    const minPct = parseFloat(minPaymentPercent);
    const floor = parseFloat(minFloor);
    const fixed = parseFloat(fixedPayment);
    if (isNaN(bal) || isNaN(rate) || bal <= 0) return;
    setResult(
      calculateCreditCardPayoff(
        bal,
        rate / 100,
        (isNaN(minPct) ? 3 : minPct) / 100,
        isNaN(floor) ? 500 : floor,
        isNaN(fixed) ? 0 : fixed
      )
    );
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
              <Label htmlFor="cc-balance">Outstanding Balance</Label>
              <Input
                id="cc-balance"
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g. 50000"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cc-annual-rate">Annual Interest Rate (%)</Label>
              <Input
                id="cc-annual-rate"
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g. 24"
                value={annualRate}
                onChange={(e) => setAnnualRate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cc-min-pct">Minimum Payment (%)</Label>
              <Input
                id="cc-min-pct"
                type="number"
                step="0.1"
                min="0"
                placeholder="3"
                value={minPaymentPercent}
                onChange={(e) => setMinPaymentPercent(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cc-min-floor">Minimum Floor Amount</Label>
              <Input
                id="cc-min-floor"
                type="number"
                step="0.01"
                min="0"
                placeholder="500"
                value={minFloor}
                onChange={(e) => setMinFloor(e.target.value)}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="cc-fixed">Fixed Monthly Payment</Label>
              <Input
                id="cc-fixed"
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g. 5000"
                value={fixedPayment}
                onChange={(e) => setFixedPayment(e.target.value)}
              />
            </div>
          </div>
          <Button type="submit" className="w-full sm:w-auto">Calculate</Button>
        </form>

        {result && (
          <div className="space-y-4">
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
