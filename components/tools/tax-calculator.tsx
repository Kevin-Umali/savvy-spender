"use client";

import { useReducer } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UpdateIcon } from "@radix-ui/react-icons";
import { useToolCalculator } from "@/hooks/use-tool-calculator";
import type { TaxResult, FreelancerTaxComparison } from "@/lib/calculators";
import { formatCurrency, formatPercent } from "@/lib/client";

interface FormState {
  annualIncome: string;
  isFreelancer: boolean;
}

type FormAction =
  | { type: "SET_FIELD"; field: keyof FormState; value: string }
  | { type: "SET_FREELANCER"; value: boolean }
  | { type: "RESET" };

const initialState: FormState = {
  annualIncome: "",
  isFreelancer: false,
};

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_FREELANCER":
      return { ...state, isFreelancer: action.value };
    case "RESET":
      return initialState;
  }
}

type TaxApiResult = TaxResult | FreelancerTaxComparison;

function isFreelancerResult(result: TaxApiResult): result is FreelancerTaxComparison {
  return "graduated" in result && "flatRate" in result && "recommended" in result;
}

export default function TaxCalculator() {
  const [form, dispatch] = useReducer(formReducer, initialState);
  const { data: result, isLoading, error, calculate } = useToolCalculator<TaxApiResult>("tax");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const income = parseFloat(form.annualIncome);
    if (isNaN(income) || income <= 0) return;
    await calculate({ annualIncome: income, isFreelancer: form.isFreelancer });
  };

  const employedResult = result && !isFreelancerResult(result) ? result : null;
  const freelancerResult = result && isFreelancerResult(result) ? result : null;

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
                value={form.annualIncome}
                onChange={(e) => dispatch({ type: "SET_FIELD", field: "annualIncome", value: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">
                Your total annual gross income before taxes and deductions under the TRAIN law (Tax Reform for Acceleration and Inclusion).
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="employment-type">Employment Type</Label>
              <div className="flex items-center gap-4 h-9" id="employment-type">
                <button
                  type="button"
                  onClick={() => dispatch({ type: "SET_FREELANCER", value: false })}
                  aria-label="Select employed tax computation"
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    !form.isFreelancer
                      ? "bg-primary text-primary-foreground shadow"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  Employed
                </button>
                <button
                  type="button"
                  onClick={() => dispatch({ type: "SET_FREELANCER", value: true })}
                  aria-label="Select freelancer tax computation with 8% flat rate option"
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    form.isFreelancer
                      ? "bg-primary text-primary-foreground shadow"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  Self-Employed / Freelancer
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                {form.isFreelancer
                  ? "Freelancers can choose between graduated rates or the 8% flat rate on gross income exceeding ₱250,000."
                  : "Employed individuals are taxed using the graduated TRAIN law brackets."}
              </p>
            </div>
          </div>
          <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
            {isLoading ? (
              <>
                <UpdateIcon className="mr-2 h-4 w-4 animate-spin" />
                Calculating...
              </>
            ) : (
              "Calculate"
            )}
          </Button>
        </form>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Employed Result */}
        {employedResult && (
          <div className="space-y-4" aria-label="Income tax breakdown results">
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
          <div className="space-y-4" aria-label="Freelancer tax comparison results">
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
