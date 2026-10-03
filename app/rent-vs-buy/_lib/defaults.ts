import type { RentVsBuyInput } from "./types";

/**
 * Illustrative editable defaults. These are not verified market quotes,
 * tax assessments, guaranteed returns, or forecasts.
 */
export const DEFAULT_INPUT: RentVsBuyInput = {
  // Property — sample mid-market Metro Manila condo
  price: 5_000_000,
  floorAreaSqm: 36,
  appreciationPct: 4, // illustrative annual appreciation

  // Financing — bank fixed-rate norm (Pag-IBIG presets available)
  downPaymentPct: 20,
  mortgageRatePct: 6.75, // constant-rate scenario, not an issuer quote
  loanTermYears: 20,
  closingCostPct: 5, // DST 1.5% + transfer ~0.75% + registration ~0.5% + professional ~2%

  // Carrying costs
  assessmentLevelPct: 20, // example only; residential land/buildings have different assessment rules
  rptRatePct: 2, // Metro Manila max
  sefRatePct: 1, // Special Education Fund
  duesPerSqmMonthly: 100, // Metro Manila mid-market association dues
  maintenancePct: 1,
  homeInsurancePct: 0.15,

  // Renting — ~5–6% gross yield on the price
  monthlyRent: 25_000,
  rentGrowthPct: 4,

  // Economy
  investReturnPct: 7, // illustrative return; MP2 dividends vary and do not establish a floor
  costInflationPct: 3.5, // scenario assumption, not a current forecast

  // Horizon / exit
  horizonYears: 10,
  assumeSaleAtHorizon: true,
  sellingCostPct: 9.5, // CGT 6% + broker ~3% + notarial ~0.5%

  monthlyIncome: 0,
};

/** Per-field metadata for the inputs form (label, tooltip, step, unit). */
export interface FieldMeta {
  key: keyof RentVsBuyInput;
  label: string;
  tip: string;
  step: number;
  suffix?: string;
}

export const FIELD_GROUPS: { title: string; fields: FieldMeta[] }[] = [
  {
    title: "Property",
    fields: [
      {
        key: "price",
        label: "Purchase price",
        tip: "Total contract price of the home.",
        step: 50_000,
        suffix: "₱",
      },
      {
        key: "floorAreaSqm",
        label: "Floor area",
        tip: "Used to compute association dues.",
        step: 1,
        suffix: "sqm",
      },
      {
        key: "appreciationPct",
        label: "Appreciation / yr",
        tip: "Expected annual rise in the property's value.",
        step: 0.5,
        suffix: "%",
      },
    ],
  },
  {
    title: "Financing",
    fields: [
      {
        key: "downPaymentPct",
        label: "Down payment",
        tip: "Equity paid upfront; the rest is financed.",
        step: 1,
        suffix: "%",
      },
      {
        key: "mortgageRatePct",
        label: "Mortgage rate / yr",
        tip: "Annual nominal rate held constant throughout this simulation. Actual loans may reprice.",
        step: 0.25,
        suffix: "%",
      },
      {
        key: "loanTermYears",
        label: "Loan term",
        tip: "Years to fully amortise the loan.",
        step: 1,
        suffix: "yrs",
      },
      {
        key: "closingCostPct",
        label: "Closing costs",
        tip: "One-time taxes & fees to transfer title (DST, transfer tax, registration, professional).",
        step: 0.5,
        suffix: "%",
      },
    ],
  },
  {
    title: "Carrying costs",
    fields: [
      {
        key: "duesPerSqmMonthly",
        label: "Assoc. dues",
        tip: "Condo / HOA dues per square metre per month.",
        step: 5,
        suffix: "₱/sqm/mo",
      },
      {
        key: "rptRatePct",
        label: "RPT rate",
        tip: "Real property tax rate (Metro Manila max 2%).",
        step: 0.25,
        suffix: "%",
      },
      {
        key: "maintenancePct",
        label: "Maintenance / yr",
        tip: "Annual upkeep as a % of property value.",
        step: 0.25,
        suffix: "%",
      },
      {
        key: "homeInsurancePct",
        label: "Insurance / yr",
        tip: "Home / fire insurance as a % of value.",
        step: 0.05,
        suffix: "%",
      },
    ],
  },
  {
    title: "Renting",
    fields: [
      {
        key: "monthlyRent",
        label: "Monthly rent",
        tip: "Rent for an equivalent home today.",
        step: 1_000,
        suffix: "₱",
      },
      {
        key: "rentGrowthPct",
        label: "Rent growth / yr",
        tip: "Annual rent escalation.",
        step: 0.5,
        suffix: "%",
      },
    ],
  },
  {
    title: "Economy & horizon",
    fields: [
      {
        key: "investReturnPct",
        label: "Investment return / yr",
        tip: "What you'd earn investing the cash you didn't sink into the home (MP2, UITF, equities).",
        step: 0.5,
        suffix: "%",
      },
      {
        key: "costInflationPct",
        label: "Inflation / yr",
        tip: "General inflation for recurring costs and the real-peso view.",
        step: 0.5,
        suffix: "%",
      },
      {
        key: "horizonYears",
        label: "Horizon",
        tip: "How many years you'll hold this decision.",
        step: 1,
        suffix: "yrs",
      },
      {
        key: "sellingCostPct",
        label: "Selling cost",
        tip: "Total sale-cost assumption. Actual taxes depend on asset classification and tax base; obtain a property-specific assessment.",
        step: 0.5,
        suffix: "%",
      },
      {
        key: "monthlyIncome",
        label: "Monthly income",
        tip: "Optional — flags whether the mortgage is within the ~30% rule. 0 to skip.",
        step: 5_000,
        suffix: "₱",
      },
    ],
  },
];
