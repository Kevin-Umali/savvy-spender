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
  calculateDebtPayoff,
  type DebtItem,
  type DebtPayoffResult,
} from "@/lib/calculators";
import { formatCurrency } from "@/lib/client";

interface DebtFormItem {
  name: string;
  balance: string;
  monthlyRate: string;
  minimumPayment: string;
}

const emptyDebt = (): DebtFormItem => ({
  name: "",
  balance: "",
  monthlyRate: "",
  minimumPayment: "",
});

export default function DebtPlanner() {
  const [debts, setDebts] = useState<DebtFormItem[]>([emptyDebt()]);
  const [extraPayment, setExtraPayment] = useState("");
  const [method, setMethod] = useState<"snowball" | "avalanche">("snowball");
  const [results, setResults] = useState<DebtPayoffResult | null>(null);

  const addDebt = () => {
    setDebts([...debts, emptyDebt()]);
  };

  const removeDebt = (index: number) => {
    if (debts.length <= 1) return;
    setDebts(debts.filter((_, i) => i !== index));
  };

  const updateDebt = (
    index: number,
    field: keyof DebtFormItem,
    value: string
  ) => {
    const updated = [...debts];
    updated[index] = { ...updated[index], [field]: value };
    setDebts(updated);
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const extra = parseFloat(extraPayment) || 0;

    const debtItems: DebtItem[] = debts
      .filter(
        (d) =>
          d.name &&
          parseFloat(d.balance) > 0 &&
          parseFloat(d.monthlyRate) >= 0 &&
          parseFloat(d.minimumPayment) > 0
      )
      .map((d) => ({
        name: d.name,
        balance: parseFloat(d.balance),
        monthlyRate: parseFloat(d.monthlyRate) / 100,
        minimumPayment: parseFloat(d.minimumPayment),
      }));

    if (debtItems.length === 0) return;

    const result = calculateDebtPayoff(debtItems, extra, method);
    setResults(result);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Debt Payoff Planner</CardTitle>
        <CardDescription>
          Compare snowball and avalanche methods to find the fastest way to
          become debt-free.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCalculate} className="space-y-4">
          <div className="space-y-4">
            {debts.map((debt, index) => (
              <div
                key={index}
                className="grid grid-cols-1 gap-3 rounded-md border p-3 sm:grid-cols-5"
              >
                <div className="space-y-2">
                  <Label htmlFor={`debt-name-${index}`}>Debt Name</Label>
                  <Input
                    id={`debt-name-${index}`}
                    type="text"
                    placeholder="e.g. Credit Card"
                    value={debt.name}
                    onChange={(e) => updateDebt(index, "name", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`debt-balance-${index}`}>Balance</Label>
                  <Input
                    id={`debt-balance-${index}`}
                    type="number"
                    placeholder="e.g. 50000"
                    value={debt.balance}
                    onChange={(e) =>
                      updateDebt(index, "balance", e.target.value)
                    }
                    required
                    min="0"
                    step="any"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`debt-rate-${index}`}>Monthly Rate (%)</Label>
                  <Input
                    id={`debt-rate-${index}`}
                    type="number"
                    placeholder="e.g. 2"
                    value={debt.monthlyRate}
                    onChange={(e) =>
                      updateDebt(index, "monthlyRate", e.target.value)
                    }
                    required
                    min="0"
                    step="any"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`debt-min-${index}`}>Min. Payment</Label>
                  <Input
                    id={`debt-min-${index}`}
                    type="number"
                    placeholder="e.g. 2000"
                    value={debt.minimumPayment}
                    onChange={(e) =>
                      updateDebt(index, "minimumPayment", e.target.value)
                    }
                    required
                    min="0"
                    step="any"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeDebt(index)}
                    disabled={debts.length <= 1}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Button type="button" variant="outline" size="sm" onClick={addDebt}>
            + Add Debt
          </Button>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dp-extra">Extra Monthly Payment</Label>
              <Input
                id="dp-extra"
                type="number"
                placeholder="e.g. 1000"
                value={extraPayment}
                onChange={(e) => setExtraPayment(e.target.value)}
                min="0"
                step="any"
              />
            </div>
            <div className="space-y-2">
              <Label>Payoff Method</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={method === "snowball" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMethod("snowball")}
                >
                  Snowball
                </Button>
                <Button
                  type="button"
                  variant={method === "avalanche" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMethod("avalanche")}
                >
                  Avalanche
                </Button>
              </div>
            </div>
          </div>

          <Button type="submit">Calculate</Button>
        </form>

        {results && (
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-md border p-3">
                <p className="text-sm text-muted-foreground">Method</p>
                <p className="text-lg font-semibold capitalize">
                  {results.method}
                </p>
              </div>
              <div className="rounded-md border p-3">
                <p className="text-sm text-muted-foreground">Total Months</p>
                <p className="text-lg font-semibold">{results.totalMonths}</p>
              </div>
              <div className="rounded-md border p-3">
                <p className="text-sm text-muted-foreground">Total Paid</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(results.totalPaid)}
                </p>
              </div>
              <div className="rounded-md border p-3">
                <p className="text-sm text-muted-foreground">Total Interest</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(results.totalInterest)}
                </p>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">Payoff Order</p>
              <ol className="list-inside list-decimal space-y-1 text-sm">
                {results.order.map((name, i) => (
                  <li key={i}>{name}</li>
                ))}
              </ol>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  {results.schedule[0]?.payments.map((p) => (
                    <TableHead key={p.name}>{p.name}</TableHead>
                  ))}
                  <TableHead>Total Remaining</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.schedule
                  .filter(
                    (row, i) =>
                      i < 12 ||
                      i === results.schedule.length - 1 ||
                      row.totalRemaining === 0
                  )
                  .map((row) => (
                    <TableRow key={row.month}>
                      <TableCell>{row.month}</TableCell>
                      {row.payments.map((p) => (
                        <TableCell key={p.name}>
                          {formatCurrency(p.remaining)}
                        </TableCell>
                      ))}
                      <TableCell>
                        {formatCurrency(row.totalRemaining)}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
