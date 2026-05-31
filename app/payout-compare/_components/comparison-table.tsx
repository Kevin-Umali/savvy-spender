"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/client";
import { CategoryBadge } from "./category-badge";
import { PAYOUT_PLATFORMS } from "../_lib/data";
import { computeNet } from "../_lib/compute";

export function ComparisonTable({
  selectedCurrency,
  amount,
  phpPerUnit,
}: {
  selectedCurrency: string;
  amount: number;
  phpPerUnit: number | null;
}) {
  const rows = useMemo(() => {
    if (!phpPerUnit || !amount) {
      return [...PAYOUT_PLATFORMS]
        .sort((a, b) => a.fxMarkupPct - b.fxMarkupPct)
        .map((p) => ({ platform: p, result: null }));
    }
    return PAYOUT_PLATFORMS.map((p) => ({ platform: p, result: computeNet(p, amount, phpPerUnit) }))
      .sort((a, b) => b.result.netPhp - a.result.netPhp);
  }, [amount, phpPerUnit]);

  const live = Boolean(phpPerUnit && amount);

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <p className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-muted-foreground opacity-60">
              Payout Comparison
            </p>
            <CardTitle className="font-display font-light text-xl tracking-tight mt-0.5">
              {live
                ? `${selectedCurrency} ${amount.toLocaleString()} → PHP in hand`
                : "Fees by platform"}
            </CardTitle>
            <p className="text-[12px] text-muted-foreground mt-1">
              {live
                ? "Sorted by net pesos received — most money first."
                : "Enter a payout amount on the left to see net PHP per platform."}
            </p>
          </div>
          <span className="inline-flex items-center gap-1 font-mono-label text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            most pesos
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {/* Mobile: stacked cards */}
        <div className="md:hidden space-y-2">
          {rows.map(({ platform, result }, i) => {
            const isBest = live && i === 0;
            return (
              <div
                key={platform.name}
                className={cn(
                  "rounded-md border p-3",
                  isBest ? "border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/20" : "border-border"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-sm">
                      {platform.name}
                      {isBest && (
                        <Badge className="ml-2 bg-emerald-600 hover:bg-emerald-600 font-mono-label text-[9px] uppercase tracking-[0.12em]">
                          Best
                        </Badge>
                      )}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <CategoryBadge category={platform.category} />
                      <span className="text-[11px] text-muted-foreground">{platform.payoutSpeed}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    {result ? (
                      <>
                        <p className="text-sm font-medium tabular-nums">{formatCurrency(result.netPhp)}</p>
                        <p className="text-[11px] text-muted-foreground tabular-nums">
                          {result.effectiveCostPct.toFixed(1)}% fee
                        </p>
                      </>
                    ) : (
                      <span className="text-[12px] text-muted-foreground tabular-nums">~{platform.fxMarkupPct}% FX</span>
                    )}
                  </div>
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground leading-relaxed">{platform.notes}</p>
                <SourceTags sources={platform.sources} />
              </div>
            );
          })}
        </div>

        {/* Desktop: table */}
        <div className="hidden md:block overflow-x-auto -mx-6 px-6">
          <Table>
            <TableHeader>
              <TableRow>
                <Th>Platform</Th>
                <Th>Type</Th>
                <Th>Speed</Th>
                <Th className="text-right">Total fee</Th>
                {live && <Th className="text-right">Net PHP</Th>}
                <Th>Notes</Th>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(({ platform, result }, i) => {
                const isBest = live && i === 0;
                return (
                  <TableRow
                    key={platform.name}
                    className={cn(isBest && "bg-emerald-50/50 dark:bg-emerald-950/20")}
                  >
                    <TableCell className="font-medium">
                      {platform.name}
                      {isBest && (
                        <Badge className="ml-2 bg-emerald-600 hover:bg-emerald-600 font-mono-label text-[9px] uppercase tracking-[0.12em]">
                          Best
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <CategoryBadge category={platform.category} />
                    </TableCell>
                    <TableCell className="text-[12px] text-muted-foreground whitespace-nowrap">
                      {platform.payoutSpeed}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {result ? (
                        <span className="text-sm">{result.effectiveCostPct.toFixed(1)}%</span>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          ~{platform.fxMarkupPct}% FX
                        </span>
                      )}
                    </TableCell>
                    {live && (
                      <TableCell className="text-right tabular-nums font-medium">
                        {result ? formatCurrency(result.netPhp) : "—"}
                      </TableCell>
                    )}
                    <TableCell className="text-[11px] text-muted-foreground max-w-[280px] leading-relaxed">
                      {platform.notes}
                      <SourceTags sources={platform.sources} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {live && rows[0]?.result && (
          <div className="mt-4 rounded-md border border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/20 p-3">
            <p className="text-sm">
              <span className="font-medium">{rows[0].platform.name}</span> nets you{" "}
              <span className="font-medium tabular-nums">
                {formatCurrency(rows[0].result.netPhp)}
              </span>{" "}
              — keeping {(100 - rows[0].result.effectiveCostPct).toFixed(1)}% of the mid-market value.
              {rows.length > 1 && rows[rows.length - 1].result && (
                <>
                  {" "}
                  That&apos;s{" "}
                  <span className="font-medium tabular-nums">
                    {formatCurrency(
                      rows[0].result.netPhp - rows[rows.length - 1].result!.netPhp
                    )}
                  </span>{" "}
                  more than the costliest option here — about{" "}
                  <span className="font-medium tabular-nums">
                    {formatCurrency((rows[0].result.netPhp - rows[rows.length - 1].result!.netPhp) * 12)}
                  </span>{" "}
                  a year if you&apos;re paid monthly.
                </>
              )}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const SourceTags: React.FC<{ sources?: string[] }> = ({ sources }) =>
  sources && sources.length ? (
    <span className="mt-1.5 flex flex-wrap gap-1">
      {sources.map((s) => (
        <span
          key={s}
          className="rounded-sm bg-muted px-1.5 py-0.5 font-mono-label text-[9px] uppercase tracking-[0.1em] text-muted-foreground"
        >
          {s}
        </span>
      ))}
    </span>
  ) : null;

const Th: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <TableHead
    className={cn(
      "font-mono-label text-[10px] uppercase tracking-[0.18em] text-muted-foreground opacity-60",
      className
    )}
  >
    {children}
  </TableHead>
);
