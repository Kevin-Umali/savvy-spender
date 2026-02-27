import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AllInstallmentOption, PaymentDifferences } from "@/interfaces";
import { formatCurrency, formatPercent } from "@/lib/client";

interface CardSelectedPlanProps {
  calculatedData: AllInstallmentOption | undefined;
  paymentDifferences: PaymentDifferences | undefined;
  isLoading?: boolean;
}

const Skeleton: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`animate-pulse bg-muted rounded ${className}`} />
);

const CardSelectedPlan: React.FC<CardSelectedPlanProps> = ({ calculatedData, paymentDifferences, isLoading = false }) => {
  const hasBudget = (calculatedData?.monthlyBudget ?? 0) > 0;
  const isBalanceConversion = calculatedData?.calculatorType === "balance-conversion";
  const isPersonalLoan = calculatedData?.calculatorType === "personal-loan";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Selected Installment Plan</CardTitle>
        <CardDescription>Details of the installment plan you selected.</CardDescription>
      </CardHeader>

      {isLoading ? (
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-5 w-32" />
              </div>
            ))}
          </div>
        </CardContent>
      ) : calculatedData?.selected ? (
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label className="font-mono-label text-[10px] uppercase tracking-[0.15em] text-muted-foreground opacity-60">Months</Label>
              <p className="text-sm font-semibold">{calculatedData.selected.months}</p>
            </div>
            <div>
              <Label className="font-mono-label text-[10px] uppercase tracking-[0.15em] text-muted-foreground opacity-60">Simple Interest</Label>
              <p className="text-sm font-semibold">{formatPercent(calculatedData.selected.simpleInterest)}</p>
            </div>
            <div>
              <Label className="font-mono-label text-[10px] uppercase tracking-[0.15em] text-muted-foreground opacity-60">Factor Rate</Label>
              <p className="text-sm font-semibold">{calculatedData.selected.factorRate}</p>
            </div>
            <div>
              <Label className="font-mono-label text-[10px] uppercase tracking-[0.15em] text-muted-foreground opacity-60">Effective Interest Rate PA</Label>
              <p className="text-sm font-semibold">{formatPercent(calculatedData.selected.eirPA)}</p>
            </div>
            <div>
              <Label className="font-mono-label text-[10px] uppercase tracking-[0.15em] text-muted-foreground opacity-60">Monthly Payment</Label>
              <p
                className={`text-sm font-semibold ${
                  hasBudget
                    ? +calculatedData.selected.monthlyPayment <= (calculatedData?.monthlyBudget ?? 0)
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                    : ""
                }`}
              >
                {formatCurrency(calculatedData.selected.monthlyPayment)}
                {hasBudget && (
                  <span className="text-xs font-normal ml-1">
                    {+calculatedData.selected.monthlyPayment <= (calculatedData?.monthlyBudget ?? 0)
                      ? "(within budget)"
                      : "(exceeds budget)"}
                  </span>
                )}
              </p>
            </div>
            <div>
              <Label className="font-mono-label text-[10px] uppercase tracking-[0.15em] text-muted-foreground opacity-60">Total Interest</Label>
              <p className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                {formatCurrency(calculatedData.selected.interest)}
              </p>
            </div>
            <div>
              <Label className="font-mono-label text-[10px] uppercase tracking-[0.15em] text-muted-foreground opacity-60">Total Payment (w/ fees)</Label>
              <p className="text-sm font-bold text-primary">{formatCurrency(calculatedData.selected.totalPayment)}</p>
            </div>
          </div>
        </CardContent>
      ) : null}

      {/* DST & Net Proceeds for Personal Loans */}
      {!isLoading && isPersonalLoan && calculatedData?.dst !== undefined && (
        <>
          <CardHeader>
            <CardTitle>Loan Disbursement Details</CardTitle>
            <CardDescription>Fees deducted from your loan amount before disbursement.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label className="font-mono-label text-[10px] uppercase tracking-[0.15em] text-muted-foreground opacity-60">Documentary Stamp Tax</Label>
                <p className="text-sm font-semibold">
                  {calculatedData.dst > 0 ? formatCurrency(calculatedData.dst) : "Exempt (≤ ₱250K)"}
                </p>
              </div>
              {calculatedData.netProceeds !== undefined && (
                <div>
                  <Label className="font-mono-label text-[10px] uppercase tracking-[0.15em] text-muted-foreground opacity-60">Estimated Net Proceeds</Label>
                  <p className="text-sm font-bold text-primary">{formatCurrency(calculatedData.netProceeds)}</p>
                </div>
              )}
            </div>
          </CardContent>
        </>
      )}

      {/* Suggested Principal - Balance Conversion only */}
      {!isLoading &&
        isBalanceConversion &&
        calculatedData?.selected?.suggestedPrincipal &&
        +calculatedData.selected.suggestedPrincipal.suggested > 0 && (
          <>
            <CardHeader>
              <CardTitle>Optimal Principal Insight</CardTitle>
              <CardDescription>
                The ideal principal to keep your total installment just under the 0% interest threshold.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label className="font-mono-label text-[10px] uppercase tracking-[0.15em] text-muted-foreground opacity-60">Suggested Principal</Label>
                  <p className="text-sm font-semibold">
                    {formatCurrency(calculatedData.selected.suggestedPrincipal.suggested)}
                  </p>
                </div>
                <div>
                  <Label className="font-mono-label text-[10px] uppercase tracking-[0.15em] text-muted-foreground opacity-60">Total With Interest</Label>
                  <p className="text-sm font-semibold">
                    {formatCurrency(calculatedData.selected.suggestedPrincipal.totalPayment)}
                  </p>
                </div>
              </div>
            </CardContent>
          </>
        )}

      {/* Payment Summary */}
      {!isLoading && paymentDifferences && (
        <>
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
            <CardDescription>Compare your payment amounts at a glance.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label className="font-mono-label text-[10px] uppercase tracking-[0.15em] text-muted-foreground opacity-60">
                  {isPersonalLoan ? "Loan Amount" : "Cash Price (Full Payment)"}
                </Label>
                <p className="text-sm font-semibold">{formatCurrency(paymentDifferences.totalFullPayment)}</p>
              </div>
              <div>
                <Label className="font-mono-label text-[10px] uppercase tracking-[0.15em] text-muted-foreground opacity-60">Total With Interest + Fees</Label>
                <p className="text-sm font-bold text-primary">
                  {formatCurrency(paymentDifferences.totalInstallmentWithInterest)}
                </p>
              </div>
              {isBalanceConversion &&
                paymentDifferences.totalInstallmentWithZeroPercent !== undefined &&
                paymentDifferences.totalInstallmentWithZeroPercent > 0 && (
                  <div>
                    <Label className="font-mono-label text-[10px] uppercase tracking-[0.15em] text-muted-foreground opacity-60">0% Merchant Installment</Label>
                    <p className="text-sm font-semibold">
                      {formatCurrency(paymentDifferences.totalInstallmentWithZeroPercent)}
                    </p>
                  </div>
                )}
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default CardSelectedPlan;
