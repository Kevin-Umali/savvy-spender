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
import { calculateBreakEven, type BreakEvenResult } from "@/lib/calculators";
import { formatCurrency } from "@/lib/client";

export default function BreakEvenAnalyzer() {
  const [cashPrice, setCashPrice] = useState("");
  const [installmentPrice, setInstallmentPrice] = useState("");
  const [monthlyRate, setMonthlyRate] = useState("");
  const [processingFee, setProcessingFee] = useState("");
  const [result, setResult] = useState<BreakEvenResult | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cash = parseFloat(cashPrice);
    const installment = parseFloat(installmentPrice);
    const rate = parseFloat(monthlyRate);
    const fee = parseFloat(processingFee) || 0;
    if (isNaN(cash) || isNaN(installment) || isNaN(rate)) return;
    setResult(calculateBreakEven(cash, installment, rate / 100, fee));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Break-Even Analyzer</CardTitle>
        <CardDescription>
          Compare bank installment vs merchant 0% installment to find the break-even point.
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
                value={cashPrice}
                onChange={(e) => setCashPrice(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="installment-price">Merchant 0% Installment Price</Label>
              <Input
                id="installment-price"
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g. 55000"
                value={installmentPrice}
                onChange={(e) => setInstallmentPrice(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="be-monthly-rate">Monthly Rate (%)</Label>
              <Input
                id="be-monthly-rate"
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g. 1.5"
                value={monthlyRate}
                onChange={(e) => setMonthlyRate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="be-processing-fee">Processing Fee</Label>
              <Input
                id="be-processing-fee"
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g. 500"
                value={processingFee}
                onChange={(e) => setProcessingFee(e.target.value)}
              />
            </div>
          </div>
          <Button type="submit" className="w-full sm:w-auto">Calculate</Button>
        </form>

        {result && (
          <div className="space-y-4">
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
                    The merchant 0% installment is always cheaper within 36 months.
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
