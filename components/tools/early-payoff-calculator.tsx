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
  calculateEarlyPayoff,
  type EarlyPayoffResult,
} from "@/lib/calculators";
import { formatCurrency } from "@/lib/client";

export default function EarlyPayoffCalculator() {
  const [principal, setPrincipal] = useState("");
  const [monthlyRate, setMonthlyRate] = useState("");
  const [originalTerm, setOriginalTerm] = useState("");
  const [extraPayment, setExtraPayment] = useState("");
  const [processingFee, setProcessingFee] = useState("");
  const [result, setResult] = useState<EarlyPayoffResult | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseFloat(principal);
    const rate = parseFloat(monthlyRate) / 100;
    const term = parseInt(originalTerm, 10);
    const extra = parseFloat(extraPayment);
    const fee = processingFee ? parseFloat(processingFee) : 0;

    if (isNaN(p) || isNaN(rate) || isNaN(term) || isNaN(extra)) return;

    const res = calculateEarlyPayoff(p, rate, term, extra, fee);
    setResult(res);
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
              <Label htmlFor="ep-principal">Principal</Label>
              <Input
                id="ep-principal"
                type="number"
                placeholder="e.g. 100000"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                required
                min="0"
                step="any"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ep-rate">Monthly Rate (%)</Label>
              <Input
                id="ep-rate"
                type="number"
                placeholder="e.g. 1.5"
                value={monthlyRate}
                onChange={(e) => setMonthlyRate(e.target.value)}
                required
                min="0"
                step="any"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ep-term">Original Term (months)</Label>
              <Input
                id="ep-term"
                type="number"
                placeholder="e.g. 24"
                value={originalTerm}
                onChange={(e) => setOriginalTerm(e.target.value)}
                required
                min="1"
                step="1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ep-extra">Extra Monthly Payment</Label>
              <Input
                id="ep-extra"
                type="number"
                placeholder="e.g. 2000"
                value={extraPayment}
                onChange={(e) => setExtraPayment(e.target.value)}
                required
                min="0"
                step="any"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ep-fee">Processing Fee (optional)</Label>
              <Input
                id="ep-fee"
                type="number"
                placeholder="e.g. 500"
                value={processingFee}
                onChange={(e) => setProcessingFee(e.target.value)}
                min="0"
                step="any"
              />
            </div>
          </div>
          <Button type="submit">Calculate</Button>
        </form>

        {result && (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
