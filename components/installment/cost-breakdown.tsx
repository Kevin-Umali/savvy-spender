import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/client";
import { AllInstallmentOption } from "@/interfaces";

interface CostBreakdownProps {
  calculatedData: AllInstallmentOption | undefined;
  amount: number;
}

const CostBreakdown: React.FC<CostBreakdownProps> = ({ calculatedData, amount }) => {
  if (!calculatedData?.selected) return null;

  const principal = amount;
  const interest = +calculatedData.selected.interest;
  const totalFees = (calculatedData.dst ?? 0) + (calculatedData.selected.processingFee ? +calculatedData.selected.processingFee : 0);
  const totalPayment = +calculatedData.selected.totalPayment;

  const interestPercent = principal > 0 ? ((interest / principal) * 100).toFixed(1) : "0";
  const feesPercent = principal > 0 ? ((totalFees / principal) * 100).toFixed(1) : "0";

  const principalWidth = totalPayment > 0 ? (principal / totalPayment) * 100 : 0;
  const interestWidth = totalPayment > 0 ? (interest / totalPayment) * 100 : 0;
  const feesWidth = totalPayment > 0 ? (totalFees / totalPayment) * 100 : 0;

  const isPersonalLoan = calculatedData.calculatorType === "personal-loan";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost Breakdown</CardTitle>
        <CardDescription>
          See exactly where your money goes — principal, interest, and fees.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Visual bar */}
        <div className="space-y-2">
          <div className="flex rounded-full overflow-hidden h-4">
            <div
              className="bg-primary transition-all"
              style={{ width: `${principalWidth}%` }}
              title={`Principal: ${formatCurrency(principal)}`}
            />
            <div
              className="bg-orange-400 dark:bg-orange-500 transition-all"
              style={{ width: `${interestWidth}%` }}
              title={`Interest: ${formatCurrency(interest)}`}
            />
            {feesWidth > 0 && (
              <div
                className="bg-red-400 dark:bg-red-500 transition-all"
                style={{ width: `${feesWidth}%` }}
                title={`Fees: ${formatCurrency(totalFees)}`}
              />
            )}
          </div>
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-primary" />
              <span>Principal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-orange-400 dark:bg-orange-500" />
              <span>Interest</span>
            </div>
            {totalFees > 0 && (
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400 dark:bg-red-500" />
                <span>Fees</span>
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg border p-3">
            <Label className="text-xs text-muted-foreground">Principal</Label>
            <p className="text-lg font-semibold">{formatCurrency(principal)}</p>
          </div>
          <div className="rounded-lg border p-3">
            <Label className="text-xs text-muted-foreground">Total Interest ({interestPercent}% of principal)</Label>
            <p className="text-lg font-semibold text-orange-600 dark:text-orange-400">{formatCurrency(interest)}</p>
          </div>
          {totalFees > 0 && (
            <div className="rounded-lg border p-3">
              <Label className="text-xs text-muted-foreground">
                Fees ({feesPercent}% of principal)
                {isPersonalLoan && calculatedData.dst ? ` — incl. DST ${formatCurrency(calculatedData.dst)}` : ""}
              </Label>
              <p className="text-lg font-semibold text-red-600 dark:text-red-400">{formatCurrency(totalFees)}</p>
            </div>
          )}
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
            <Label className="text-xs text-muted-foreground">Total Amount Payable</Label>
            <p className="text-lg font-bold text-primary">{formatCurrency(totalPayment)}</p>
          </div>
        </div>

        {/* Net proceeds for personal loan */}
        {isPersonalLoan && calculatedData.netProceeds !== undefined && (
          <div className="rounded-lg border border-dashed p-3 text-center">
            <Label className="text-xs text-muted-foreground">You receive (Net Proceeds)</Label>
            <p className="text-xl font-bold text-primary">{formatCurrency(calculatedData.netProceeds)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              But you pay back {formatCurrency(totalPayment)} — that&apos;s {formatCurrency(totalPayment - calculatedData.netProceeds)} more than you received.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CostBreakdown;
