"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import {
  calculateIncomeTax,
  calculateFreelancerTax,
  type TaxResult,
  type FreelancerTaxComparison,
} from "@/lib/calculators";
import { formatCurrency, formatPercent } from "@/lib/client";

export default function TaxCalculator() {
  const [annualIncome, setAnnualIncome] = useState("");
  const [isFreelancer, setIsFreelancer] = useState(false);
  const [employedResult, setEmployedResult] = useState<TaxResult | null>(null);
  const [freelancerResult, setFreelancerResult] = useState<FreelancerTaxComparison | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const income = parseFloat(annualIncome);
    if (isNaN(income) || income <= 0) return;

    if (isFreelancer) {
      setFreelancerResult(calculateFreelancerTax(income));
      setEmployedResult(null);
    } else {
      setEmployedResult(calculateIncomeTax(income));
      setFreelancerResult(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tax Calculator (Philippines)</CardTitle>
        <CardDescription>
          Compute income tax under the TRAIN law for employed and self-employed/freelancers.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="annual-income">Annual Income</Label>
              <Input
                id="annual-income"
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g. 500000"
                value={annualIncome}
                onChange={(e) => setAnnualIncome(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Employment Type</Label>
              <div className="flex items-center gap-4 h-9">
                <button
                  type="button"
                  onClick={() => setIsFreelancer(false)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    !isFreelancer
                      ? "bg-primary text-primary-foreground shadow"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  Employed
                </button>
                <button
                  type="button"
                  onClick={() => setIsFreelancer(true)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isFreelancer
                      ? "bg-primary text-primary-foreground shadow"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  Self-Employed / Freelancer
                </button>
              </div>
            </div>
          </div>
          <Button type="submit" className="w-full sm:w-auto">Calculate</Button>
        </form>

        {/* Employed Result */}
        {employedResult && (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-muted-foreground">Income Tax Breakdown</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="rounded-lg border p-3">
                <Label className="text-xs text-muted-foreground">Tax Bracket</Label>
                <p className="text-sm font-semibold mt-1">{employedResult.bracket}</p>
              </div>
              <div className="rounded-lg border p-3">
                <Label className="text-xs text-muted-foreground">Annual Tax Due</Label>
                <p className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                  {formatCurrency(employedResult.taxDue)}
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <Label className="text-xs text-muted-foreground">Effective Tax Rate</Label>
                <p className="text-lg font-semibold">
                  {formatPercent(employedResult.effectiveTaxRate.toFixed(2))}
                </p>
              </div>
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
                <Label className="text-xs text-muted-foreground">After-Tax Annual Income</Label>
                <p className="text-lg font-bold text-primary">
                  {formatCurrency(employedResult.afterTaxAnnual)}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-lg border p-3">
                <Label className="text-xs text-muted-foreground">Monthly Tax</Label>
                <p className="text-lg font-semibold">{formatCurrency(employedResult.monthlyTax)}</p>
              </div>
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
                <Label className="text-xs text-muted-foreground">Monthly After-Tax Income</Label>
                <p className="text-lg font-bold text-primary">
                  {formatCurrency(employedResult.afterTaxMonthly)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Freelancer Result */}
        {freelancerResult && (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-muted-foreground">Tax Comparison</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Detail</TableHead>
                  <TableHead className="text-right">Graduated Rate</TableHead>
                  <TableHead className="text-right">8% Flat Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Annual Income</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(freelancerResult.graduated.annualIncome)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(freelancerResult.flatRate.annualIncome)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Tax Due</TableCell>
                  <TableCell className="text-right font-medium text-orange-600 dark:text-orange-400">
                    {formatCurrency(freelancerResult.graduated.taxDue)}
                  </TableCell>
                  <TableCell className="text-right font-medium text-orange-600 dark:text-orange-400">
                    {formatCurrency(freelancerResult.flatRate.taxDue)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Effective Tax Rate</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatPercent(freelancerResult.graduated.effectiveTaxRate.toFixed(2))}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatPercent(freelancerResult.flatRate.effectiveTaxRate.toFixed(2))}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>After-Tax Annual</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(freelancerResult.graduated.afterTaxAnnual)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(freelancerResult.flatRate.afterTaxAnnual)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            {/* Recommendation badge */}
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-center">
              <p className="text-sm text-muted-foreground mb-2">Recommended Tax Option</p>
              <Badge variant="default" className="text-sm px-4 py-1">
                {freelancerResult.recommended === "flat" ? "8% Flat Rate" : "Graduated Rate"}
              </Badge>
              <p className="text-sm text-muted-foreground mt-2">
                You save{" "}
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {formatCurrency(
                    Math.abs(freelancerResult.graduated.taxDue - freelancerResult.flatRate.taxDue)
                  )}
                </span>{" "}
                per year with this option.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
