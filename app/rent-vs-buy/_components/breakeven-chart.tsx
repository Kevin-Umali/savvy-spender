"use client";

import { useMemo } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/client";
import { toRealPesos } from "../_lib/compute";
import type { MonteCarloResult, RentVsBuyResult } from "../_lib/types";

interface Props {
  result: RentVsBuyResult;
  mc: MonteCarloResult;
  realPesos: boolean;
}

const compact = (n: number): string => {
  const abs = Math.abs(n);
  const sign = n < 0 ? "−" : "";
  if (abs >= 1e6) return `${sign}₱${(abs / 1e6).toFixed(1)}M`;
  if (abs >= 1e3) return `${sign}₱${(abs / 1e3).toFixed(0)}k`;
  return `${sign}₱${abs.toFixed(0)}`;
};

/**
 * The net-worth advantage of buying over renting, year by year. The line is the
 * point estimate; the shaded fan is the P10–P90 range across ~2,000 Monte-Carlo
 * scenarios. Buying breaks even where the line crosses zero.
 */
export function BreakevenChart({ result, mc, realPesos }: Props) {
  const inflation = result.input.costInflationPct;

  const data = useMemo(() => {
    const adj = (v: number, year: number) => (realPesos ? toRealPesos(v, year, inflation) : v);
    return result.rows.map((row, i) => {
      const band = mc.bands[i];
      const p10 = adj(band?.p10 ?? row.netWorthGap, row.year);
      const p90 = adj(band?.p90 ?? row.netWorthGap, row.year);
      return {
        year: row.year,
        gap: adj(row.netWorthGap, row.year),
        p10,
        span: Math.max(0, p90 - p10),
        p50: adj(band?.p50 ?? row.netWorthGap, row.year),
      };
    });
  }, [result.rows, mc.bands, realPesos, inflation]);

  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <p className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-muted-foreground opacity-60">
          Break-even chart
        </p>
        <CardTitle className="font-display font-light text-xl tracking-tight mt-0.5">
          Buying&apos;s net-worth advantage over time
        </CardTitle>
        <p className="text-[12px] text-muted-foreground mt-1">
          Above the line = buying is ahead. Shaded band spans the P10–P90 range across{" "}
          {mc.runs.toLocaleString()} scenarios.
        </p>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 8, right: 8, left: 4, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 11 }}
                stroke="hsl(var(--muted-foreground))"
                label={{ value: "Year", position: "insideBottom", offset: -2, fontSize: 11 }}
              />
              <YAxis
                tickFormatter={compact}
                tick={{ fontSize: 11 }}
                stroke="hsl(var(--muted-foreground))"
                width={56}
              />
              <Tooltip
                formatter={(value, name) =>
                  name === "Advantage" || name === "Median"
                    ? [formatCurrency(Number(value)), String(name)]
                    : null
                }
                labelFormatter={(y) => `Year ${y}`}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid hsl(var(--border))",
                  background: "hsl(var(--card))",
                  fontSize: "12px",
                }}
              />
              {/* P10–P90 fan: invisible base + visible span */}
              <Area
                dataKey="p10"
                stackId="band"
                stroke="none"
                fill="none"
                isAnimationActive={false}
                legendType="none"
                name="_base"
              />
              <Area
                dataKey="span"
                stackId="band"
                stroke="none"
                fill="hsl(221, 83%, 53%)"
                fillOpacity={0.12}
                isAnimationActive={false}
                legendType="none"
                name="_span"
              />
              <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="4 4" />
              {result.breakEvenYear && (
                <ReferenceLine
                  x={result.breakEvenYear}
                  stroke="hsl(142, 71%, 45%)"
                  strokeDasharray="4 4"
                  label={{
                    value: `break-even ·  yr ${result.breakEvenYear}`,
                    fontSize: 10,
                    fill: "hsl(142, 71%, 45%)",
                    position: "top",
                  }}
                />
              )}
              <Line
                type="monotone"
                dataKey="p50"
                stroke="hsl(221, 83%, 53%)"
                strokeWidth={1}
                strokeDasharray="3 3"
                dot={false}
                isAnimationActive={false}
                name="Median"
              />
              <Line
                type="monotone"
                dataKey="gap"
                stroke="hsl(221, 83%, 53%)"
                strokeWidth={2.5}
                dot={false}
                isAnimationActive={false}
                name="Advantage"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
