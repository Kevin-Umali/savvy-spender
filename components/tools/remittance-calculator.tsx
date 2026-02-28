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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {
  calculateRemittance,
  type RemittanceResult,
} from "@/lib/calculators";

const CURRENCY_OPTIONS = [
  { code: "USD", label: "USD - US Dollar", symbol: "$" },
  { code: "EUR", label: "EUR - Euro", symbol: "\u20ac" },
  { code: "GBP", label: "GBP - British Pound", symbol: "\u00a3" },
  { code: "SGD", label: "SGD - Singapore Dollar", symbol: "S$" },
  { code: "AED", label: "AED - UAE Dirham", symbol: "AED" },
  { code: "SAR", label: "SAR - Saudi Riyal", symbol: "SAR" },
  { code: "JPY", label: "JPY - Japanese Yen", symbol: "\u00a5" },
  { code: "KRW", label: "KRW - Korean Won", symbol: "\u20a9" },
  { code: "AUD", label: "AUD - Australian Dollar", symbol: "A$" },
  { code: "CAD", label: "CAD - Canadian Dollar", symbol: "C$" },
  { code: "HKD", label: "HKD - Hong Kong Dollar", symbol: "HK$" },
  { code: "TWD", label: "TWD - Taiwan Dollar", symbol: "NT$" },
  { code: "PHP", label: "PHP - Philippine Peso", symbol: "\u20b1" },
];

const RECEIVE_CURRENCIES = [
  { code: "PHP", label: "PHP - Philippine Peso", symbol: "\u20b1" },
  { code: "USD", label: "USD - US Dollar", symbol: "$" },
  { code: "EUR", label: "EUR - Euro", symbol: "\u20ac" },
  { code: "GBP", label: "GBP - British Pound", symbol: "\u00a3" },
  { code: "SGD", label: "SGD - Singapore Dollar", symbol: "S$" },
  { code: "JPY", label: "JPY - Japanese Yen", symbol: "\u00a5" },
];

const formatAmount = (amount: number, currency: string): string => {
  const cur = [...CURRENCY_OPTIONS, ...RECEIVE_CURRENCIES].find((c) => c.code === currency);
  const symbol = cur?.symbol || currency;
  return `${symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

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
          service fees. Supports multiple currencies for OFW remittances.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCalculate} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Send Currency */}
            <div className="space-y-2">
              <Label htmlFor="rem-send-currency" className="font-mono-label text-[10px] uppercase tracking-[0.15em]">Send Currency</Label>
              <Select value={sendCurrency} onValueChange={setSendCurrency}>
                <SelectTrigger id="rem-send-currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCY_OPTIONS.map((cur) => (
                    <SelectItem key={cur.code} value={cur.code}>
                      {cur.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Receive Currency */}
            <div className="space-y-2">
              <Label htmlFor="rem-receive-currency" className="font-mono-label text-[10px] uppercase tracking-[0.15em]">Receive Currency</Label>
              <Select value={receiveCurrency} onValueChange={setReceiveCurrency}>
                <SelectTrigger id="rem-receive-currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {RECEIVE_CURRENCIES.map((cur) => (
                    <SelectItem key={cur.code} value={cur.code}>
                      {cur.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="rem-amount" className="font-mono-label text-[10px] uppercase tracking-[0.15em]">Send Amount ({sendCurrency})</Label>
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
              <Label htmlFor="rem-rate" className="font-mono-label text-[10px] uppercase tracking-[0.15em]">
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
              <Label htmlFor="rem-fee" className="font-mono-label text-[10px] uppercase tracking-[0.15em]">Service Fee ({sendCurrency})</Label>
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
          </div>
          <Button type="submit" className="font-mono-label uppercase tracking-[0.1em]">Calculate</Button>
        </form>

        {results && (
          <div className="mt-6 space-y-4">
            {/* Big result */}
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-6 text-center">
              <p className="text-sm text-muted-foreground">
                Recipient Receives
              </p>
              <p className="text-3xl font-bold text-primary">
                {formatAmount(results.receiveAmount, results.receiveCurrency)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                in {results.receiveCurrency}
              </p>
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Send Amount</p>
                <p className="text-lg font-semibold">
                  {formatAmount(results.sendAmount, results.sendCurrency)}
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Service Fee</p>
                <p className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                  {formatAmount(results.fee, results.sendCurrency)}
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Total Cost (You Pay)</p>
                <p className="text-lg font-semibold">
                  {formatAmount(results.totalCost, results.sendCurrency)}
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Effective Rate</p>
                <p className="text-lg font-semibold">
                  {results.effectiveRate.toFixed(4)} {results.receiveCurrency}/{results.sendCurrency}
                </p>
                <p className="text-xs text-muted-foreground">
                  vs {results.exchangeRate.toFixed(4)} market rate
                </p>
              </div>
            </div>

            {/* Fee Impact */}
            {results.fee > 0 && (
              <div className="rounded-lg border border-dashed p-3 text-center">
                <p className="text-xs text-muted-foreground">Fee Impact</p>
                <p className="text-sm font-medium">
                  The service fee reduces your effective rate from{" "}
                  <span className="text-primary font-semibold">{results.exchangeRate.toFixed(4)}</span>
                  {" "}to{" "}
                  <span className="text-orange-600 dark:text-orange-400 font-semibold">{results.effectiveRate.toFixed(4)}</span>
                  {" "}({((1 - results.effectiveRate / results.exchangeRate) * 100).toFixed(2)}% loss)
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
