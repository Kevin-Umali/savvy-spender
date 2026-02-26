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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  calculateAffordability,
  type AffordabilityResult,
} from "@/lib/calculators";
import { formatCurrency } from "@/lib/client";

const TERM_OPTIONS = [3, 6, 9, 12, 18, 24, 36];

export default function AffordabilityCalculator() {
  const [monthlyBudget, setMonthlyBudget] = useState("");
  const [monthlyRate, setMonthlyRate] = useState("");
  const [processingFee, setProcessingFee] = useState("");
  const [results, setResults] = useState<AffordabilityResult[] | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const budget = parseFloat(monthlyBudget);
    const rate = parseFloat(monthlyRate) / 100;
    const fee = processingFee ? parseFloat(processingFee) : 0;

    if (isNaN(budget) || isNaN(rate)) return;

    const rows = TERM_OPTIONS.map((months) =>
      calculateAffordability(budget, rate, months, fee)
    );
    setResults(rows);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Affordability Calculator</CardTitle>
        <CardDescription>
          Find out the maximum loan amount you can afford based on your monthly
          budget.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCalculate} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="aff-budget">Monthly Budget</Label>
              <Input
                id="aff-budget"
                type="number"
                placeholder="e.g. 5000"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(e.target.value)}
                required
                min="0"
                step="any"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aff-rate">Monthly Interest Rate (%)</Label>
              <Input
                id="aff-rate"
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
              <Label htmlFor="aff-fee">Processing Fee (optional)</Label>
              <Input
                id="aff-fee"
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

        {results && (
          <div className="mt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Months</TableHead>
                  <TableHead>Max Affordable Principal</TableHead>
                  <TableHead>Monthly Payment</TableHead>
                  <TableHead>Total Payment</TableHead>
                  <TableHead>Total Interest</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((row) => (
                  <TableRow key={row.months}>
                    <TableCell>{row.months}</TableCell>
                    <TableCell>{formatCurrency(row.maxPrincipal)}</TableCell>
                    <TableCell>{formatCurrency(row.monthlyPayment)}</TableCell>
                    <TableCell>{formatCurrency(row.totalPayment)}</TableCell>
                    <TableCell>{formatCurrency(row.totalInterest)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
