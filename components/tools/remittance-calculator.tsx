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
  calculateRemittance,
  type RemittanceResult,
} from "@/lib/calculators";
import { formatCurrency } from "@/lib/client";

export default function RemittanceCalculator() {
  const [sendAmount, setSendAmount] = useState("");
  const [exchangeRate, setExchangeRate] = useState("");
  const [serviceFee, setServiceFee] = useState("");
  const [sendCurrency, setSendCurrency] = useState("USD");
  const [receiveCurrency, setReceiveCurrency] = useState("PHP");
  const [results, setResults] = useState<RemittanceResult | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(sendAmount);
    const rate = parseFloat(exchangeRate);
    const fee = parseFloat(serviceFee) || 0;

    if (isNaN(amount) || isNaN(rate) || amount <= 0 || rate <= 0) return;

    const result = calculateRemittance(
      amount,
      rate,
      fee,
      sendCurrency,
      receiveCurrency
    );
    setResults(result);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Remittance Calculator</CardTitle>
        <CardDescription>
          Calculate how much your recipient will receive after exchange rates and
          service fees.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCalculate} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="rem-amount">Send Amount</Label>
              <Input
                id="rem-amount"
                type="number"
                placeholder="e.g. 500"
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
                required
                min="0"
                step="any"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rem-rate">
                Exchange Rate ({receiveCurrency} per {sendCurrency})
              </Label>
              <Input
                id="rem-rate"
                type="number"
                placeholder="e.g. 56.50"
                value={exchangeRate}
                onChange={(e) => setExchangeRate(e.target.value)}
                required
                min="0"
                step="any"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rem-fee">Service Fee ({sendCurrency})</Label>
              <Input
                id="rem-fee"
                type="number"
                placeholder="e.g. 5"
                value={serviceFee}
                onChange={(e) => setServiceFee(e.target.value)}
                min="0"
                step="any"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rem-send-currency">Send Currency</Label>
              <Input
                id="rem-send-currency"
                type="text"
                placeholder="e.g. USD"
                value={sendCurrency}
                onChange={(e) => setSendCurrency(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rem-receive-currency">Receive Currency</Label>
              <Input
                id="rem-receive-currency"
                type="text"
                placeholder="e.g. PHP"
                value={receiveCurrency}
                onChange={(e) => setReceiveCurrency(e.target.value)}
              />
            </div>
          </div>
          <Button type="submit">Calculate</Button>
        </form>

        {results && (
          <div className="mt-6 space-y-4">
            <div className="rounded-lg border bg-primary/5 p-6 text-center">
              <p className="text-sm text-muted-foreground">
                Recipient Receives
              </p>
              <p className="text-3xl font-bold text-primary">
                {formatCurrency(results.receiveAmount)}{" "}
                <span className="text-lg font-medium">
                  {results.receiveCurrency}
                </span>
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-md border p-3">
                <p className="text-sm text-muted-foreground">Send Amount</p>
                <p className="text-lg font-semibold">
                  {results.sendAmount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  {results.sendCurrency}
                </p>
              </div>
              <div className="rounded-md border p-3">
                <p className="text-sm text-muted-foreground">Service Fee</p>
                <p className="text-lg font-semibold">
                  {results.fee.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  {results.sendCurrency}
                </p>
              </div>
              <div className="rounded-md border p-3">
                <p className="text-sm text-muted-foreground">Total Cost</p>
                <p className="text-lg font-semibold">
                  {results.totalCost.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  {results.sendCurrency}
                </p>
              </div>
              <div className="rounded-md border p-3">
                <p className="text-sm text-muted-foreground">Effective Rate</p>
                <p className="text-lg font-semibold">
                  {results.effectiveRate.toFixed(4)}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
