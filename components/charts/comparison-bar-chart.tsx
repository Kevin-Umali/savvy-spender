"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { formatCurrency } from "@/lib/client";

interface ComparisonBarChartProps {
  data: Array<{
    label: string;
    valueA: number;
    valueB: number;
  }>;
  nameA: string;
  nameB: string;
  colorA?: string;
  colorB?: string;
}

export default function ComparisonBarChart({
  data,
  nameA,
  nameB,
  colorA = "hsl(221, 83%, 53%)",
  colorB = "hsl(30, 80%, 55%)",
}: ComparisonBarChartProps) {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
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
          <Bar dataKey="valueA" name={nameA} fill={colorA} radius={[4, 4, 0, 0]} />
          <Bar dataKey="valueB" name={nameB} fill={colorB} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
