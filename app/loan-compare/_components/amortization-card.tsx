"use client";

import { useMemo, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon, DownloadIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/client";
import { downloadCsv } from "@/lib/csv";
import type { OptionResult } from "../_lib/types";

/**
 * Scheduled-payment timeline for one option. Mode-agnostic: it shows the fixed
 * monthly payment, the running total paid, and the remaining scheduled balance
 * (total repayment − paid so far) — accurate regardless of the rate mode used.
 */
export const AmortizationCard: React.FC<{ result: OptionResult }> = ({ result }) => {
  const [open, setOpen] = useState(false);

  const rows = useMemo(() => {
    const payment = result.monthlyPayment;
    const total = result.totalLoanPayments;
    const out: { month: number; payment: number; paid: number; remaining: number }[] = [];
    for (let m = 1; m <= result.termMonths; m++) {
      const paid = payment * m;
      out.push({
        month: m,
        payment,
        paid,
        remaining: m === result.termMonths ? 0 : Math.max(0, total - paid),
      });
    }
    return out;
  }, [result.monthlyPayment, result.totalLoanPayments, result.termMonths]);

  const exportCsv = () => {
    downloadCsv(
      `payment-schedule-${result.name || "option"}`,
      ["Month", "Payment", "Total paid", "Remaining"],
      rows.map((r) => [r.month, r.payment.toFixed(2), r.paid.toFixed(2), r.remaining.toFixed(2)])
    );
  };

  if (rows.length === 0) return null;

  return (
    <Card className="border-border">
      <CardHeader className="cursor-pointer pb-3" onClick={() => setOpen((o) => !o)} role="button" aria-expanded={open}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-muted-foreground opacity-60">
              Payment schedule
            </p>
            <CardTitle className="font-display font-light text-xl tracking-tight mt-0.5">{result.name}</CardTitle>
            <CardDescription className="text-[12px] mt-1">
              <span className="tabular-nums">{result.termMonths}</span> months ·{" "}
              {formatCurrency(result.monthlyPayment)}/mo (lowest-total option)
            </CardDescription>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 font-mono-label text-[10px] uppercase tracking-[0.12em]"
              aria-label="Download payment schedule as CSV"
              onClick={(e) => {
                e.stopPropagation();
                exportCsv();
              }}
            >
              <DownloadIcon className="h-3.5 w-3.5" />
              CSV
            </Button>
            <Button variant="ghost" size="icon" aria-label={open ? "Collapse" : "Expand"}>
              {open ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      {open && (
        <CardContent>
          <div className="max-h-[420px] overflow-y-auto -mx-6 px-6 border-t">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-card z-10">
                <tr className="border-b">
                  {["Month", "Payment", "Total paid", "Remaining"].map((h, i) => (
                    <th
                      key={h}
                      className={`font-mono-label text-[10px] uppercase tracking-[0.18em] text-muted-foreground opacity-60 py-2 px-3 ${
                        i === 0 ? "text-left" : "text-right"
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.month} className="border-b last:border-0">
                    <td className="py-1.5 px-3 tabular-nums font-medium">{r.month}</td>
                    <td className="py-1.5 px-3 text-right tabular-nums">{formatCurrency(r.payment)}</td>
                    <td className="py-1.5 px-3 text-right tabular-nums text-muted-foreground">{formatCurrency(r.paid)}</td>
                    <td className="py-1.5 px-3 text-right tabular-nums">{formatCurrency(r.remaining)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-muted-foreground/80 mt-3 leading-relaxed">
            Shows the scheduled monthly payment and what remains of total repayment. Early settlement
            usually requires the outstanding principal plus any pre-termination fee — confirm the payoff
            figure with the lender, as add-on interest is often not waived.
          </p>
        </CardContent>
      )}
    </Card>
  );
};
