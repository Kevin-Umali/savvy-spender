import type { RentVsBuyInput } from "./types";
import type { NumberBounds } from "@/lib/query-parsers";

export const INPUT_BOUNDS: NumberBounds<RentVsBuyInput> = {
  price: [0, 1e12],
  floorAreaSqm: [0, 1e6],
  appreciationPct: [-50, 100],
  downPaymentPct: [0, 100],
  mortgageRatePct: [0, 100],
  loanTermYears: [1, 50],
  closingCostPct: [0, 100],
  assessmentLevelPct: [0, 100],
  rptRatePct: [0, 100],
  sefRatePct: [0, 100],
  maintenancePct: [0, 100],
  homeInsurancePct: [0, 100],
  monthlyRent: [0, 1e12],
  duesPerSqmMonthly: [0, 1e12],
  rentGrowthPct: [-50, 100],
  investReturnPct: [-50, 100],
  costInflationPct: [-50, 100],
  horizonYears: [1, 60],
  sellingCostPct: [0, 100],
  monthlyIncome: [0, 1e12],
};

/** Compact short codes so a shared link stays readable. */
const CODES: Record<string, keyof RentVsBuyInput> = {
  p: "price",
  fa: "floorAreaSqm",
  ap: "appreciationPct",
  dp: "downPaymentPct",
  mr: "mortgageRatePct",
  lt: "loanTermYears",
  cc: "closingCostPct",
  al: "assessmentLevelPct",
  rp: "rptRatePct",
  sf: "sefRatePct",
  du: "duesPerSqmMonthly",
  mt: "maintenancePct",
  hi: "homeInsurancePct",
  rn: "monthlyRent",
  rg: "rentGrowthPct",
  ir: "investReturnPct",
  cf: "costInflationPct",
  hz: "horizonYears",
  sc: "sellingCostPct",
  in: "monthlyIncome",
};

export const QUERY_CODES = {
  ...Object.fromEntries(
    Object.entries(CODES).map(([code, field]) => [field, code]),
  ),
  assumeSaleAtHorizon: "sl",
} as Record<keyof RentVsBuyInput, string>;
