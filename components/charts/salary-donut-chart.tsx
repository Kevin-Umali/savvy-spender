"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { formatCurrency } from "@/lib/client";
import type { SalaryBreakdown } from "@/lib/calculators";

interface SalaryDonutChartProps {
  data: SalaryBreakdown;
}

const COLORS = [
  "hsl(160, 60%, 45%)",
  "hsl(221, 83%, 53%)",
  "hsl(30, 80%, 55%)",
  "hsl(280, 65%, 60%)",
  "hsl(0, 75%, 55%)",
];

export default function SalaryDonutChart({ data }: SalaryDonutChartProps) {
  const chartData = [
    { name: "Take-Home Pay", value: Math.max(0, data.netTakeHome) },
    { name: "SSS", value: data.sss },
    { name: "PhilHealth", value: data.philHealth },
    { name: "Pag-IBIG", value: data.pagIbig },
    { name: "Tax", value: Math.max(0, data.withholdingTax) },
  ];

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={95}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => formatCurrency(Number(value))}
            contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
