"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { formatCurrency } from "@/lib/client";

interface CostPieChartProps {
  principal: number;
  interest: number;
  fees: number;
}

const COLORS = ["hsl(221, 83%, 53%)", "hsl(30, 80%, 55%)", "hsl(0, 75%, 55%)"];

export default function CostPieChart({ principal, interest, fees }: CostPieChartProps) {
  const data = [
    { name: "Principal", value: principal },
    { name: "Interest", value: interest },
    ...(fees > 0 ? [{ name: "Fees", value: fees }] : []),
  ];

  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
            label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
          >
            {data.map((_, index) => (
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
