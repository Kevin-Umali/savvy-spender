import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CalculateForm, CalculateFormSchema } from "@/schema";
import { CALCULATOR_TYPES, CALCULATOR_CONFIG, DST_EXEMPTION_THRESHOLD, DST_RATE_PER_200 } from "@/constant";
import { cn } from "@/lib/utils";
import type { CalculatorType } from "@/constant";

interface CardInstallmentFormProps {
  onSubmit: (values: CalculateForm) => void;
}

const CardInstallmentForm: React.FC<CardInstallmentFormProps> = ({ onSubmit }) => {
  const form = useForm<CalculateForm>({
    resolver: zodResolver(CalculateFormSchema),
    defaultValues: {
      calculatorType: "balance-conversion",
      amount: 10000,
      interestRate: 0.99,
      numInstallments: "3",
      processingFee: 0,
      installmentAmount: 0,
      monthlyBudget: 0,
    },
  });

  const calculatorType = form.watch("calculatorType") as CalculatorType;
  const amount = form.watch("amount");
  const processingFee = form.watch("processingFee") ?? 0;

  const config = CALCULATOR_CONFIG[calculatorType];

  // Estimate DST for preview in the form
  const estimatedDST = useMemo(() => {
    if (calculatorType !== "personal-loan" || !amount || amount <= DST_EXEMPTION_THRESHOLD) return 0;
    return Math.ceil(amount / 200) * DST_RATE_PER_200;
  }, [calculatorType, amount]);

  const estimatedNetProceeds = useMemo(() => {
    if (calculatorType !== "personal-loan" || !amount) return 0;
    return amount - estimatedDST - processingFee;
  }, [calculatorType, amount, estimatedDST, processingFee]);

  // When calculator type changes, update defaults
  useEffect(() => {
    const currentPlan = form.getValues("numInstallments");
    if (!config.installmentPlans.includes(currentPlan)) {
      form.setValue("numInstallments", config.installmentPlans[0] as CalculateForm["numInstallments"]);
    }
    // Reset installmentAmount to 0 when not applicable
    if (!config.showInstallmentAmount) {
      form.setValue("installmentAmount", 0);
    }
  }, [calculatorType, config, form]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calculate Your Installment Plan</CardTitle>
        <CardDescription>
          Select a calculator type and enter your details to compare installment options.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Calculator Type Selector */}
        <div className="mb-6">
          <Label className="mb-2 block text-sm font-medium">Calculator Type</Label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {CALCULATOR_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                className={cn(
                  "rounded-lg border-2 px-4 py-3 text-left transition-all",
                  calculatorType === type.value
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/40 hover:bg-muted/50"
                )}
                onClick={() => form.setValue("calculatorType", type.value)}
              >
                <span className="block text-sm font-semibold">{type.label}</span>
                <span className="block text-xs text-muted-foreground mt-0.5">{type.description}</span>
              </button>
            ))}
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Principal/Amount Field */}
            <FormField
              name="amount"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{config.amountLabel}</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder={config.amountPlaceholder} {...field} />
                  </FormControl>
                  <FormDescription>{config.amountDescription}</FormDescription>
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
                  <FormLabel>Monthly Add-On Interest Rate (%)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="Enter monthly interest rate (e.g., 0.99)" {...field} />
                  </FormControl>
                  <FormDescription>
                    The monthly add-on (flat) rate applied to the original principal each month. BSP caps this at 1% per
                    month for credit card installments.
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
                  <FormLabel>Number of Installments (Months)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select installment term" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {config.installmentPlans.map((num) => (
                        <SelectItem key={num} value={num}>
                          {num} months
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose how many months to spread your payments over.
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
                      {config.processingFeeLabel}
                      <Label className="ml-2 text-gray-500 text-xs">(Optional)</Label>
                    </FormLabel>
                    <FormControl>
                      <Input type="number" placeholder={config.processingFeePlaceholder} {...field} />
                    </FormControl>
                    <FormDescription>{config.processingFeeDescription}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Installment Amount Field - only for Balance Conversion */}
              {config.showInstallmentAmount && (
                <FormField
                  name="installmentAmount"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        0% Installment Amount
                        <Label className="ml-2 text-gray-500 text-xs">(Optional)</Label>
                      </FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter 0% installment amount" {...field} />
                      </FormControl>
                      <FormDescription>
                        The total amount if paying via 0% interest installment plan. Used to compare and suggest an
                        optimal principal.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

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
                      <Input type="number" placeholder="Enter monthly budget" {...field} />
                    </FormControl>
                    <FormDescription>
                      Your monthly budget for payments. Plans within budget will be highlighted in green.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* DST & Net Proceeds Preview for Personal Loans */}
            {config.showDST && amount > 0 && (
              <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
                <Label className="text-sm font-semibold">Loan Fee Breakdown (Estimate)</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Documentary Stamp Tax:</span>
                    <span className="ml-2 font-medium">
                      {estimatedDST > 0
                        ? `₱${estimatedDST.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        : "Exempt (≤ ₱250K)"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Processing Fee:</span>
                    <span className="ml-2 font-medium">
                      ₱{(processingFee || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Est. Net Proceeds:</span>
                    <span className="ml-2 font-semibold text-primary">
                      ₱{estimatedNetProceeds.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  DST is ₱1.50 per ₱200 of loan amount (~0.75%). Loans ≤ ₱250,000 for personal use are exempt per NIRC.
                </p>
              </div>
            )}

            <Button className="mx-auto w-full" type="submit">
              Calculate
            </Button>
          </form>
        </Form>
        <Label className="mt-4 block text-xs text-muted-foreground">
          NOTE: Different banks may offer varying conversion terms and rates. The information provided here is for
          reference purposes only. It is advisable to verify the details directly with the respective banks. Interest
          rates shown are add-on (flat) rates — the effective interest rate (EIR) will be higher.
        </Label>
      </CardContent>
    </Card>
  );
};

export default CardInstallmentForm;
