import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AllInstallmentOption } from "@/interfaces";
import { rowBgColor } from "@/lib";

interface OtherPlanTableProps {
  calculatedData: AllInstallmentOption | undefined;
  budget?: number | null;
}

const OtherPlanTable: React.FC<OtherPlanTableProps> = ({ calculatedData, budget }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Other Installment Plan</CardTitle>
        <CardDescription>Details of the installment of other plan.</CardDescription>
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
                <TableHead>Effective Interest Rate PA</TableHead>
                <TableHead>Monthly Payment</TableHead>
                <TableHead>Interest</TableHead>
                <TableHead>Total Payment w/ processing fee</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {calculatedData.others.map((installment) => (
                <TableRow key={installment.months}>
                  <TableCell>{installment.months}</TableCell>
                  <TableCell>{installment.simpleInterest}%</TableCell>
                  <TableCell>{installment.factorRate}</TableCell>
                  <TableCell>{installment.eirPA}%</TableCell>
                  <TableCell className={rowBgColor(+installment.monthlyPayment, budget)}>
                    ₱{installment.monthlyPayment}
                  </TableCell>
                  <TableCell>₱{installment.interest}</TableCell>
                  <TableCell>₱{installment.totalPayment}</TableCell>
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
