import { z } from "zod";
import {
  FINANCING_TYPE_OPTIONS,
  PAYMENT_TIMING_OPTIONS,
  MONTHLY_MODE_OPTIONS,
  DISCOUNT_TYPE_OPTIONS,
  DISCOUNT_APPLIES_OPTIONS,
  FEE_TIMING_OPTIONS,
  VALUE_MODE_OPTIONS,
  PRIORITY_OPTIONS,
  COMPARISON_SCOPE_OPTIONS,
} from "./options";

const choice = <T extends string>(options: readonly { value: T }[]) =>
  z.enum(options.map((o) => o.value) as [T, ...T[]]);
const money = z.number().finite().min(0).max(1e12);
const percent = z.number().finite().min(0).max(100);
const text = z.string().max(1000);
const id = z.string().min(1).max(100);
const fee = z.object({
  id,
  name: text,
  amount: money,
  timing: choice(FEE_TIMING_OPTIONS),
  includedInMonthly: z.boolean(),
  includedInUpfront: z.boolean(),
  waived: z.boolean(),
  waivedAmount: money,
  notes: text,
});
const option = z.object({
  id,
  name: text,
  type: choice(FINANCING_TYPE_OPTIONS),
  provider: text,
  termMonths: z.number().int().min(1).max(360),
  loanAmount: money,
  downPayment: money,
  paymentTiming: choice(PAYMENT_TIMING_OPTIONS),
  monthlyMode: choice(MONTHLY_MODE_OPTIONS),
  quotedMonthly: money,
  monthlyAddOnRate: percent,
  totalAddOnRate: money,
  annualEffectiveRate: percent,
  annualNominalRate: percent,
  manualTotalRepayment: money,
  receivesDiscount: z.boolean(),
  fees: z.array(fee).max(50),
  notes: text,
  insurance: z.object({
    mode: choice(VALUE_MODE_OPTIONS),
    comprehensive: money,
    ctpl: money,
    actsOfNature: money,
    provider: text,
    recurringYearly: z.boolean(),
    requiredByLender: z.boolean(),
  }),
  registration: z.object({
    mode: choice(VALUE_MODE_OPTIONS),
    ltoRegistration: money,
    plateFee: money,
    ctpl: money,
    otherLto: money,
    includedInDealerPackage: z.boolean(),
  }),
});

/** Shared links and API input use the same bounded, structural validation. */
export const scenarioSchema = z
  .object({
    vehicle: z.object({
      name: text,
      originalPrice: money,
      discountAmount: money,
      discountType: choice(DISCOUNT_TYPE_OPTIONS),
      discountAppliesTo: choice(DISCOUNT_APPLIES_OPTIONS),
      otherDiscounts: money,
      reservationFee: money,
      accessories: money,
      otherCharges: money,
    }),
    options: z.array(option).min(1).max(20),
    priority: choice(PRIORITY_OPTIONS),
    scope: choice(COMPARISON_SCOPE_OPTIONS),
    fullTerm: z.boolean(),
  })
  .refine(
    (s) => new Set(s.options.map((o) => o.id)).size === s.options.length,
    "Option IDs must be unique",
  );
