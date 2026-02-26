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
import { Badge } from "@/components/ui/badge";
import {
  calculateRetirement,
  type RetirementResult,
} from "@/lib/calculators";
import { formatCurrency } from "@/lib/client";

export default function RetirementCalculator() {
  const [currentAge, setCurrentAge] = useState("");
  const [retirementAge, setRetirementAge] = useState("");
  const [currentSavings, setCurrentSavings] = useState("");
  const [monthlySavings, setMonthlySavings] = useState("");
  const [expectedReturn, setExpectedReturn] = useState("");
  const [monthlyExpenses, setMonthlyExpenses] = useState("");
  const [retirementDuration, setRetirementDuration] = useState("25");
  const [results, setResults] = useState<RetirementResult | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const age = parseInt(currentAge);
    const retAge = parseInt(retirementAge);
    const savings = parseFloat(currentSavings) || 0;
    const monthly = parseFloat(monthlySavings) || 0;
    const returnRate = parseFloat(expectedReturn);
    const expenses = parseFloat(monthlyExpenses);
    const duration = parseInt(retirementDuration) || 25;

    if (
      isNaN(age) ||
      isNaN(retAge) ||
      isNaN(returnRate) ||
      isNaN(expenses) ||
      retAge <= age
    )
      return;

    const result = calculateRetirement(
      age,
      retAge,
      savings,
      monthly,
      returnRate / 100,
      expenses,
      duration
    );
    setResults(result);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Retirement Calculator</CardTitle>
        <CardDescription>
          Project whether your savings will be enough to cover retirement
          expenses.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCalculate} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="ret-age">Current Age</Label>
              <Input
                id="ret-age"
                type="number"
                placeholder="e.g. 30"
                value={currentAge}
                onChange={(e) => setCurrentAge(e.target.value)}
                required
                min="18"
                max="100"
                step="1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ret-retire-age">Retirement Age</Label>
              <Input
                id="ret-retire-age"
                type="number"
                placeholder="e.g. 60"
                value={retirementAge}
                onChange={(e) => setRetirementAge(e.target.value)}
                required
                min="18"
                max="100"
                step="1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ret-current">Current Savings</Label>
              <Input
                id="ret-current"
                type="number"
                placeholder="e.g. 500000"
                value={currentSavings}
                onChange={(e) => setCurrentSavings(e.target.value)}
                min="0"
                step="any"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ret-monthly">Monthly Savings</Label>
              <Input
                id="ret-monthly"
                type="number"
                placeholder="e.g. 10000"
                value={monthlySavings}
                onChange={(e) => setMonthlySavings(e.target.value)}
                min="0"
                step="any"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ret-return">Expected Annual Return (%)</Label>
              <Input
                id="ret-return"
                type="number"
                placeholder="e.g. 8"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(e.target.value)}
                required
                min="0"
                step="any"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ret-expenses">Monthly Expenses in Retirement</Label>
              <Input
                id="ret-expenses"
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
              <Label htmlFor="ret-duration">Retirement Duration (years)</Label>
              <Input
                id="ret-duration"
                type="number"
                placeholder="e.g. 25"
                value={retirementDuration}
                onChange={(e) => setRetirementDuration(e.target.value)}
                min="1"
                step="1"
              />
            </div>
          </div>
          <Button type="submit">Calculate</Button>
        </form>

        {results && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3">
              <p className="text-sm font-medium">Status:</p>
              {results.onTrack ? (
                <Badge className="bg-green-600 hover:bg-green-600">
                  On Track
                </Badge>
              ) : (
                <Badge variant="destructive">Off Track</Badge>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-md border p-3">
                <p className="text-sm text-muted-foreground">Projected Fund</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(results.projectedFund)}
                </p>
              </div>
              <div className="rounded-md border p-3">
                <p className="text-sm text-muted-foreground">Target Fund</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(results.targetFund)}
                </p>
              </div>
              <div className="rounded-md border p-3">
                <p className="text-sm text-muted-foreground">Gap Amount</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(results.gap)}
                </p>
              </div>
              <div className="rounded-md border p-3">
                <p className="text-sm text-muted-foreground">
                  Additional Monthly Needed
                </p>
                <p className="text-lg font-semibold">
                  {formatCurrency(results.additionalMonthlyNeeded)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-md border p-3">
                <p className="text-sm text-muted-foreground">Years to Retirement</p>
                <p className="text-lg font-semibold">
                  {results.yearsToRetirement}
                </p>
              </div>
              <div className="rounded-md border p-3">
                <p className="text-sm text-muted-foreground">
                  Monthly Needed in Retirement
                </p>
                <p className="text-lg font-semibold">
                  {formatCurrency(results.monthlyNeeded)}
                </p>
              </div>
              <div className="rounded-md border p-3">
                <p className="text-sm text-muted-foreground">Retirement Age</p>
                <p className="text-lg font-semibold">{results.retirementAge}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
