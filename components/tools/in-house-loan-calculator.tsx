"use client";

import { useState } from "react";
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
  calculateInHouseLoan,
  type InHouseLoanResult,
} from "@/lib/calculators";
import { formatCurrency, formatPercent } from "@/lib/client";

export default function InHouseLoanCalculator() {
  const [totalPrice, setTotalPrice] = useState("");
  const [downPaymentPercent, setDownPaymentPercent] = useState("");
  const [monthlyRate, setMonthlyRate] = useState("");
  const [termMonths, setTermMonths] = useState("");
  const [balloonPayment, setBalloonPayment] = useState("");
  const [result, setResult] = useState<InHouseLoanResult | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(totalPrice);
    const dp = parseFloat(downPaymentPercent);
    const rate = parseFloat(monthlyRate) / 100;
    const term = parseInt(termMonths, 10);
    const balloon = balloonPayment ? parseFloat(balloonPayment) : 0;

    if (isNaN(price) || isNaN(dp) || isNaN(rate) || isNaN(term)) return;

    const res = calculateInHouseLoan(price, dp, rate, term, balloon);
    setResult(res);
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
              <Label htmlFor="ih-price">Total Price</Label>
              <Input
                id="ih-price"
                type="number"
                placeholder="e.g. 2000000"
                value={totalPrice}
                onChange={(e) => setTotalPrice(e.target.value)}
                required
                min="0"
                step="any"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ih-dp">Down Payment (%)</Label>
              <Input
                id="ih-dp"
                type="number"
                placeholder="e.g. 20"
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(e.target.value)}
                required
                min="0"
                max="100"
                step="any"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ih-rate">Monthly Rate (%)</Label>
              <Input
                id="ih-rate"
                type="number"
                placeholder="e.g. 1.25"
                value={monthlyRate}
                onChange={(e) => setMonthlyRate(e.target.value)}
                required
                min="0"
                step="any"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ih-term">Term (months)</Label>
              <Input
                id="ih-term"
                type="number"
                placeholder="e.g. 60"
                value={termMonths}
                onChange={(e) => setTermMonths(e.target.value)}
                required
                min="1"
                step="1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ih-balloon">Balloon Payment (optional)</Label>
              <Input
                id="ih-balloon"
                type="number"
                placeholder="e.g. 100000"
                value={balloonPayment}
                onChange={(e) => setBalloonPayment(e.target.value)}
                min="0"
                step="any"
              />
            </div>
          </div>
          <Button type="submit">Calculate</Button>
        </form>

        {result && (
          <div className="mt-6">
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
                        Down Payment ({formatPercent(parseFloat(downPaymentPercent))})
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
