"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/client";
import { AllInstallmentOption } from "@/interfaces";
import CostPieChart from "@/components/charts/cost-pie-chart";
import { cn } from "@/lib/utils";

interface CostBreakdownProps {
  calculatedData: AllInstallmentOption | undefined;
  amount: number;
}

const CostBreakdown: React.FC<CostBreakdownProps> = ({ calculatedData, amount }) => {
  if (!calculatedData?.selected) return null;

  const principal = amount;
  const interest = +calculatedData.selected.interest;
  const totalFees =
    (calculatedData.dst ?? 0) + (calculatedData.selected.processingFee ? +calculatedData.selected.processingFee : 0);
  const totalPayment = +calculatedData.selected.totalPayment;

  const principalWidth = totalPayment > 0 ? (principal / totalPayment) * 100 : 0;
  const interestWidth = totalPayment > 0 ? (interest / totalPayment) * 100 : 0;
  const feesWidth = totalPayment > 0 ? (totalFees / totalPayment) * 100 : 0;

  const isPersonalLoan = calculatedData.calculatorType === "personal-loan";

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <p className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-muted-foreground opacity-60">
          Where it goes
        </p>
        <CardTitle className="font-display font-light text-xl tracking-tight mt-0.5">
          Cost Breakdown
        </CardTitle>
        <CardDescription className="text-[12px]">
          Principal, interest, and fees as a share of total payable.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-6 items-center">
          <CostPieChart principal={principal} interest={interest} fees={totalFees} />

          <div className="space-y-3">
            <div className="flex rounded-sm overflow-hidden h-3 border">
              <div
                className="bg-foreground/85 transition-all"
                style={{ width: `${principalWidth}%` }}
                title={`Principal: ${formatCurrency(principal)}`}
              />
              <div
                className="bg-orange-500/80 transition-all"
                style={{ width: `${interestWidth}%` }}
                title={`Interest: ${formatCurrency(interest)}`}
              />
              {feesWidth > 0 && (
                <div
                  className="bg-red-500/80 transition-all"
                  style={{ width: `${feesWidth}%` }}
                  title={`Fees: ${formatCurrency(totalFees)}`}
                />
              )}
            </div>

            <dl className="space-y-2.5">
              <Row
                tone="primary"
                label="Principal"
                value={formatCurrency(principal)}
                pct={principalWidth}
              />
              <Row
                tone="warning"
                label="Interest"
                value={formatCurrency(interest)}
                pct={interestWidth}
              />
              {totalFees > 0 && (
                <Row
                  tone="danger"
                  label={isPersonalLoan && calculatedData.dst ? `Fees (incl. DST ${formatCurrency(calculatedData.dst)})` : "Fees"}
                  value={formatCurrency(totalFees)}
                  pct={feesWidth}
                />
              )}
              <Row
                tone="total"
                label="Total payable"
                value={formatCurrency(totalPayment)}
                pct={100}
                isTotal
              />
            </dl>
          </div>
        </div>

        {/* Net proceeds for personal loan */}
        {isPersonalLoan && calculatedData.netProceeds !== undefined && (
          <div className="rounded-sm border bg-muted/30 px-4 py-3 flex items-baseline justify-between gap-3 flex-wrap">
            <div>
              <p className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-muted-foreground opacity-60">
                You receive
              </p>
              <p className="font-display font-light text-2xl tabular-nums">
                {formatCurrency(calculatedData.netProceeds)}
              </p>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed max-w-xs text-right">
              But pay back{" "}
              <span className="tabular-nums font-medium text-foreground">{formatCurrency(totalPayment)}</span> — a{" "}
              <span className="tabular-nums font-medium text-foreground">
                {formatCurrency(totalPayment - calculatedData.netProceeds)}
              </span>{" "}
              difference.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const TONE_DOT: Record<string, string> = {
  primary: "bg-foreground/85",
  warning: "bg-orange-500/80",
  danger: "bg-red-500/80",
  total: "border border-foreground/30",
};

const Row: React.FC<{
  tone: "primary" | "warning" | "danger" | "total";
  label: string;
  value: string;
  pct: number;
  isTotal?: boolean;
}> = ({ tone, label, value, pct, isTotal }) => (
  <div
    className={cn(
      "flex items-baseline justify-between gap-3",
      isTotal && "border-t pt-2.5 mt-1"
    )}
  >
    <div className="flex items-center gap-2 min-w-0">
      <span className={cn("h-2 w-2 rounded-full shrink-0", TONE_DOT[tone])} />
      <span className={cn("text-[12px]", isTotal ? "font-medium" : "text-muted-foreground")}>{label}</span>
    </div>
    <div className="flex items-baseline gap-2 tabular-nums">
      <span className="text-[11px] text-muted-foreground/70">{pct.toFixed(0)}%</span>
      <span className={cn(isTotal ? "font-semibold text-base" : "text-sm")}>{value}</span>
    </div>
  </div>
);

export default CostBreakdown;
