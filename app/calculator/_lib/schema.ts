import { z } from "zod";

export const CalculateFormSchema = z
  .object({
    calculatorType: z.enum(["balance-conversion", "credit-to-cash", "personal-loan"]).default("balance-conversion"),
    amount: z.coerce.number().min(1, "Amount must be at least 1"),
    interestRate: z.coerce
      .number()
      .transform((value) => value / 100) // Convert percentage to decimal
      .refine((val) => !isNaN(val) && val >= 0 && val <= 1, "Interest rate must be a percentage between 0% and 100%"),
    numInstallments: z
      .string()
      .refine(
        (val) => {
          const num = parseInt(val);
          return !isNaN(num) && num >= 1 && num <= 360;
        },
        "Must be between 1 and 360 months"
      )
      .default("3"),
    customPlanList: z.array(z.string()).optional(),
    processingFee: z.coerce.number().min(0).optional(),
    installmentAmount: z.coerce.number().min(0),
    monthlyBudget: z.coerce.number().min(0).optional(),
  })
  .refine(
    (data) => {
      // installmentAmount validation only applies for balance-conversion
      if (data.calculatorType !== "balance-conversion") return true;
      return data.installmentAmount === 0 || data.installmentAmount > data.amount;
    },
    {
      message: "Installment amount must be 0 or greater than the principal/amount",
      path: ["installmentAmount"],
    }
  );

export type CalculateForm = z.infer<typeof CalculateFormSchema>;
