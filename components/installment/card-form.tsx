import { useEffect, useMemo, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { CalculateForm, CalculateFormSchema } from "@/schema";
import { CALCULATOR_TYPES, CALCULATOR_CONFIG, DST_EXEMPTION_THRESHOLD, DST_RATE_PER_200 } from "@/constant";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/client";
import { InfoCircledIcon, ReloadIcon, UpdateIcon } from "@radix-ui/react-icons";
import type { CalculatorType } from "@/constant";

type MonthInputMode = "preset" | "custom" | "range" | "quick";

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

const QUICK_PRESETS = [
  { label: "Short Term", description: "3–6 months", months: ["3", "6"] },
  { label: "Mid Term", description: "9–18 months", months: ["9", "12", "15", "18"] },
  { label: "Long Term", description: "24–36 months", months: ["24", "27", "30", "33", "36"] },
  { label: "All Terms", description: "3–36 months", months: ["3", "6", "9", "12", "15", "18", "21", "24", "27", "30", "33", "36"] },
];

const MONTH_MODE_TABS: Array<{ value: MonthInputMode; label: string; description: string }> = [
  { value: "preset", label: "Preset", description: "Choose from standard terms" },
  { value: "custom", label: "Custom", description: "Enter any month value" },
  { value: "range", label: "Range", description: "Generate a custom range" },
  { value: "quick", label: "Quick Fill", description: "Use preset groups" },
];

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

  const [monthMode, setMonthMode] = useState<MonthInputMode>("preset");
  const [customMonth, setCustomMonth] = useState<string>("");
  const [rangeStart, setRangeStart] = useState(3);
  const [rangeEnd, setRangeEnd] = useState(36);
  const [rangeStep, setRangeStep] = useState(3);
  const [selectedComparison, setSelectedComparison] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

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

  // Generate range months
  const rangeMonths = useMemo(() => {
    const months: string[] = [];
    for (let i = rangeStart; i <= rangeEnd; i += rangeStep) {
      months.push(String(i));
    }
    return months;
  }, [rangeStart, rangeEnd, rangeStep]);

  // Compute the plan list based on mode + advanced comparison
  const computePlanList = useCallback((): string[] => {
    let basePlans: string[];
    switch (monthMode) {
      case "custom": {
        const month = customMonth || form.getValues("numInstallments");
        basePlans = Array.from(new Set([...config.installmentPlans, month])).sort((a, b) => +a - +b);
        break;
      }
      case "range":
        basePlans = rangeMonths;
        break;
      case "quick":
      case "preset":
      default:
        basePlans = config.installmentPlans;
        break;
    }

    // If advanced comparison months are selected, use those instead
    if (showAdvanced && selectedComparison.length > 0) {
      const selected = form.getValues("numInstallments");
      return Array.from(new Set([...selectedComparison, selected])).sort((a, b) => +a - +b);
    }

    return basePlans;
  }, [monthMode, customMonth, config.installmentPlans, rangeMonths, showAdvanced, selectedComparison, form]);

  useEffect(() => {
    const currentPlan = form.getValues("numInstallments");
    if (monthMode === "preset" && !config.installmentPlans.includes(currentPlan)) {
      form.setValue("numInstallments", config.installmentPlans[0]);
    }
    if (!config.showInstallmentAmount) {
      form.setValue("installmentAmount", 0);
    }
  }, [calculatorType, config, form, monthMode]);

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
    setMonthMode("preset");
    setCustomMonth("");
    setRangeStart(3);
    setRangeEnd(36);
    setRangeStep(3);
    setSelectedComparison([]);
    setShowAdvanced(false);
  };

  const handleFormSubmit = (values: CalculateForm) => {
    const planList = computePlanList();
    onSubmit({ ...values, customPlanList: planList });
  };

  const handleQuickPreset = (months: string[]) => {
    setSelectedComparison(months);
    setShowAdvanced(true);
    if (months.length > 0) {
      form.setValue("numInstallments", months[0]);
    }
  };

  const toggleComparisonMonth = (month: string) => {
    setSelectedComparison((prev) =>
      prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month].sort((a, b) => +a - +b)
    );
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
            <Label className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-muted-foreground opacity-60 mb-3 block">
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
                    "rounded-sm border px-4 py-3 text-left transition-colors disabled:opacity-60",
                    calculatorType === type.value
                      ? "border-foreground bg-accent"
                      : "border-border hover:bg-accent"
                  )}
                  onClick={() => form.setValue("calculatorType", type.value)}
                >
                  <span className="block text-sm font-medium">{type.label}</span>
                  <span className="block text-[11px] text-muted-foreground mt-0.5">{type.description}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
              <fieldset disabled={isLoading} className="space-y-4">
                {/* Amount Field */}
                <FormField
                  name="amount"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono-label text-[10px] uppercase tracking-[0.15em]">
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
                      <FormLabel className="font-mono-label text-[10px] uppercase tracking-[0.15em]">
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

                {/* Number of Installments - Enhanced */}
                <div className="space-y-3">
                  <Label className="font-mono-label text-[10px] uppercase tracking-[0.15em]">
                    Number of Installments (Months)
                    <InfoTip content="Choose how many months to spread your payments. Use Preset for standard terms, Custom to type any month, Range to generate a series, or Quick Fill for common groupings." />
                  </Label>

                  {/* Mode Tabs */}
                  <div className="flex flex-wrap gap-1.5">
                    {MONTH_MODE_TABS.map((tab) => (
                      <button
                        key={tab.value}
                        type="button"
                        disabled={isLoading}
                        className={cn(
                          "font-mono-label text-[10px] uppercase tracking-[0.15em] rounded-sm px-3 py-1.5 transition-colors border",
                          monthMode === tab.value
                            ? "border-foreground text-foreground"
                            : "border-border text-muted-foreground opacity-60 hover:opacity-100"
                        )}
                        onClick={() => setMonthMode(tab.value)}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Preset Mode */}
                  {monthMode === "preset" && (
                    <FormField
                      name="numInstallments"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
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
                            Choose from standard bank installment terms.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Custom Mode */}
                  {monthMode === "custom" && (
                    <div className="space-y-2">
                      <Input
                        type="number"
                        min={1}
                        max={360}
                        placeholder="Enter number of months (1–360)"
                        value={customMonth}
                        onChange={(e) => {
                          setCustomMonth(e.target.value);
                          if (e.target.value) {
                            form.setValue("numInstallments", e.target.value);
                          }
                        }}
                        disabled={isLoading}
                      />
                      <p className="text-xs text-muted-foreground">
                        Type any month value. The comparison table will include this along with standard terms.
                      </p>
                    </div>
                  )}

                  {/* Range Mode */}
                  {monthMode === "range" && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <Label className="text-xs text-muted-foreground">Start</Label>
                          <Input
                            type="number"
                            min={1}
                            max={360}
                            value={rangeStart}
                            onChange={(e) => setRangeStart(Math.max(1, +e.target.value))}
                            disabled={isLoading}
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">End</Label>
                          <Input
                            type="number"
                            min={1}
                            max={360}
                            value={rangeEnd}
                            onChange={(e) => setRangeEnd(Math.max(1, +e.target.value))}
                            disabled={isLoading}
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Step</Label>
                          <Input
                            type="number"
                            min={1}
                            max={60}
                            value={rangeStep}
                            onChange={(e) => setRangeStep(Math.max(1, +e.target.value))}
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                      {rangeMonths.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {rangeMonths.map((m) => (
                            <Badge
                              key={m}
                              variant="secondary"
                              className={cn(
                                "cursor-pointer text-xs",
                                form.getValues("numInstallments") === m && "bg-primary text-primary-foreground"
                              )}
                              onClick={() => form.setValue("numInstallments", m)}
                            >
                              {m}mo
                            </Badge>
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Generated {rangeMonths.length} terms. Click a badge to select it as your primary term.
                      </p>
                    </div>
                  )}

                  {/* Quick Fill Mode */}
                  {monthMode === "quick" && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {QUICK_PRESETS.map((preset) => (
                          <button
                            key={preset.label}
                            type="button"
                            disabled={isLoading}
                            className={cn(
                              "rounded-sm border px-3 py-2 text-left transition-colors",
                              JSON.stringify(selectedComparison) === JSON.stringify(preset.months)
                                ? "border-foreground bg-accent"
                                : "border-border hover:bg-accent"
                            )}
                            onClick={() => handleQuickPreset(preset.months)}
                          >
                            <span className="block text-xs font-medium">{preset.label}</span>
                            <span className="block text-[10px] text-muted-foreground">{preset.description}</span>
                          </button>
                        ))}
                      </div>
                      {selectedComparison.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {selectedComparison.map((m) => (
                            <Badge
                              key={m}
                              variant="secondary"
                              className={cn(
                                "cursor-pointer text-xs",
                                form.getValues("numInstallments") === m && "bg-primary text-primary-foreground"
                              )}
                              onClick={() => form.setValue("numInstallments", m)}
                            >
                              {m}mo
                            </Badge>
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Select a preset to populate comparison terms. Click a badge to set your primary term.
                      </p>
                    </div>
                  )}

                  {/* Advanced: Customize Comparison Plans */}
                  <div className="border rounded-lg">
                    <button
                      type="button"
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setShowAdvanced(!showAdvanced)}
                    >
                      <span>Customize Comparison Plans</span>
                      <span className="text-[10px]">{showAdvanced ? "Hide" : "Show"}</span>
                    </button>
                    {showAdvanced && (
                      <div className="px-3 pb-3 space-y-2 border-t pt-2">
                        <p className="text-[10px] text-muted-foreground">
                          Check which months to include in the comparison table:
                        </p>
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12",
                            "15", "18", "21", "24", "27", "30", "33", "36", "42", "48", "60"].map((m) => (
                            <label
                              key={m}
                              className="flex items-center gap-1.5 text-xs cursor-pointer"
                            >
                              <Checkbox
                                checked={selectedComparison.includes(m)}
                                onCheckedChange={() => toggleComparisonMonth(m)}
                                disabled={isLoading}
                              />
                              {m}mo
                            </label>
                          ))}
                        </div>
                        <div className="flex gap-2 items-end">
                          <div className="flex-1">
                            <Label className="font-mono-label text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Add custom month</Label>
                            <Input
                              type="number"
                              min={1}
                              max={360}
                              placeholder="e.g., 45"
                              className="h-7 text-xs"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  const val = (e.target as HTMLInputElement).value;
                                  if (val && +val >= 1 && +val <= 360 && !selectedComparison.includes(val)) {
                                    setSelectedComparison((prev) => [...prev, val].sort((a, b) => +a - +b));
                                  }
                                  (e.target as HTMLInputElement).value = "";
                                }
                              }}
                              disabled={isLoading}
                            />
                          </div>
                          {selectedComparison.length > 0 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-xs h-7"
                              onClick={() => setSelectedComparison([])}
                            >
                              Clear all
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Processing Fee */}
                  <FormField
                    name="processingFee"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-mono-label text-[10px] uppercase tracking-[0.15em]">
                          {config.processingFeeLabel}
                          <span className="ml-1 text-muted-foreground normal-case font-sans text-[10px]">(Optional)</span>
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
                          <FormLabel className="font-mono-label text-[10px] uppercase tracking-[0.15em]">
                            0% Installment Amount
                            <span className="ml-1 text-muted-foreground normal-case font-sans text-[10px]">(Optional)</span>
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
                        <FormLabel className="font-mono-label text-[10px] uppercase tracking-[0.15em]">
                          Monthly Budget
                          <span className="ml-1 text-muted-foreground normal-case font-sans text-[10px]">(Optional)</span>
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
                    <Label className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-muted-foreground opacity-60">
                      Loan Fee Breakdown
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
                <Button className="flex-1 font-mono-label uppercase tracking-[0.1em]" type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <UpdateIcon className="mr-2 h-4 w-4 animate-spin" />
                      Calculating...
                    </>
                  ) : (
                    "Calculate"
                  )}
                </Button>
                <Button type="button" variant="outline" className="font-mono-label uppercase tracking-[0.1em]" onClick={handleReset} disabled={isLoading}>
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
