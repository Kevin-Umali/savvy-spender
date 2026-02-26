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
import { calculateCarLoan, type CarLoanResult } from "@/lib/calculators";
import { formatCurrency } from "@/lib/client";

export default function CarLoanCalculator() {
  const [vehiclePrice, setVehiclePrice] = useState("");
  const [downPaymentPercent, setDownPaymentPercent] = useState("");
  const [monthlyRate, setMonthlyRate] = useState("");
  const [termMonths, setTermMonths] = useState("");
  const [result, setResult] = useState<CarLoanResult | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(vehiclePrice);
    const dp = parseFloat(downPaymentPercent);
    const rate = parseFloat(monthlyRate);
    const months = parseInt(termMonths);
    if (isNaN(price) || isNaN(dp) || isNaN(rate) || isNaN(months) || months <= 0) return;
    setResult(calculateCarLoan(price, dp, rate / 100, months));
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
                value={vehiclePrice}
                onChange={(e) => setVehiclePrice(e.target.value)}
                required
              />
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
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cl-monthly-rate">Monthly Rate (%)</Label>
              <Input
                id="cl-monthly-rate"
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g. 1.2"
                value={monthlyRate}
                onChange={(e) => setMonthlyRate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cl-term">Term (Months)</Label>
              <Input
                id="cl-term"
                type="number"
                min="1"
                placeholder="e.g. 60"
                value={termMonths}
                onChange={(e) => setTermMonths(e.target.value)}
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full sm:w-auto">Calculate</Button>
        </form>

        {result && (
          <div className="space-y-4">
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
                  <TableCell>Chattel Mortgage Fee</TableCell>
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
