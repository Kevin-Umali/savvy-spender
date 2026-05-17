"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CalculateForm, CalculateFormSchema } from "@/schema";
import { CALCULATOR_TYPES, CALCULATOR_CONFIG, DST_EXEMPTION_THRESHOLD, DST_RATE_PER_200 } from "@/constant";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/client";
import { ChevronDownIcon, InfoCircledIcon, ReloadIcon, UpdateIcon } from "@radix-ui/react-icons";
import type { CalculatorType } from "@/constant";

const PRESET_TERMS = ["3", "6", "9", "12", "18", "24", "36"];
const PERSONAL_LOAN_TERMS = ["6", "12", "18", "24", "30", "36"];

interface CardInstallmentFormProps {
  onSubmit: (values: CalculateForm) => void;
  isLoading?: boolean;
}

const InfoTip: React.FC<{ content: string }> = ({ content }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <InfoCircledIcon className="ml-1.5 h-3.5 w-3.5 inline-block text-muted-foreground cursor-help align-text-bottom" />
    </TooltipTrigger>
    <TooltipContent side="top" className="max-w-[280px] text-xs font-normal leading-relaxed">
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

  const [selectedTerms, setSelectedTerms] = useState<string[]>(["3", "6", "9", "12", "18", "24", "36"]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const calculatorType = form.watch("calculatorType") as CalculatorType;
  const amount = form.watch("amount");
  const processingFee = form.watch("processingFee") ?? 0;
  const numInstallments = form.watch("numInstallments");

  const config = CALCULATOR_CONFIG[calculatorType];

  // Available presets depend on calculator type
  const availablePresets = useMemo(
    () => (calculatorType === "personal-loan" ? PERSONAL_LOAN_TERMS : PRESET_TERMS),
    [calculatorType]
  );

  const estimatedDST = useMemo(() => {
    if (calculatorType !== "personal-loan" || !amount || amount <= DST_EXEMPTION_THRESHOLD) return 0;
    return Math.ceil(amount / 200) * DST_RATE_PER_200;
  }, [calculatorType, amount]);

  const estimatedNetProceeds = useMemo(() => {
    if (calculatorType !== "personal-loan" || !amount) return 0;
    return amount - estimatedDST - processingFee;
  }, [calculatorType, amount, estimatedDST, processingFee]);

  // Reset selected terms when calc type changes; keep current selection in sync
  useEffect(() => {
    setSelectedTerms(availablePresets);
    if (!availablePresets.includes(form.getValues("numInstallments"))) {
      form.setValue("numInstallments", availablePresets[0]);
    }
    if (!config.showInstallmentAmount) {
      form.setValue("installmentAmount", 0);
    }
  }, [calculatorType, availablePresets, config, form]);

  const toggleTerm = (term: string) => {
    setSelectedTerms((prev) => {
      const next = prev.includes(term) ? prev.filter((t) => t !== term) : [...prev, term].sort((a, b) => +a - +b);
      // If the primary selection is no longer in the list, fall back to the first remaining
      if (!next.includes(numInstallments) && next.length > 0) {
        form.setValue("numInstallments", next[0]);
      }
      return next;
    });
  };

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
    setSelectedTerms(PRESET_TERMS);
    setShowAdvanced(false);
  };

  const handleFormSubmit = (values: CalculateForm) => {
    const planList = selectedTerms.length > 0 ? selectedTerms : availablePresets;
    // Make sure the primary selection is included
    const finalList = planList.includes(values.numInstallments)
      ? planList
      : [...planList, values.numInstallments].sort((a, b) => +a - +b);
    onSubmit({ ...values, customPlanList: finalList });
  };

  return (
    <TooltipProvider delayDuration={200}>
      <Card className="border-border">
        <CardHeader className="pb-4">
          <p className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-muted-foreground opacity-60">
            Inputs
          </p>
          <CardTitle className="font-display italic font-light text-xl tracking-tight">
            Configure your scenario
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Calculator Type — compact segmented control */}
          <fieldset disabled={isLoading}>
            <Label className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-muted-foreground opacity-60 mb-2 block">
              Calculator Type
            </Label>
            <div className="grid grid-cols-3 gap-1 rounded-sm border bg-muted/30 p-1">
              {CALCULATOR_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  disabled={isLoading}
                  className={cn(
                    "rounded-sm px-2 py-1.5 text-[11px] font-medium transition-colors disabled:opacity-60",
                    calculatorType === type.value
                      ? "bg-background border border-foreground/15 shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => form.setValue("calculatorType", type.value)}
                  title={type.description}
                >
                  {type.label.split(" ")[0]}
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-[11px] text-muted-foreground leading-relaxed">
              {CALCULATOR_TYPES.find((t) => t.value === calculatorType)?.description}
            </p>
          </fieldset>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-5">
              <fieldset disabled={isLoading} className="space-y-5">
                {/* Amount */}
                <FormField
                  name="amount"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-muted-foreground opacity-60">
                        {config.amountLabel}
                        <InfoTip
                          content={
                            calculatorType === "balance-conversion"
                              ? "The full cash price of the item being converted into bank installments."
                              : calculatorType === "credit-to-cash"
                                ? "The amount you want to convert from your credit limit into cash."
                                : "The total loan amount. DST and fees are deducted, so net proceeds will be lower."
                          }
                        />
                      </FormLabel>
                      <FormControl>
                        <Input type="number" placeholder={config.amountPlaceholder} className="tabular-nums" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Interest rate */}
                <FormField
                  name="interestRate"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-muted-foreground opacity-60">
                        Monthly Add-On Rate
                        <span className="ml-1.5 text-muted-foreground/60">(%)</span>
                        <InfoTip content="Flat monthly rate applied to the original principal. BSP caps credit card installments at 1%. PH personal loans are typically 1.20%–1.79%." />
                      </FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="0.99" className="tabular-nums" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Term — preset chips */}
                <div>
                  <Label className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-muted-foreground opacity-60 mb-2 block">
                    Term (Months)
                    <InfoTip content="Pick which terms to compare. Tap a chip to add or remove it. The bold chip is your primary selection — it drives the hero summary and amortization schedule." />
                  </Label>
                  <div className="flex flex-wrap gap-1.5">
                    {availablePresets.map((term) => {
                      const inComparison = selectedTerms.includes(term);
                      const isPrimary = numInstallments === term;
                      return (
                        <div key={term} className="flex">
                          <button
                            type="button"
                            disabled={isLoading}
                            onClick={() => {
                              if (!inComparison) {
                                setSelectedTerms((prev) => [...prev, term].sort((a, b) => +a - +b));
                              }
                              form.setValue("numInstallments", term);
                            }}
                            className={cn(
                              "font-mono-label text-[11px] tabular-nums rounded-sm px-2.5 py-1.5 border transition-colors",
                              isPrimary
                                ? "border-foreground bg-foreground text-background"
                                : inComparison
                                  ? "border-foreground/30 bg-background hover:border-foreground/60"
                                  : "border-dashed border-border bg-transparent text-muted-foreground hover:text-foreground"
                            )}
                          >
                            {term}mo
                          </button>
                          {inComparison && !isPrimary && (
                            <button
                              type="button"
                              disabled={isLoading}
                              onClick={() => toggleTerm(term)}
                              className="ml-px px-1.5 py-1.5 border border-l-0 border-foreground/30 rounded-sm text-muted-foreground hover:text-foreground text-[10px]"
                              aria-label={`Remove ${term} months from comparison`}
                            >
                              ×
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <p className="mt-2 text-[11px] text-muted-foreground leading-relaxed">
                    Comparing <span className="tabular-nums font-medium text-foreground">{selectedTerms.length}</span>{" "}
                    term{selectedTerms.length === 1 ? "" : "s"}. Primary:{" "}
                    <span className="tabular-nums font-medium text-foreground">{numInstallments}mo</span>.
                  </p>
                </div>

                {/* DST preview — personal loan only, always visible since it's contextually important */}
                {config.showDST && amount > 0 && (
                  <div className="rounded-sm border bg-muted/30 p-3 space-y-1.5">
                    <p className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-muted-foreground opacity-60">
                      Disbursement Preview
                    </p>
                    <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
                      <dt className="text-muted-foreground">DST</dt>
                      <dd className="text-right tabular-nums">
                        {estimatedDST > 0 ? formatCurrency(estimatedDST) : "Exempt"}
                      </dd>
                      <dt className="text-muted-foreground">Fee</dt>
                      <dd className="text-right tabular-nums">{formatCurrency(processingFee || 0)}</dd>
                      <dt className="font-medium">Net proceeds</dt>
                      <dd className="text-right tabular-nums font-semibold">{formatCurrency(estimatedNetProceeds)}</dd>
                    </dl>
                  </div>
                )}

                {/* Advanced disclosure */}
                <div className="border-t pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAdvanced((s) => !s)}
                    className="w-full flex items-center justify-between font-mono-label text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <span>Advanced Options</span>
                    <ChevronDownIcon className={cn("h-3.5 w-3.5 transition-transform", showAdvanced && "rotate-180")} />
                  </button>

                  {showAdvanced && (
                    <div className="mt-4 space-y-4">
                      <FormField
                        name="processingFee"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-muted-foreground opacity-60">
                              {config.processingFeeLabel}
                              <InfoTip
                                content={
                                  calculatorType === "personal-loan"
                                    ? "Origination fee deducted from proceeds. Typical: ₱1,300–₱1,500."
                                    : "One-time conversion fee added to your balance. Typical: ₱250–₱500."
                                }
                              />
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder={config.processingFeePlaceholder}
                                className="tabular-nums"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {config.showInstallmentAmount && (
                        <FormField
                          name="installmentAmount"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-muted-foreground opacity-60">
                                0% Merchant Plan Total
                                <InfoTip content="If the merchant offers a 0% installment plan, enter its total price here. The calculator will compare it against the bank conversion." />
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  className="tabular-nums"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription className="text-[11px]">
                                Leave 0 to skip the comparison.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      <FormField
                        name="monthlyBudget"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-muted-foreground opacity-60">
                              Monthly Budget
                              <InfoTip content="Plans whose monthly payment fits this budget will earn a 'Best for budget' badge." />
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0"
                                className="tabular-nums"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>
              </fieldset>

              {/* Action buttons */}
              <div className="flex gap-2 pt-1">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 font-mono-label text-[11px] uppercase tracking-[0.15em]"
                >
                  {isLoading ? (
                    <>
                      <UpdateIcon className="mr-2 h-3.5 w-3.5 animate-spin" />
                      Calculating
                    </>
                  ) : (
                    "Calculate"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  disabled={isLoading}
                  className="font-mono-label text-[11px] uppercase tracking-[0.15em]"
                >
                  <ReloadIcon className="h-3.5 w-3.5" />
                </Button>
              </div>
            </form>
          </Form>

          <p className="text-[10px] text-muted-foreground/70 leading-relaxed pt-2 border-t">
            Add-on (flat) rates only. Effective interest rate (EIR) is computed for you. Verify final terms with your bank.
          </p>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default CardInstallmentForm;
