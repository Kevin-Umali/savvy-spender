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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UpdateIcon } from "@radix-ui/react-icons";
import { useToolCalculator } from "@/hooks/use-tool-calculator";
import type { CarLoanResult } from "@/lib/calculators";
import { formatCurrency } from "@/lib/client";

interface FormState {
  vehiclePrice: string;
  downPaymentPercent: string;
  monthlyRate: string;
  termMonths: string;
}

type FormAction =
  | { type: "SET_FIELD"; field: keyof FormState; value: string }
  | { type: "RESET" };

const initialState: FormState = {
  vehiclePrice: "",
  downPaymentPercent: "",
  monthlyRate: "",
  termMonths: "",
};

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "RESET":
      return initialState;
  }
}

export default function CarLoanCalculator() {
  const [form, dispatch] = useReducer(formReducer, initialState);
  const { data: result, isLoading, error, calculate } = useToolCalculator<CarLoanResult>("car-loan");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(form.vehiclePrice);
    const dp = parseFloat(form.downPaymentPercent);
    const rate = parseFloat(form.monthlyRate);
    const months = parseInt(form.termMonths);
    if (isNaN(price) || isNaN(dp) || isNaN(rate) || isNaN(months) || months <= 0) return;
    await calculate({
      vehiclePrice: price,
      downPaymentPercent: dp,
      monthlyRate: rate / 100,
      months,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Car Loan Calculator</CardTitle>
        <CardDescription>
          Estimate your monthly car loan payment, total interest, and chattel mortgage fee.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vehicle-price">Vehicle Price</Label>
              <Input
                id="vehicle-price"
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g. 1000000"
                value={form.vehiclePrice}
                onChange={(e) => dispatch({ type: "SET_FIELD", field: "vehiclePrice", value: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">
                The total selling price of the vehicle.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cl-down-payment">Down Payment (%)</Label>
              <Input
                id="cl-down-payment"
                type="number"
                step="0.1"
                min="0"
                max="100"
                placeholder="e.g. 20"
                value={form.downPaymentPercent}
                onChange={(e) => dispatch({ type: "SET_FIELD", field: "downPaymentPercent", value: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">
                Typically 20-30% for auto loans in PH. A higher down payment reduces your monthly amortization.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cl-monthly-rate">Monthly Rate (%)</Label>
              <Input
                id="cl-monthly-rate"
                type="number"
                step="0.01"
                min="0"
                max="100"
                placeholder="e.g. 1.2"
                value={form.monthlyRate}
                onChange={(e) => dispatch({ type: "SET_FIELD", field: "monthlyRate", value: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">
                The monthly add-on interest rate from the bank or financing company.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cl-term">Term (Months)</Label>
              <Input
                id="cl-term"
                type="number"
                step="1"
                min="1"
                max="84"
                placeholder="e.g. 60"
                value={form.termMonths}
                onChange={(e) => dispatch({ type: "SET_FIELD", field: "termMonths", value: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">
                Loan repayment period. Common terms are 36, 48, or 60 months.
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
          <div className="space-y-4" aria-label="Car loan breakdown results">
            <h4 className="text-sm font-semibold text-muted-foreground">Loan Breakdown</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Vehicle Price</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(result.vehiclePrice)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6 text-muted-foreground">Down Payment</TableCell>
                  <TableCell className="text-right font-medium text-orange-600 dark:text-orange-400">
                    -{formatCurrency(result.downPayment)}
                  </TableCell>
                </TableRow>
                <TableRow className="border-t-2">
                  <TableCell className="font-medium">Loan Amount</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(result.loanAmount)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    Chattel Mortgage Fee
                    <p className="text-xs text-muted-foreground mt-0.5">
                      ~1.5% of loan amount, registered with LTO
                    </p>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(result.chattelMortgageFee)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total Interest</TableCell>
                  <TableCell className="text-right font-medium text-orange-600 dark:text-orange-400">
                    {formatCurrency(result.totalInterest)}
                  </TableCell>
                </TableRow>
                <TableRow className="border-t-2">
                  <TableCell className="font-medium">Total Cost</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(result.totalPayment)}
                  </TableCell>
                </TableRow>
                <TableRow className="bg-primary/5">
                  <TableCell className="font-bold text-primary">Monthly Payment</TableCell>
                  <TableCell className="text-right text-xl font-bold text-primary">
                    {formatCurrency(result.monthlyPayment)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
