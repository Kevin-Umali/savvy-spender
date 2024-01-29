import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CalculateForm, CalculateFormSchema } from "@/schema";

interface CardInstallmentFormProps {
  onSubmit: (values: CalculateForm) => void;
}

const CardInstallmentForm: React.FC<CardInstallmentFormProps> = ({ onSubmit }) => {
  const form = useForm<CalculateForm>({
    resolver: zodResolver(CalculateFormSchema),
    defaultValues: {
      amount: 10000,
      interestRate: 1,
      numInstallments: "3",
      processingFee: 0,
      installmentAmount: 0,
      monthlyBudget: 0,
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calculate Your Installment Plan</CardTitle>
        <CardDescription>
          Enter your desired loan amount, interest rate, and other details to view various installment options.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Principal/Amount Field */}
            <FormField
              name="amount"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Principal / Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter principal or amount of the items" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is for the full cash price of the item or the total amount, which will then be converted into
                    banking installments.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Interest Rate Field */}
            <FormField
              name="interestRate"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interest Rate</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="Enter interest rate" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is for entering the interest rate that will be applied to your purchase, if applicable.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Number of Installments Field */}
            <FormField
              name="numInstallments"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Installments</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a installment plan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["3", "6", "9", "12", "15", "18", "21", "24", "27", "30", "33", "36"].map((num) => (
                        <SelectItem key={num} value={num}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    This is for selecting the number of installments for your payment plan. Your choice will determine
                    how many times you make payments
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Processing Fee Field */}
              <FormField
                name="processingFee"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Processing Fee
                      <Label className="ml-2 text-gray-500 text-xs">(Optional)</Label>
                    </FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter processing fee" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is for specifying any associated processing fee for your installment, which may apply to your
                      transaction
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Installment Amount Field */}
              <FormField
                name="installmentAmount"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Installment Amount
                      <Label className="ml-2 text-gray-500 text-xs">(Optional)</Label>
                    </FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter installment amount of the items" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is for specifying the installment amount for your purchase, usually with a 0% interest rate.
                      Note that the installment amount is distinct from the principal/total amount.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Monthly Budget Field */}
              <FormField
                name="monthlyBudget"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Monthly Budget
                      <Label className="ml-2 text-gray-500 text-xs">(Optional)</Label>
                    </FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter processing fee" {...field} />
                    </FormControl>
                    <FormDescription>This is for how much you can pay on a monthly basis.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button className="mx-auto w-full" type="submit">
              Calculate
            </Button>
          </form>
        </Form>
        <Label className="font-semibold">
          NOTE: Different banks may offer varying conversion terms and rates. Please note that the information provided
          here is for reference purposes only and may not be entirely accurate. It is intended to give you an idea of
          potential installment amounts, but it is advisable to verify the details directly with the respective banks.
        </Label>
      </CardContent>
    </Card>
  );
};

export default CardInstallmentForm;
