import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AllInstallmentOption, PaymentDifferences } from "@/interfaces";
import { rowBgColor } from "@/lib";

interface CardSelectedPlanProps {
  calculatedData: AllInstallmentOption | undefined;
  paymentDifferences: PaymentDifferences | undefined;
}

const CardSelectedPlan: React.FC<CardSelectedPlanProps> = ({ calculatedData, paymentDifferences }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Selected Installment Plan</CardTitle>
        <CardDescription>Details of the installment plan you selected.</CardDescription>
      </CardHeader>

      {calculatedData?.selected && (
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label className="font-semibold">Months:</Label>
              <Label className="ml-2">{calculatedData.selected.months}</Label>
            </div>
            <div>
              <Label className="font-semibold">Simple Interest:</Label>
              <Label className="ml-2">{calculatedData.selected.simpleInterest}%</Label>
            </div>
            <div>
              <Label className="font-semibold">Factor Rate:</Label>
              <Label className="ml-2">{calculatedData.selected.factorRate}</Label>
            </div>
            <div>
              <Label className="font-semibold">Effective Interest Rate PA:</Label>
              <Label className="ml-2">{calculatedData.selected.eirPA}%</Label>
            </div>
            <div>
              <Label className="font-semibold">Monthly Payment:</Label>
              <Label
                className={`ml-2 ${rowBgColor(+calculatedData.selected.monthlyPayment, calculatedData.monthlyBudget)}`}
              >
                ₱{calculatedData.selected.monthlyPayment}
              </Label>
            </div>
            <div>
              <Label className="font-semibold">Interest:</Label>
              <Label className="ml-2">₱{calculatedData.selected.interest}</Label>
            </div>
            <div>
              <Label className="font-semibold">Total Payment:</Label>
              <Label className="ml-2">₱{calculatedData.selected.totalPayment} w/ processing fee</Label>
            </div>
          </div>
        </CardContent>
      )}

      <CardHeader>
        <CardTitle>Payment Comparison</CardTitle>
        <CardDescription>See how different payment methods compare.</CardDescription>
      </CardHeader>

      {paymentDifferences && (
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Display Total Payments */}
            <div>
              <Label className="font-semibold">Total Full Payment:</Label>
              <Label className="ml-2">₱{paymentDifferences.totalFullPayment.toLocaleString()}</Label>
            </div>
            <div>
              <Label className="font-semibold">Total Installment With Interest:</Label>
              <Label className="ml-2">₱{paymentDifferences.totalInstallmentWithInterest.toLocaleString()}</Label>
            </div>
            {paymentDifferences.totalInstallmentWithZeroPercent !== undefined && (
              <div>
                <Label className="font-semibold">Total Installment With 0% Interest:</Label>
                <Label className="ml-2">₱{paymentDifferences.totalInstallmentWithZeroPercent.toLocaleString()}</Label>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default CardSelectedPlan;
