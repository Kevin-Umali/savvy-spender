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
  calculateSavingsGoal,
  type SavingsGoalResult,
} from "@/lib/calculators";
import { formatCurrency } from "@/lib/client";

export default function SavingsGoalCalculator() {
  const [targetAmount, setTargetAmount] = useState("");
  const [months, setMonths] = useState("");
  const [annualRate, setAnnualRate] = useState("0");
  const [results, setResults] = useState<SavingsGoalResult | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(targetAmount);
    const m = parseInt(months);
    const rate = parseFloat(annualRate) || 0;

    if (isNaN(target) || isNaN(m) || target <= 0 || m <= 0) return;

    const result = calculateSavingsGoal(target, m, rate / 100);
    setResults(result);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Savings Goal Calculator</CardTitle>
        <CardDescription>
          Find out how much you need to save each month to reach your financial
          goal.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCalculate} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="sg-target">Target Amount</Label>
              <Input
                id="sg-target"
                type="number"
                placeholder="e.g. 100000"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                required
                min="0"
                step="any"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sg-months">Months to Reach Goal</Label>
              <Input
                id="sg-months"
                type="number"
                placeholder="e.g. 24"
                value={months}
                onChange={(e) => setMonths(e.target.value)}
                required
                min="1"
                step="1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sg-rate">Annual Interest Rate (%)</Label>
              <Input
                id="sg-rate"
                type="number"
                placeholder="e.g. 4"
                value={annualRate}
                onChange={(e) => setAnnualRate(e.target.value)}
                min="0"
                step="any"
              />
            </div>
          </div>
          <Button type="submit">Calculate</Button>
        </form>

        {results && (
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-md border p-3">
                <p className="text-sm text-muted-foreground">
                  Monthly Deposit Needed
                </p>
                <p className="text-lg font-semibold">
                  {formatCurrency(results.monthlyDeposit)}
                </p>
              </div>
              <div className="rounded-md border p-3">
                <p className="text-sm text-muted-foreground">
                  Total Deposited
                </p>
                <p className="text-lg font-semibold">
                  {formatCurrency(results.totalDeposited)}
                </p>
              </div>
              <div className="rounded-md border p-3">
                <p className="text-sm text-muted-foreground">
                  Interest Earned
                </p>
                <p className="text-lg font-semibold">
                  {formatCurrency(results.totalInterestEarned)}
                </p>
              </div>
            </div>

            {results.milestones.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium">Milestones</p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Milestone</TableHead>
                      <TableHead>Month</TableHead>
                      <TableHead>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.milestones.map((m) => (
                      <TableRow key={m.percent}>
                        <TableCell>{m.percent}%</TableCell>
                        <TableCell>Month {m.month}</TableCell>
                        <TableCell>{formatCurrency(m.amount)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
