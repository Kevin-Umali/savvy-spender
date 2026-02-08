import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AllInstallmentOption } from "@/interfaces";

interface OtherPlanTableProps {
  calculatedData: AllInstallmentOption | undefined;
  budget?: number;
}

const OtherPlanTable: React.FC<OtherPlanTableProps> = ({ calculatedData, budget = 0 }) => {
  const hasBudget = budget > 0;
  const isBalanceConversion = calculatedData?.calculatorType === "balance-conversion";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Other Installment Plans</CardTitle>
        <CardDescription>Compare all available installment terms side by side.</CardDescription>
      </CardHeader>

      {calculatedData?.others && (
        <CardContent>
          <Table>
            <TableCaption>A list of other installment plans</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Months</TableHead>
                <TableHead>Simple Interest</TableHead>
                <TableHead>Factor Rate</TableHead>
                <TableHead>EIR PA</TableHead>
                <TableHead>Monthly Payment</TableHead>
                <TableHead>Interest</TableHead>
                <TableHead>Total Payment w/ Fees</TableHead>
                {isBalanceConversion && <TableHead>Suggested Principal / Total</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {calculatedData.others.map((installment) => (
                <TableRow key={installment.months}>
                  <TableCell>{installment.months}</TableCell>
                  <TableCell>{installment.simpleInterest}%</TableCell>
                  <TableCell>{installment.factorRate}</TableCell>
                  <TableCell>{installment.eirPA}%</TableCell>
                  <TableCell
                    className={
                      hasBudget
                        ? +installment.monthlyPayment <= budget
                          ? "bg-green-100 dark:bg-green-800"
                          : "bg-red-100 dark:bg-red-800"
                        : ""
                    }
                  >
                    ₱{installment.monthlyPayment}
                  </TableCell>
                  <TableCell>₱{installment.interest}</TableCell>
                  <TableCell>₱{installment.totalPayment}</TableCell>
                  {isBalanceConversion && (
                    <TableCell>
                      ₱{installment.suggestedPrincipal.suggested} / ₱{installment.suggestedPrincipal.totalPayment}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      )}
    </Card>
  );
};

export default OtherPlanTable;
