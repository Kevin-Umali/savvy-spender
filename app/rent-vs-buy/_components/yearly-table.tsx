"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/client";
import { toRealPesos } from "../_lib/compute";
import type { RentVsBuyResult } from "../_lib/types";

interface Props {
  result: RentVsBuyResult;
  realPesos: boolean;
}

export const YearlyTable: React.FC<Props> = ({ result, realPesos }) => {
  const inflation = result.input.costInflationPct;
  const fmt = (v: number, year: number) =>
    formatCurrency(realPesos ? toRealPesos(v, year, inflation) : v);

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <p className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-muted-foreground opacity-60">
          Year-by-year
        </p>
        <CardTitle className="font-display font-light text-xl tracking-tight mt-0.5">
          The full breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                {["Yr", "Property value", "Loan balance", "Buy equity", "Own / yr", "Rent / yr", "Buy net worth", "Rent net worth", "Gap"].map(
                  (h, i) => (
                    <th
                      key={h}
                      className={cn(
                        "font-mono-label text-[10px] uppercase tracking-[0.14em] text-muted-foreground opacity-60 py-2 px-2.5 whitespace-nowrap",
                        i === 0 ? "text-left" : "text-right"
                      )}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {result.rows.map((row) => {
                const isBreakEven = row.year === result.breakEvenYear;
                return (
                  <tr
                    key={row.year}
                    className={cn(
                      "border-b last:border-0",
                      isBreakEven && "bg-emerald-50/50 dark:bg-emerald-950/20"
                    )}
                  >
                    <td className="py-1.5 px-2.5 tabular-nums font-medium">{row.year}</td>
                    <Num>{fmt(row.propertyValue, row.year)}</Num>
                    <Num>{fmt(row.loanBalance, row.year)}</Num>
                    <Num>{fmt(row.buyEquity, row.year)}</Num>
                    <Num muted>{fmt(row.ownAnnualCost, row.year)}</Num>
                    <Num muted>{fmt(row.rentAnnual, row.year)}</Num>
                    <Num className="text-emerald-700 dark:text-emerald-400">
                      {fmt(row.buyNetWorth, row.year)}
                    </Num>
                    <Num className="text-sky-700 dark:text-sky-400">
                      {fmt(row.rentNetWorth, row.year)}
                    </Num>
                    <Num strong>{fmt(row.netWorthGap, row.year)}</Num>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

interface NumProps {
  children: React.ReactNode;
  strong?: boolean;
  muted?: boolean;
  className?: string;
}

const Num: React.FC<NumProps> = ({ children, strong, muted, className }) => {
  return (
    <td
      className={cn(
        "py-1.5 px-2.5 text-right tabular-nums whitespace-nowrap",
        strong && "font-semibold",
        muted && "text-muted-foreground",
        className
      )}
    >
      {children}
    </td>
  );
};
