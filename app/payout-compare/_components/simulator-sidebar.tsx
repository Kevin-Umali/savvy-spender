"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { FxRateState } from "@/lib/fx";

export function SimulatorSidebar({
  state,
  amount,
  setAmount,
  selectedCurrency,
  setSelectedCurrency,
  search,
  setSearch,
  phpPerUnit,
}: {
  state: FxRateState;
  amount: number;
  setAmount: (n: number) => void;
  selectedCurrency: string;
  setSelectedCurrency: (c: string) => void;
  search: string;
  setSearch: (v: string) => void;
  phpPerUnit: number | null;
}) {
  const filteredCurrencies = useMemo(
    () =>
      state.currencies.filter(
        (c) =>
          c.code.toLowerCase().includes(search.toLowerCase()) ||
          c.name.toLowerCase().includes(search.toLowerCase())
      ),
    [state.currencies, search]
  );

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <p className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-muted-foreground opacity-60">
          Simulator
        </p>
        <CardTitle className="font-display font-light text-xl tracking-tight mt-0.5">
          Payout &amp; Currency
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-muted-foreground opacity-60 mb-2 block">
            Payout amount
          </Label>
          <Input
            type="number"
            min={0}
            value={amount === 0 ? "" : amount}
            onChange={(e) => setAmount(+e.target.value || 0)}
            placeholder="1000"
            className="tabular-nums"
          />
          <p className="mt-1.5 text-[11px] text-muted-foreground">
            What the client pays you, in the source currency.
          </p>
        </div>

        <div>
          <Label className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-muted-foreground opacity-60 mb-2 block">
            Source currency
          </Label>
          <Input
            type="text"
            placeholder="Search currency…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-1.5"
          />
          <div className="border rounded-sm max-h-48 overflow-y-auto">
            {state.loading ? (
              <div className="px-3 py-4 text-center text-[12px] text-muted-foreground">
                Loading currencies…
              </div>
            ) : state.error ? (
              <div className="px-3 py-4 text-center text-[12px] text-red-600 dark:text-red-400">
                {state.error}
              </div>
            ) : (
              filteredCurrencies.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => {
                    setSelectedCurrency(c.code);
                    setSearch("");
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 text-left hover:bg-accent transition-colors border-b last:border-0",
                    selectedCurrency === c.code && "bg-accent"
                  )}
                >
                  <span className="font-mono-label text-[11px] font-medium">{c.code}</span>
                  <span className="text-[11px] text-muted-foreground truncate ml-2">{c.name}</span>
                </button>
              ))
            )}
          </div>
        </div>

        {phpPerUnit && (
          <div className="rounded-sm border bg-muted/20 px-3 py-2.5 space-y-1">
            <p className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-muted-foreground opacity-60">
              Mid-market rate
            </p>
            <p className="tabular-nums text-sm font-medium">
              1 {selectedCurrency} ≈ ₱
              {phpPerUnit.toLocaleString(undefined, {
                minimumFractionDigits: 4,
                maximumFractionDigits: 4,
              })}
            </p>
            <p className="text-[10px] text-muted-foreground">
              The ideal, fee-free rate · {state.source ?? "—"} · updated{" "}
              {state.timestamp ? new Date(state.timestamp).toLocaleDateString() : "—"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
