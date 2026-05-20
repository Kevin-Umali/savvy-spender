"use client";

import { useCallback, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { CARD_FX_DATA, type CardFxEntry } from "../_lib/data";
import { NetworkBadge } from "./network-badge";
import { PhpCostSummary } from "./php-cost-summary";

export function ComparisonTable({
  selectedCurrency,
  foreignAmount,
  phpPerUnit,
  currencyName,
}: {
  selectedCurrency: string;
  foreignAmount: number;
  phpPerUnit: number | null;
  currencyName: string;
}) {
  const sortedData = useMemo(
    () =>
      [...CARD_FX_DATA].sort(
        (a, b) => a.fxMarkup - b.fxMarkup || a.issuer.localeCompare(b.issuer)
      ),
    []
  );

  const computePhpCost = useCallback(
    (entry: CardFxEntry) => {
      if (!phpPerUnit || !foreignAmount) return null;
      return foreignAmount * phpPerUnit * (1 + entry.fxMarkup / 100);
    },
    [phpPerUnit, foreignAmount]
  );

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <p className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-muted-foreground opacity-60">
              Card Comparison
            </p>
            <CardTitle className="font-display font-light text-xl tracking-tight mt-0.5">
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
                    className={cn(entry.hasZeroMarkup && "bg-emerald-50/50 dark:bg-emerald-950/20")}
                  >
                    <TableCell className="font-medium">{entry.issuer}</TableCell>
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
                          ? `₱${phpCost.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}`
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
          <PhpCostSummary
            foreignAmount={foreignAmount}
            currencyName={currencyName}
            phpPerUnit={phpPerUnit}
          />
        )}
      </CardContent>
    </Card>
  );
}
