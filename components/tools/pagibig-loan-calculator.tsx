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
  calculatePagIBIGLoan,
  type PagIBIGLoanResult,
} from "@/lib/calculators";
import { formatCurrency, formatPercent } from "@/lib/client";

export default function PagIBIGLoanCalculator() {
  const [loanAmount, setLoanAmount] = useState("");
  const [termYears, setTermYears] = useState("30");
  const [result, setResult] = useState<PagIBIGLoanResult | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(loanAmount);
    const years = parseInt(termYears, 10);

    if (isNaN(amount) || isNaN(years)) return;

    const res = calculatePagIBIGLoan(amount, years);
    setResult(res);
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
              <Label htmlFor="pag-amount">Loan Amount</Label>
              <Input
                id="pag-amount"
                type="number"
                placeholder="e.g. 1000000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                required
                min="0"
                step="any"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pag-term">Term (years)</Label>
              <Input
                id="pag-term"
                type="number"
                placeholder="30"
                value={termYears}
                onChange={(e) => setTermYears(e.target.value)}
                required
                min="1"
                max="30"
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
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Fire Insurance (annual)
                      </span>
                      <span className="font-medium">
                        {formatCurrency(result.fireInsurance)}
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
