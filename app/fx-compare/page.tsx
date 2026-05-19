"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { CARD_FX_DATA, CARD_FX_DATA_REVIEWED, type CardFxEntry } from "@/constant/fx-data";
import type { FxRatesResponse } from "@/app/api/fx-rates/route";

/* ── Types ─────────────────────────────────────────────────────────── */

interface FxRateState {
  rates: Record<string, number> | null;
  currencies: { code: string; name: string }[];
  timestamp: string | null;
  source: string | null;
  error: string | null;
  loading: boolean;
}

/* ── Main Page ──────────────────────────────────────────────────────── */

export default function FxComparePage() {
  const [rateState, setRateState] = useState<FxRateState>({
    rates: null,
    currencies: [],
    timestamp: null,
    source: null,
    error: null,
    loading: true,
  });

  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [foreignAmount, setForeignAmount] = useState<number>(100);
  const [search, setSearch] = useState("");

  // Fetch rates once on mount
  useEffect(() => {
    fetch("/api/fx-rates")
      .then((r) => r.json())
      .then((data: FxRatesResponse & { error?: string }) => {
        if (data.error) {
          setRateState((s) => ({ ...s, error: data.error ?? "Unknown error", loading: false }));
        } else {
          setRateState({
            rates: data.rates,
            currencies: data.currencies,
            timestamp: data.timestamp,
            source: data.source,
            error: null,
            loading: false,
          });
        }
      })
      .catch(() => {
        setRateState((s) => ({ ...s, error: "Network error fetching FX rates.", loading: false }));
      });
  }, []);

  // Filtered + sorted currencies for the picker
  const filteredCurrencies = useMemo(
    () =>
      rateState.currencies.filter(
        (c) =>
          c.code.toLowerCase().includes(search.toLowerCase()) ||
          c.name.toLowerCase().includes(search.toLowerCase())
      ),
    [rateState.currencies, search]
  );

  // PHP per 1 unit of selected currency
  const phpPerUnit = useMemo(() => {
    if (!rateState.rates || !rateState.rates[selectedCurrency]) return null;
    return 1 / rateState.rates[selectedCurrency];
  }, [rateState.rates, selectedCurrency]);

  // Sorted bank rows
  const sortedData = useMemo(
    () => [...CARD_FX_DATA].sort((a, b) => a.fxMarkup - b.fxMarkup || a.issuer.localeCompare(b.issuer)),
    []
  );

  const computePhpCost = useCallback(
    (entry: CardFxEntry) => {
      if (!phpPerUnit || !foreignAmount) return null;
      return foreignAmount * phpPerUnit * (1 + entry.fxMarkup / 100);
    },
    [phpPerUnit, foreignAmount]
  );

  const currencyName = rateState.currencies.find((c) => c.code === selectedCurrency)?.name ?? selectedCurrency;

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
      {/* Page Header */}
      <div className="mb-8 max-w-3xl">
        <p className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-muted-foreground opacity-60 mb-2">
          Tool
        </p>
        <h1 className="font-display italic font-light text-3xl sm:text-4xl lg:text-5xl tracking-tight">
          Card FX Comparison
        </h1>
        <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
          See which PH credit card is cheapest to use abroad. Compare foreign transaction markups across
          major card issuers and simulate the PHP cost of any foreign purchase.
        </p>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-6 lg:gap-10">
        {/* Sidebar: controls */}
        <aside className="lg:sticky lg:top-20 lg:self-start space-y-5">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <p className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-muted-foreground opacity-60">
                Simulator
              </p>
              <CardTitle className="font-display italic font-light text-xl tracking-tight mt-0.5">
                Amount & Currency
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-muted-foreground opacity-60 mb-2 block">
                  Foreign Amount
                </Label>
                <Input
                  type="number"
                  min={0}
                  value={foreignAmount}
                  onChange={(e) => setForeignAmount(+e.target.value)}
                  placeholder="100"
                  className="tabular-nums"
                />
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  How much you plan to spend in the foreign currency.
                </p>
              </div>

              <div>
                <Label className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-muted-foreground opacity-60 mb-2 block">
                  Currency
                </Label>
                <Input
                  type="text"
                  placeholder="Search currency…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="mb-1.5"
                />
                <div className="border rounded-sm max-h-48 overflow-y-auto">
                  {rateState.loading ? (
                    <div className="px-3 py-4 text-center text-[12px] text-muted-foreground">
                      Loading currencies…
                    </div>
                  ) : rateState.error ? (
                    <div className="px-3 py-4 text-center text-[12px] text-red-600 dark:text-red-400">
                      {rateState.error}
                    </div>
                  ) : (
                    filteredCurrencies.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => { setSelectedCurrency(c.code); setSearch(""); }}
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

              {/* Rate info */}
              {phpPerUnit && (
                <div className="rounded-sm border bg-muted/20 px-3 py-2.5 space-y-1">
                  <p className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-muted-foreground opacity-60">
                    Reference Rate
                  </p>
                  <p className="tabular-nums text-sm font-medium">
                    1 {selectedCurrency} ≈ ₱{phpPerUnit.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Before any bank markup · {rateState.source ?? "—"} · updated {rateState.timestamp ? new Date(rateState.timestamp).toLocaleDateString() : "—"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="rounded-sm border border-dashed p-4 text-[11px] text-muted-foreground leading-relaxed space-y-2">
            <p className="font-mono-label text-[10px] uppercase tracking-[0.2em] opacity-60">Disclaimer</p>
            <p>
              Bank markups are sourced from publicly available fee schedules and may change. The reference rate used here
              is from an open FX API (not a bank rate). Final PHP amount may differ from your actual billing.
            </p>
            <p>
              Visa adds a ~1% cross-border assessment and Mastercard ~0.2%, typically bundled into the bank&apos;s quoted markup.
              Always verify with your card issuer before travel.
            </p>
            <p className="border-t pt-2 text-[10px] opacity-60">
              Bank markup data last reviewed: {CARD_FX_DATA_REVIEWED}. Sources: bank fee schedules, cardholder agreements, BSP filings.
            </p>
          </div>
        </aside>

        {/* Main: table */}
        <section className="min-w-0">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <p className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-muted-foreground opacity-60">
                    Card Comparison
                  </p>
                  <CardTitle className="font-display italic font-light text-xl tracking-tight mt-0.5">
                    {foreignAmount > 0 && phpPerUnit
                      ? `${selectedCurrency} ${foreignAmount.toLocaleString()} → PHP`
                      : "FX Markup by Issuer"}
                  </CardTitle>
                  <p className="text-[12px] text-muted-foreground mt-1">
                    Sorted cheapest first.{" "}
                    {phpPerUnit
                      ? `Showing PHP cost of ${selectedCurrency} ${foreignAmount} per card.`
                      : "Enter an amount on the left to see PHP costs."}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 font-mono-label text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    0% markup
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono-label text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-border" />
                    standard
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto -mx-6 px-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-mono-label text-[10px] uppercase tracking-[0.18em] text-muted-foreground opacity-60">
                        Issuer
                      </TableHead>
                      <TableHead className="font-mono-label text-[10px] uppercase tracking-[0.18em] text-muted-foreground opacity-60">
                        Card
                      </TableHead>
                      <TableHead className="font-mono-label text-[10px] uppercase tracking-[0.18em] text-muted-foreground opacity-60">
                        Network
                      </TableHead>
                      <TableHead className="font-mono-label text-[10px] uppercase tracking-[0.18em] text-muted-foreground opacity-60 text-right">
                        FX Markup
                      </TableHead>
                      {phpPerUnit && foreignAmount > 0 && (
                        <TableHead className="font-mono-label text-[10px] uppercase tracking-[0.18em] text-muted-foreground opacity-60 text-right">
                          You Pay (PHP)
                        </TableHead>
                      )}
                      <TableHead className="font-mono-label text-[10px] uppercase tracking-[0.18em] text-muted-foreground opacity-60">
                        Notes
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedData.map((entry, i) => {
                      const phpCost = computePhpCost(entry);
                      return (
                        <TableRow
                          key={i}
                          className={cn(
                            entry.hasZeroMarkup && "bg-emerald-50/50 dark:bg-emerald-950/20"
                          )}
                        >
                          <TableCell className="font-medium">
                            {entry.issuer}
                          </TableCell>
                          <TableCell className="text-[12px] text-muted-foreground max-w-[160px]">
                            {entry.card}
                          </TableCell>
                          <TableCell>
                            <NetworkBadge network={entry.network} />
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {entry.hasZeroMarkup ? (
                              <Badge
                                variant="outline"
                                className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900 font-mono-label text-[9px] uppercase tracking-[0.12em]"
                              >
                                0% — Free
                              </Badge>
                            ) : (
                              <span className="text-sm">{entry.fxMarkup.toFixed(1)}%</span>
                            )}
                          </TableCell>
                          {phpPerUnit && foreignAmount > 0 && (
                            <TableCell className="text-right tabular-nums font-medium">
                              {phpCost !== null
                                ? `₱${phpCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                : "—"}
                            </TableCell>
                          )}
                          <TableCell className="text-[11px] text-muted-foreground max-w-[220px] leading-relaxed">
                            {entry.notes}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {phpPerUnit && foreignAmount > 0 && (
                <div className="mt-5 rounded-sm border bg-muted/20 p-4">
                  <p className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-muted-foreground opacity-60 mb-2">
                    PHP Cost Summary · {foreignAmount} {currencyName}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <p className="text-[11px] text-muted-foreground">Base rate (no markup)</p>
                      <p className="tabular-nums font-semibold">
                        ₱{(foreignAmount * phpPerUnit).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground">With 2% markup (typical)</p>
                      <p className="tabular-nums font-semibold">
                        ₱{(foreignAmount * phpPerUnit * 1.02).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-400">Savings with 0% card</p>
                      <p className="tabular-nums font-semibold text-emerald-700 dark:text-emerald-400">
                        ₱{(foreignAmount * phpPerUnit * 0.02).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} saved
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}

/* ── Small helpers ───────────────────────────────────────────────────── */

const NETWORK_COLORS: Record<string, string> = {
  Visa: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900",
  Mastercard: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-900",
  Amex: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-900",
  Diners: "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  JCB: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-300 dark:border-green-900",
  UnionPay: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900",
};

function NetworkBadge({ network }: { network: string }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-mono-label text-[9px] uppercase tracking-[0.12em] px-1.5 py-0 font-normal",
        NETWORK_COLORS[network] ?? "bg-muted text-muted-foreground border-border"
      )}
    >
      {network}
    </Badge>
  );
}
