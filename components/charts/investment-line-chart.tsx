"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { formatCurrency } from "@/lib/client";
import type { InvestmentResult } from "@/lib/calculators";

interface InvestmentLineChartProps {
  data: InvestmentResult;
}

export default function InvestmentLineChart({ data }: InvestmentLineChartProps) {
  const chartData = data.yearlyBreakdown.map((row) => ({
    year: `Year ${row.year}`,
    Balance: Math.round(row.balance),
    Contributed: Math.round(row.contributed),
    Returns: Math.round(row.returns),
  }));

  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <defs>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorContributed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(160, 60%, 45%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(160, 60%, 45%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="year" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
          <YAxis
            tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}K`}
            tick={{ fontSize: 11 }}
            stroke="hsl(var(--muted-foreground))"
          />
          <Tooltip
            formatter={(value) => formatCurrency(Number(value))}
            contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="Balance"
            stroke="hsl(221, 83%, 53%)"
            fill="url(#colorBalance)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="Contributed"
            stroke="hsl(160, 60%, 45%)"
            fill="url(#colorContributed)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
