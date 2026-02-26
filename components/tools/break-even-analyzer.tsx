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
import type { BreakEvenResult } from "@/lib/calculators";
import { formatCurrency } from "@/lib/client";

interface FormState {
  cashPrice: string;
  installmentPrice: string;
  monthlyRate: string;
  processingFee: string;
  maxMonths: string;
}

type FormAction =
  | { type: "SET_FIELD"; field: keyof FormState; value: string }
  | { type: "RESET" };

const initialState: FormState = {
  cashPrice: "",
  installmentPrice: "",
  monthlyRate: "",
  processingFee: "",
  maxMonths: "36",
};

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "RESET":
      return initialState;
  }
}

export default function BreakEvenAnalyzer() {
  const [form, dispatch] = useReducer(formReducer, initialState);
  const { data: result, isLoading, error, calculate } = useToolCalculator<BreakEvenResult>("break-even");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cash = parseFloat(form.cashPrice);
    const installment = parseFloat(form.installmentPrice);
    const rate = parseFloat(form.monthlyRate);
    const fee = parseFloat(form.processingFee) || 0;
    const maxMonths = parseInt(form.maxMonths) || 36;
    if (isNaN(cash) || isNaN(installment) || isNaN(rate)) return;
    await calculate({
      cashPrice: cash,
      installmentPriceZero: installment,
      monthlyRate: rate / 100,
      processingFee: fee,
      maxMonths,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Break-Even Analyzer</CardTitle>
        <CardDescription>
          Compare bank installment vs merchant 0% installment to find the break-even point.
          The break-even month is when the bank installment total cost becomes cheaper than the merchant&apos;s 0% plan.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cash-price">Cash Price</Label>
              <Input
                id="cash-price"
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g. 50000"
                value={form.cashPrice}
                onChange={(e) => dispatch({ type: "SET_FIELD", field: "cashPrice", value: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">
                The cash/SRP price of the item.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="installment-price">Merchant 0% Installment Price</Label>
              <Input
                id="installment-price"
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g. 55000"
                value={form.installmentPrice}
                onChange={(e) => dispatch({ type: "SET_FIELD", field: "installmentPrice", value: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">
                Total price under merchant&apos;s 0% installment plan (often higher than the cash price).
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="be-monthly-rate">Monthly Rate (%)</Label>
              <Input
                id="be-monthly-rate"
                type="number"
                step="0.01"
                min="0"
                max="100"
                placeholder="e.g. 1.5"
                value={form.monthlyRate}
                onChange={(e) => dispatch({ type: "SET_FIELD", field: "monthlyRate", value: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">
                The bank&apos;s monthly add-on interest rate for credit card installments.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="be-processing-fee">Processing Fee</Label>
              <Input
                id="be-processing-fee"
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g. 500"
                value={form.processingFee}
                onChange={(e) => dispatch({ type: "SET_FIELD", field: "processingFee", value: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                One-time processing or service fee charged by the bank (if any).
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="be-max-months">Max Months</Label>
              <Input
                id="be-max-months"
                type="number"
                step="1"
                min="1"
                max="60"
                placeholder="36"
                value={form.maxMonths}
                onChange={(e) => dispatch({ type: "SET_FIELD", field: "maxMonths", value: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Maximum number of months to compare (default: 36).
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

        {result && (
          <div className="space-y-4" aria-label="Break-even analysis results">
            {/* Break-even summary */}
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-center">
              {result.breakEvenMonth !== null ? (
                <>
                  <p className="text-sm text-muted-foreground">Break-Even Month</p>
                  <p className="text-3xl font-bold text-primary">Month {result.breakEvenMonth}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Bank installment becomes cheaper starting at {result.breakEvenMonth} months or fewer.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">No Break-Even Found</p>
                  <p className="text-lg font-semibold">
                    The merchant 0% installment is always cheaper within the comparison period.
                  </p>
                </>
              )}
            </div>

            {/* Month-by-month table */}
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground mb-2">Month-by-Month Comparison</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead className="text-right">Bank Total</TableHead>
                    <TableHead className="text-right">Merchant Total</TableHead>
                    <TableHead className="text-center">Cheaper</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.monthlyData
                    .filter((_, i) => i < 12 || (i + 1) % 3 === 0)
                    .map((row) => (
                      <TableRow
                        key={row.month}
                        className={row.month === result.breakEvenMonth ? "bg-primary/10" : ""}
                      >
                        <TableCell className="font-medium">
                          {row.month}
                          {row.month === result.breakEvenMonth && (
                            <Badge variant="default" className="ml-2">Break-even</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(row.bankTotal)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(row.merchantTotal)}</TableCell>
                        <TableCell className="text-center">
                          {row.bankCheaper ? (
                            <Badge variant="default">Bank</Badge>
                          ) : (
                            <Badge variant="secondary">Merchant</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
