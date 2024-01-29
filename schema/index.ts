import { z } from "zod";

export const CalculateFormSchema = z.object({
  amount: z.coerce.number().min(1).nonnegative(),
  interestRate: z.coerce
    .number()
    .transform((value) => value / 100) // Convert percentage to decimal
    .refine((val) => !isNaN(val) && val >= 0 && val <= 1, "Interest rate must be a percentage between 0% and 100%"),
  numInstallments: z.enum(["3", "6", "9", "12", "15", "18", "21", "24", "27", "30", "33", "36"]).default("3"),
  processingFee: z.coerce.number().min(0).optional(),
  installmentAmount: z.coerce.number().min(0).nonnegative(),
  monthlyBudget: z.coerce.number().min(0).optional(),
});

export type CalculateForm = z.infer<typeof CalculateFormSchema>;
