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
import { calculateSSSLoan, type SSSLoanResult } from "@/lib/calculators";
import { formatCurrency } from "@/lib/client";

export default function SSSLoanCalculator() {
  const [loanAmount, setLoanAmount] = useState("");
  const [annualRate, setAnnualRate] = useState("10");
  const [termMonths, setTermMonths] = useState("24");
  const [result, setResult] = useState<SSSLoanResult | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(loanAmount);
    const rate = parseFloat(annualRate) / 100;
    const term = parseInt(termMonths, 10);

    if (isNaN(amount) || isNaN(rate) || isNaN(term)) return;

    const res = calculateSSSLoan(amount, rate, term);
    setResult(res);
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
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                required
                min="0"
                step="any"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sss-rate">Annual Rate (%)</Label>
              <Input
                id="sss-rate"
                type="number"
                placeholder="10"
                value={annualRate}
                onChange={(e) => setAnnualRate(e.target.value)}
                required
                min="0"
                step="any"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sss-term">Term (months)</Label>
              <Input
                id="sss-term"
                type="number"
                placeholder="24"
                value={termMonths}
                onChange={(e) => setTermMonths(e.target.value)}
                required
                min="1"
                step="1"
              />
            </div>
          </div>
          <Button type="submit">Calculate</Button>
        </form>

        {result && (
          <div className="mt-6">
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
