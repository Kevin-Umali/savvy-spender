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
  calculateEmergencyFund,
  type EmergencyFundResult,
} from "@/lib/calculators";
import { formatCurrency } from "@/lib/client";

export default function EmergencyFundCalculator() {
  const [monthlyExpenses, setMonthlyExpenses] = useState("");
  const [targetMonths, setTargetMonths] = useState("6");
  const [currentSavings, setCurrentSavings] = useState("");
  const [monthlySavingsCapacity, setMonthlySavingsCapacity] = useState("");
  const [results, setResults] = useState<EmergencyFundResult | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const expenses = parseFloat(monthlyExpenses);
    const months = parseInt(targetMonths) || 6;
    const savings = parseFloat(currentSavings) || 0;
    const capacity = parseFloat(monthlySavingsCapacity) || 0;

    if (isNaN(expenses) || expenses <= 0) return;

    const result = calculateEmergencyFund(expenses, months, savings, capacity);
    setResults(result);
  };

  const progressPercent = results
    ? Math.min(
        100,
        results.targetAmount > 0
          ? (results.currentSavings / results.targetAmount) * 100
          : 0
      )
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Emergency Fund Calculator</CardTitle>
        <CardDescription>
          Calculate how much you need in your emergency fund and how long it will
          take to build it.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCalculate} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="ef-expenses">Monthly Expenses</Label>
              <Input
                id="ef-expenses"
                type="number"
                placeholder="e.g. 30000"
                value={monthlyExpenses}
                onChange={(e) => setMonthlyExpenses(e.target.value)}
                required
                min="0"
                step="any"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ef-months">Target Months of Coverage</Label>
              <Input
                id="ef-months"
                type="number"
                placeholder="e.g. 6"
                value={targetMonths}
                onChange={(e) => setTargetMonths(e.target.value)}
                min="1"
                step="1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ef-current">Current Savings</Label>
              <Input
                id="ef-current"
                type="number"
                placeholder="e.g. 50000"
                value={currentSavings}
                onChange={(e) => setCurrentSavings(e.target.value)}
                min="0"
                step="any"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ef-capacity">Monthly Savings Capacity</Label>
              <Input
                id="ef-capacity"
                type="number"
                placeholder="e.g. 5000"
                value={monthlySavingsCapacity}
                onChange={(e) => setMonthlySavingsCapacity(e.target.value)}
                min="0"
                step="any"
              />
            </div>
          </div>
          <Button type="submit">Calculate</Button>
        </form>

        {results && (
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-md border p-3">
                <p className="text-sm text-muted-foreground">Target Amount</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(results.targetAmount)}
                </p>
              </div>
              <div className="rounded-md border p-3">
                <p className="text-sm text-muted-foreground">
                  Current Coverage
                </p>
                <p className="text-lg font-semibold">
                  {results.coverageMonths.toFixed(1)} months
                </p>
              </div>
              <div className="rounded-md border p-3">
                <p className="text-sm text-muted-foreground">
                  Remaining to Save
                </p>
                <p className="text-lg font-semibold">
                  {formatCurrency(results.remaining)}
                </p>
              </div>
              <div className="rounded-md border p-3">
                <p className="text-sm text-muted-foreground">
                  Months to Reach Goal
                </p>
                <p className="text-lg font-semibold">
                  {results.monthsToGoal > 0
                    ? `${results.monthsToGoal} months`
                    : "Goal reached!"}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">
                  {progressPercent.toFixed(1)}%
                </span>
              </div>
              <div className="h-4 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatCurrency(results.currentSavings)}</span>
                <span>{formatCurrency(results.targetAmount)}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
