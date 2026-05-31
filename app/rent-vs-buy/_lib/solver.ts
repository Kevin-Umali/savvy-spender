import { simulate } from "./compute";
import type { RentVsBuyInput, SensitivityBar, SolveResult } from "./types";

type NumericKey = keyof Pick<
  RentVsBuyInput,
  "appreciationPct" | "investReturnPct" | "monthlyRent" | "mortgageRatePct" | "downPaymentPct"
>;

/** Net-worth gap (buy − rent) at the horizon when `key` is set to `value`. */
function gapAt(input: RentVsBuyInput, key: keyof RentVsBuyInput, value: number): number {
  const r = simulate({ ...input, [key]: value });
  return r.buyNetWorthAtHorizon - r.rentNetWorthAtHorizon;
}

/**
 * Goal-seek by bisection: find the value of `key` at which buying and renting
 * break even at the horizon (the gap crosses zero). Works for any monotone
 * lever regardless of direction, as long as the bracket contains a sign change.
 */
export function solveForBreakEven(
  input: RentVsBuyInput,
  key: NumericKey,
  lo: number,
  hi: number
): SolveResult {
  const fLo = gapAt(input, key, lo);
  const fHi = gapAt(input, key, hi);

  if (Number.isNaN(fLo) || Number.isNaN(fHi)) {
    return { solved: false, value: null, message: "Could not evaluate the scenario." };
  }
  if (fLo === 0) return { solved: true, value: lo, message: "" };
  if (fHi === 0) return { solved: true, value: hi, message: "" };
  if (fLo > 0 && fHi > 0) {
    return { solved: false, value: null, message: "Buying wins across the entire range." };
  }
  if (fLo < 0 && fHi < 0) {
    return { solved: false, value: null, message: "Renting wins across the entire range." };
  }

  let a = lo;
  let b = hi;
  let fa = fLo;
  for (let i = 0; i < 60; i++) {
    const mid = (a + b) / 2;
    const fm = gapAt(input, key, mid);
    if (Math.abs(fm) < 1 || b - a < 1e-4) {
      return { solved: true, value: Math.round(mid * 100) / 100, message: "" };
    }
    if ((fa < 0 && fm < 0) || (fa > 0 && fm > 0)) {
      a = mid;
      fa = fm;
    } else {
      b = mid;
    }
  }
  return { solved: true, value: Math.round(((a + b) / 2) * 100) / 100, message: "" };
}

const SENSITIVITY_FIELDS: { key: keyof RentVsBuyInput; label: string }[] = [
  { key: "appreciationPct", label: "Property appreciation" },
  { key: "investReturnPct", label: "Investment return" },
  { key: "mortgageRatePct", label: "Mortgage rate" },
  { key: "monthlyRent", label: "Monthly rent" },
  { key: "price", label: "Property price" },
  { key: "downPaymentPct", label: "Down payment" },
  { key: "rentGrowthPct", label: "Rent growth" },
];

/**
 * Tornado sensitivity: shift each lever ±20% (relative) and measure how far the
 * net-worth gap at the horizon swings. Ranked by absolute swing — the biggest
 * bar is the assumption the decision hinges on.
 */
export function sensitivity(input: RentVsBuyInput): SensitivityBar[] {
  const bars = SENSITIVITY_FIELDS.map(({ key, label }) => {
    const base = input[key] as number;
    const span = base === 0 ? 1 : Math.abs(base) * 0.2;
    const lowGap = gapAt(input, key, base - span);
    const highGap = gapAt(input, key, base + span);
    return {
      key,
      label,
      lowGap: Math.round(lowGap),
      highGap: Math.round(highGap),
      swing: Math.abs(highGap - lowGap),
    };
  });
  return bars.sort((a, b) => b.swing - a.swing);
}
