import { DEFAULT_INPUT } from "./defaults";
import type { RentVsBuyInput } from "./types";

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

const FIELD_TO_CODE = Object.fromEntries(
  Object.entries(CODES).map(([code, field]) => [field, code])
) as Record<keyof RentVsBuyInput, string>;

/** Encode inputs into a query string (only values that differ from defaults). */
export function encodeInput(input: RentVsBuyInput): string {
  const params = new URLSearchParams();
  for (const [code, field] of Object.entries(CODES)) {
    const value = input[field] as number;
    if (value !== (DEFAULT_INPUT[field] as number)) params.set(code, String(value));
  }
  if (input.assumeSaleAtHorizon !== DEFAULT_INPUT.assumeSaleAtHorizon) {
    params.set("sl", input.assumeSaleAtHorizon ? "1" : "0");
  }
  return params.toString();
}

/** Rebuild a full input from a query string, falling back to defaults. */
export function decodeInput(params: URLSearchParams): RentVsBuyInput {
  const input: RentVsBuyInput = { ...DEFAULT_INPUT };
  for (const [code, field] of Object.entries(CODES)) {
    const raw = params.get(code);
    if (raw === null) continue;
    const num = Number(raw);
    if (Number.isFinite(num)) (input[field] as number) = num;
  }
  const sl = params.get("sl");
  if (sl !== null) input.assumeSaleAtHorizon = sl === "1";
  return input;
}

export { FIELD_TO_CODE };
