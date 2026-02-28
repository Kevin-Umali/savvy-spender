"use client";

import { useReducer, useCallback } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UpdateIcon } from "@radix-ui/react-icons";
import { useToolCalculator } from "@/hooks/use-tool-calculator";
import type { DebtPayoffResult } from "@/lib/calculators";
import { formatCurrency } from "@/lib/client";

interface DebtFormItem {
  id: string;
  name: string;
  balance: string;
  monthlyRate: string;
  minimumPayment: string;
}

const createDebt = (): DebtFormItem => ({
  id: crypto.randomUUID(),
  name: "",
  balance: "",
  monthlyRate: "",
  minimumPayment: "",
});

interface FormState {
  debts: DebtFormItem[];
  extraPayment: string;
  method: "snowball" | "avalanche";
}

type FormAction =
  | { type: "SET_FIELD"; field: "extraPayment"; value: string }
  | { type: "SET_METHOD"; value: "snowball" | "avalanche" }
  | { type: "UPDATE_DEBT"; id: string; field: keyof Omit<DebtFormItem, "id">; value: string }
  | { type: "ADD_DEBT" }
  | { type: "REMOVE_DEBT"; id: string }
  | { type: "RESET" };

const initialState: FormState = {
  debts: [createDebt()],
  extraPayment: "",
  method: "snowball",
};

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_METHOD":
      return { ...state, method: action.value };
    case "UPDATE_DEBT":
      return {
        ...state,
        debts: state.debts.map((d) =>
          d.id === action.id ? { ...d, [action.field]: action.value } : d
        ),
      };
    case "ADD_DEBT":
      return { ...state, debts: [...state.debts, createDebt()] };
    case "REMOVE_DEBT":
      return { ...state, debts: state.debts.filter((d) => d.id !== action.id) };
    case "RESET":
      return { ...initialState, debts: [createDebt()] };
  }
}

export default function DebtPlanner() {
  const [form, dispatch] = useReducer(formReducer, initialState);
  const {
    data: results,
    isLoading,
    error,
    calculate,
  } = useToolCalculator<DebtPayoffResult>("debt-planner");

  const handleCalculate = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const debts = form.debts
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

      if (debts.length === 0) return;

      await calculate({
        debts,
        extraPayment: parseFloat(form.extraPayment) || 0,
        method: form.method,
      });
    },
    [form, calculate]
  );

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
            {form.debts.map((debt) => (
              <div
                key={debt.id}
                className="grid grid-cols-1 gap-3 rounded-md border p-3 sm:grid-cols-5"
              >
                <div className="space-y-2">
                  <Label htmlFor={`debt-name-${debt.id}`} className="font-mono-label text-[10px] uppercase tracking-[0.15em]">Debt Name</Label>
                  <Input
                    id={`debt-name-${debt.id}`}
                    type="text"
                    placeholder="e.g. Credit Card"
                    value={debt.name}
                    onChange={(e) =>
                      dispatch({
                        type: "UPDATE_DEBT",
                        id: debt.id,
                        field: "name",
                        value: e.target.value,
                      })
                    }
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    A label to identify this debt
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`debt-balance-${debt.id}`} className="font-mono-label text-[10px] uppercase tracking-[0.15em]">Balance</Label>
                  <Input
                    id={`debt-balance-${debt.id}`}
                    type="number"
                    placeholder="e.g. 50000"
                    value={debt.balance}
                    onChange={(e) =>
                      dispatch({
                        type: "UPDATE_DEBT",
                        id: debt.id,
                        field: "balance",
                        value: e.target.value,
                      })
                    }
                    required
                    min="0.01"
                    step="0.01"
                  />
                  <p className="text-xs text-muted-foreground">
                    Current outstanding balance
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`debt-rate-${debt.id}`} className="font-mono-label text-[10px] uppercase tracking-[0.15em]">
                    Monthly Rate (%)
                  </Label>
                  <Input
                    id={`debt-rate-${debt.id}`}
                    type="number"
                    placeholder="e.g. 2"
                    value={debt.monthlyRate}
                    onChange={(e) =>
                      dispatch({
                        type: "UPDATE_DEBT",
                        id: debt.id,
                        field: "monthlyRate",
                        value: e.target.value,
                      })
                    }
                    required
                    min="0"
                    max="100"
                    step="0.01"
                  />
                  <p className="text-xs text-muted-foreground">
                    Monthly interest rate applied to balance
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`debt-min-${debt.id}`} className="font-mono-label text-[10px] uppercase tracking-[0.15em]">Min. Payment</Label>
                  <Input
                    id={`debt-min-${debt.id}`}
                    type="number"
                    placeholder="e.g. 2000"
                    value={debt.minimumPayment}
                    onChange={(e) =>
                      dispatch({
                        type: "UPDATE_DEBT",
                        id: debt.id,
                        field: "minimumPayment",
                        value: e.target.value,
                      })
                    }
                    required
                    min="1"
                    step="0.01"
                  />
                  <p className="text-xs text-muted-foreground">
                    Required minimum monthly payment
                  </p>
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      dispatch({ type: "REMOVE_DEBT", id: debt.id })
                    }
                    disabled={form.debts.length <= 1}
                    aria-label={`Remove ${debt.name || "debt"}`}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => dispatch({ type: "ADD_DEBT" })}
          >
            + Add Debt
          </Button>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dp-extra" className="font-mono-label text-[10px] uppercase tracking-[0.15em]">Extra Monthly Payment</Label>
              <Input
                id="dp-extra"
                type="number"
                placeholder="e.g. 1000"
                value={form.extraPayment}
                onChange={(e) =>
                  dispatch({
                    type: "SET_FIELD",
                    field: "extraPayment",
                    value: e.target.value,
                  })
                }
                min="0"
                step="0.01"
              />
              <p className="text-xs text-muted-foreground">
                Additional amount above minimums applied to priority debt
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dp-method" className="font-mono-label text-[10px] uppercase tracking-[0.15em]">Payoff Method</Label>
              <div id="dp-method" className="flex gap-2">
                <Button
                  type="button"
                  variant={form.method === "snowball" ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    dispatch({ type: "SET_METHOD", value: "snowball" })
                  }
                  aria-pressed={form.method === "snowball"}
                >
                  Snowball
                </Button>
                <Button
                  type="button"
                  variant={form.method === "avalanche" ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    dispatch({ type: "SET_METHOD", value: "avalanche" })
                  }
                  aria-pressed={form.method === "avalanche"}
                >
                  Avalanche
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Snowball pays smallest balance first for quick wins. Avalanche
                targets highest interest rate first to minimize total interest.
              </p>
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="font-mono-label uppercase tracking-[0.1em]">
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
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {results && (
          <div className="mt-6 space-y-4" aria-label="Debt payoff results">
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
                {results.order.map((name) => (
                  <li key={name}>{name}</li>
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
