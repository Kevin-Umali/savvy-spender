"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { convertInterestRate, type RateConversionResult } from "@/lib/calculators";
import { formatPercent } from "@/lib/client";

export default function InterestRateConverter() {
  const [flatRate, setFlatRate] = useState("");
  const [termMonths, setTermMonths] = useState("");
  const [result, setResult] = useState<RateConversionResult | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rate = parseFloat(flatRate);
    const months = parseInt(termMonths);
    if (isNaN(rate) || isNaN(months) || months <= 0) return;
    setResult(convertInterestRate(rate / 100, months));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interest Rate Converter</CardTitle>
        <CardDescription>
          Convert flat monthly rates to effective interest rates (EIR) and factor rates.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="flat-rate">Flat Monthly Rate (%)</Label>
              <Input
                id="flat-rate"
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g. 1.5"
                value={flatRate}
                onChange={(e) => setFlatRate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="term-months">Term (Months)</Label>
              <Input
                id="term-months"
                type="number"
                min="1"
                placeholder="e.g. 12"
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
            <h4 className="text-sm font-semibold text-muted-foreground">Conversion Results</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="rounded-lg border p-3">
                <Label className="text-xs text-muted-foreground">Flat Rate (Monthly)</Label>
                <p className="text-lg font-semibold">{formatPercent(result.flatRateMonthly.toFixed(2))}</p>
              </div>
              <div className="rounded-lg border p-3">
                <Label className="text-xs text-muted-foreground">Flat Rate (Annual)</Label>
                <p className="text-lg font-semibold">{formatPercent(result.flatRateAnnual.toFixed(2))}</p>
              </div>
              <div className="rounded-lg border p-3">
                <Label className="text-xs text-muted-foreground">Total Interest %</Label>
                <p className="text-lg font-semibold">{formatPercent(result.totalInterestPercent.toFixed(2))}</p>
              </div>
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
                <Label className="text-xs text-muted-foreground">EIR (Monthly)</Label>
                <p className="text-lg font-bold text-primary">{formatPercent(result.eirMonthly.toFixed(4))}</p>
              </div>
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
                <Label className="text-xs text-muted-foreground">EIR (Annual)</Label>
                <p className="text-lg font-bold text-primary">{formatPercent(result.eirAnnual.toFixed(2))}</p>
              </div>
              <div className="rounded-lg border p-3">
                <Label className="text-xs text-muted-foreground">Factor Rate</Label>
                <p className="text-lg font-semibold">{result.factorRate.toFixed(6)}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
