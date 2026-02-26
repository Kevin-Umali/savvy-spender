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
  calculateInvestmentReturn,
  type InvestmentResult,
} from "@/lib/calculators";
import { formatCurrency } from "@/lib/client";

export default function InvestmentCalculator() {
  const [initialAmount, setInitialAmount] = useState("");
  const [monthlyContribution, setMonthlyContribution] = useState("");
  const [years, setYears] = useState("");
  const [annualReturn, setAnnualReturn] = useState("");
  const [taxRate, setTaxRate] = useState("20");
  const [results, setResults] = useState<InvestmentResult | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const initial = parseFloat(initialAmount) || 0;
    const monthly = parseFloat(monthlyContribution) || 0;
    const yrs = parseInt(years);
    const rate = parseFloat(annualReturn);
    const tax = parseFloat(taxRate) || 20;

    if (isNaN(yrs) || isNaN(rate) || yrs <= 0) return;

    const result = calculateInvestmentReturn(
      initial,
      monthly,
      yrs,
      rate / 100,
      tax / 100
    );
    setResults(result);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Investment Returns Calculator</CardTitle>
        <CardDescription>
          Project investment growth with regular contributions and withholding
          tax.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCalculate} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <div className="space-y-2">
              <Label htmlFor="inv-initial">Initial Investment</Label>
              <Input
                id="inv-initial"
                type="number"
                placeholder="e.g. 100000"
                value={initialAmount}
                onChange={(e) => setInitialAmount(e.target.value)}
                min="0"
                step="any"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inv-monthly">Monthly Contribution</Label>
              <Input
                id="inv-monthly"
                type="number"
                placeholder="e.g. 5000"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(e.target.value)}
                min="0"
                step="any"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inv-years">Investment Period (years)</Label>
              <Input
                id="inv-years"
                type="number"
                placeholder="e.g. 10"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                required
                min="1"
                max="50"
                step="1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inv-return">Expected Annual Return (%)</Label>
              <Input
                id="inv-return"
                type="number"
                placeholder="e.g. 8"
                value={annualReturn}
                onChange={(e) => setAnnualReturn(e.target.value)}
                required
                min="0"
                step="any"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inv-tax">Withholding Tax (%)</Label>
              <Input
                id="inv-tax"
                type="number"
                placeholder="e.g. 20"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                min="0"
                max="100"
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
                <p className="text-sm text-muted-foreground">Final Amount</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(results.finalAmount)}
                </p>
              </div>
              <div className="rounded-md border p-3">
                <p className="text-sm text-muted-foreground">
                  Total Contributed
                </p>
                <p className="text-lg font-semibold">
                  {formatCurrency(results.totalContributed)}
                </p>
              </div>
              <div className="rounded-md border p-3">
                <p className="text-sm text-muted-foreground">Total Returns</p>
                <p className="text-lg font-semibold text-green-600">
                  {formatCurrency(results.totalReturns)}
                </p>
              </div>
              <div className="rounded-md border p-3">
                <p className="text-sm text-muted-foreground">
                  After-Tax Returns
                </p>
                <p className="text-lg font-semibold">
                  {formatCurrency(results.afterTaxReturns)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Tax: {formatCurrency(results.withholdingTax)}
                </p>
              </div>
            </div>

            {results.yearlyBreakdown.length > 0 && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Year</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                      <TableHead className="text-right">Contributed</TableHead>
                      <TableHead className="text-right">Returns</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.yearlyBreakdown.map((row) => (
                      <TableRow key={row.year}>
                        <TableCell>{row.year}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(row.balance)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(row.contributed)}
                        </TableCell>
                        <TableCell className="text-right text-green-600">
                          {formatCurrency(row.returns)}
                        </TableCell>
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
