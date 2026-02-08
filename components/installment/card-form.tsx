import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CalculateForm, CalculateFormSchema } from "@/schema";
import { CALCULATOR_TYPES, CALCULATOR_CONFIG, DST_EXEMPTION_THRESHOLD, DST_RATE_PER_200 } from "@/constant";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/client";
import { InfoCircledIcon, ReloadIcon, UpdateIcon } from "@radix-ui/react-icons";
import type { CalculatorType } from "@/constant";

interface CardInstallmentFormProps {
  onSubmit: (values: CalculateForm) => void;
  isLoading?: boolean;
}

const InfoTip: React.FC<{ content: string }> = ({ content }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <InfoCircledIcon className="ml-1.5 h-3.5 w-3.5 inline-block text-muted-foreground cursor-help" />
    </TooltipTrigger>
    <TooltipContent side="top" className="max-w-[300px] text-xs font-normal">
      <p>{content}</p>
    </TooltipContent>
  </Tooltip>
);

const CardInstallmentForm: React.FC<CardInstallmentFormProps> = ({ onSubmit, isLoading = false }) => {
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

  const estimatedDST = useMemo(() => {
    if (calculatorType !== "personal-loan" || !amount || amount <= DST_EXEMPTION_THRESHOLD) return 0;
    return Math.ceil(amount / 200) * DST_RATE_PER_200;
  }, [calculatorType, amount]);

  const estimatedNetProceeds = useMemo(() => {
    if (calculatorType !== "personal-loan" || !amount) return 0;
    return amount - estimatedDST - processingFee;
  }, [calculatorType, amount, estimatedDST, processingFee]);

  useEffect(() => {
    const currentPlan = form.getValues("numInstallments");
    if (!config.installmentPlans.includes(currentPlan)) {
      form.setValue("numInstallments", config.installmentPlans[0] as CalculateForm["numInstallments"]);
    }
    if (!config.showInstallmentAmount) {
      form.setValue("installmentAmount", 0);
    }
  }, [calculatorType, config, form]);

  const handleReset = () => {
    form.reset({
      calculatorType: "balance-conversion",
      amount: 10000,
      interestRate: 0.99,
      numInstallments: "3",
      processingFee: 0,
      installmentAmount: 0,
      monthlyBudget: 0,
    });
  };

  return (
    <TooltipProvider delayDuration={200}>
      <Card>
        <CardHeader>
          <CardTitle>Calculate Your Installment Plan</CardTitle>
          <CardDescription>
            Select a calculator type and enter your details to compare installment options across different terms.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Calculator Type Selector */}
          <fieldset disabled={isLoading} className="mb-6">
            <Label className="mb-2 block text-sm font-medium">
              Calculator Type
              <InfoTip content="Choose the type of financial product you want to calculate. Each type has different fees, fields, and terms." />
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {CALCULATOR_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  disabled={isLoading}
                  className={cn(
                    "rounded-lg border-2 px-4 py-3 text-left transition-all disabled:opacity-60",
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
          </fieldset>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <fieldset disabled={isLoading} className="space-y-4">
                {/* Amount Field */}
                <FormField
                  name="amount"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {config.amountLabel}
                        <InfoTip
                          content={
                            calculatorType === "balance-conversion"
                              ? "Enter the full cash price of the item you purchased. This is the amount that will be converted into bank installments with interest."
                              : calculatorType === "credit-to-cash"
                                ? "Enter the amount you want to convert from your unused credit limit into cash. This will be deposited to your bank account."
                                : "Enter the total loan amount you want to borrow. Note: DST and fees will be deducted, so your actual proceeds will be lower."
                          }
                        />
                      </FormLabel>
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
                      <FormLabel>
                        Monthly Add-On Interest Rate (%)
                        <InfoTip content="This is the monthly add-on (flat) rate. In the Philippines, interest is charged on the ORIGINAL principal every month, not on the declining balance. The BSP caps this at 1% per month for credit card installments. The true cost (EIR) is roughly 1.8x–2.0x this rate." />
                      </FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="Enter monthly interest rate (e.g., 0.99)" {...field} />
                      </FormControl>
                      <FormDescription>
                        Add-on (flat) rate applied to the original principal.
                        {calculatorType === "personal-loan"
                          ? " Typical PH personal loan rates: 1.20%–1.79%/month."
                          : " BSP caps credit card installments at 1%/month."}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Number of Installments */}
                <FormField
                  name="numInstallments"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Number of Installments (Months)
                        <InfoTip content="Choose how many months to spread your payments. Longer terms mean lower monthly payments but higher total interest. The calculator will also show all other terms for comparison." />
                      </FormLabel>
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
                        The calculator will also show all other available terms for comparison.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Processing Fee */}
                  <FormField
                    name="processingFee"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {config.processingFeeLabel}
                          <Label className="ml-1 text-gray-500 text-xs">(Optional)</Label>
                          <InfoTip
                            content={
                              calculatorType === "personal-loan"
                                ? "Banks charge an origination or disbursement fee deducted from your loan proceeds. Typical: ₱1,300–₱1,500."
                                : "A one-time fee charged by the bank for the conversion, added to your balance. Typical: ₱250–₱500."
                            }
                          />
                        </FormLabel>
                        <FormControl>
                          <Input type="number" placeholder={config.processingFeePlaceholder} {...field} />
                        </FormControl>
                        <FormDescription>{config.processingFeeDescription}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Installment Amount - Balance Conversion only */}
                  {config.showInstallmentAmount && (
                    <FormField
                      name="installmentAmount"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            0% Installment Amount
                            <Label className="ml-1 text-gray-500 text-xs">(Optional)</Label>
                            <InfoTip content="If the merchant offers a 0% interest installment plan, enter the TOTAL price under that plan here. It may be higher than the cash price. The calculator will compare this against bank conversion and suggest the best option." />
                          </FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Enter 0% installment total price" {...field} />
                          </FormControl>
                          <FormDescription>
                            Total price under the merchant&apos;s 0% plan for comparison.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Monthly Budget */}
                  <FormField
                    name="monthlyBudget"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Monthly Budget
                          <Label className="ml-1 text-gray-500 text-xs">(Optional)</Label>
                          <InfoTip content="Enter the maximum amount you can comfortably pay each month. Plans within budget will be highlighted green; plans exceeding it will be red." />
                        </FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter monthly budget" {...field} />
                        </FormControl>
                        <FormDescription>Plans within budget will be highlighted green.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* DST Preview for Personal Loans */}
                {config.showDST && amount > 0 && (
                  <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
                    <Label className="text-sm font-semibold">
                      Loan Fee Breakdown (Estimate)
                      <InfoTip content="These fees are deducted from your loan amount before disbursement. You receive the net proceeds but pay interest on the full loan amount." />
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Documentary Stamp Tax:</span>
                        <span className="ml-2 font-medium">
                          {estimatedDST > 0 ? formatCurrency(estimatedDST) : "Exempt (≤ ₱250K)"}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Processing Fee:</span>
                        <span className="ml-2 font-medium">{formatCurrency(processingFee || 0)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Est. Net Proceeds:</span>
                        <span className="ml-2 font-semibold text-primary">{formatCurrency(estimatedNetProceeds)}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      DST is ₱1.50 per ₱200 of loan amount (~0.75%). Loans ≤ ₱250,000 are exempt per NIRC.
                    </p>
                  </div>
                )}
              </fieldset>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button className="flex-1" type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <UpdateIcon className="mr-2 h-4 w-4 animate-spin" />
                      Calculating...
                    </>
                  ) : (
                    "Calculate"
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={handleReset} disabled={isLoading}>
                  <ReloadIcon className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
            </form>
          </Form>
          <p className="mt-4 text-xs text-muted-foreground">
            Different banks offer varying terms and rates. This calculator is for reference only — verify details
            directly with your bank. Interest rates shown are add-on (flat) rates; the effective rate (EIR) is higher.
          </p>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default CardInstallmentForm;
