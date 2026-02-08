import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AllInstallmentOption } from "@/interfaces";
import { formatCurrency, formatPercent } from "@/lib/client";

interface OtherPlanTableProps {
  calculatedData: AllInstallmentOption | undefined;
  budget?: number;
  isLoading?: boolean;
}

const Skeleton: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`animate-pulse bg-muted rounded ${className}`} />
);

const OtherPlanTable: React.FC<OtherPlanTableProps> = ({ calculatedData, budget = 0, isLoading = false }) => {
  const hasBudget = budget > 0;
  const isBalanceConversion = calculatedData?.calculatorType === "balance-conversion";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Other Installment Plans</CardTitle>
        <CardDescription>Compare all available installment terms side by side.</CardDescription>
      </CardHeader>

      {isLoading ? (
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-8 w-full" />
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </CardContent>
      ) : calculatedData?.others ? (
        <CardContent>
          <div className="overflow-x-auto -mx-6 px-6">
            <Table>
              <TableCaption>All other available installment terms</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Months</TableHead>
                  <TableHead>Simple Interest</TableHead>
                  <TableHead>Factor Rate</TableHead>
                  <TableHead>EIR PA</TableHead>
                  <TableHead>Monthly Payment</TableHead>
                  <TableHead>Interest</TableHead>
                  <TableHead>Total w/ Fees</TableHead>
                  {isBalanceConversion && <TableHead>Suggested Principal / Total</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {calculatedData.others.map((installment) => (
                  <TableRow key={installment.months}>
                    <TableCell className="font-medium">{installment.months}</TableCell>
                    <TableCell>{formatPercent(installment.simpleInterest)}</TableCell>
                    <TableCell>{installment.factorRate}</TableCell>
                    <TableCell>{formatPercent(installment.eirPA)}</TableCell>
                    <TableCell
                      className={
                        hasBudget
                          ? +installment.monthlyPayment <= budget
                            ? "text-green-600 dark:text-green-400 font-medium"
                            : "text-red-600 dark:text-red-400 font-medium"
                          : ""
                      }
                    >
                      {formatCurrency(installment.monthlyPayment)}
                    </TableCell>
                    <TableCell className="text-orange-600 dark:text-orange-400">
                      {formatCurrency(installment.interest)}
                    </TableCell>
                    <TableCell className="font-semibold">{formatCurrency(installment.totalPayment)}</TableCell>
                    {isBalanceConversion && (
                      <TableCell>
                        {formatCurrency(installment.suggestedPrincipal.suggested)} /{" "}
                        {formatCurrency(installment.suggestedPrincipal.totalPayment)}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      ) : null}
    </Card>
  );
};

export default OtherPlanTable;
