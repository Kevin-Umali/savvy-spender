import { simulate } from "./compute";
import type { MonteCarloResult, RentVsBuyInput } from "./types";

/**
 * Uncertainty around the three assumptions that matter most. Each is a +/-
 * spread (in percentage points) applied as a symmetric triangular distribution
 * around the user's point estimate.
 */
export const MC_SPREADS = {
  appreciationPct: 3,
  investReturnPct: 3,
  rentGrowthPct: 2,
} as const;

/** Triangular draw in [c − s, c + s] with the mode at c (mean-reverting to the point estimate). */
function triangular(center: number, spread: number, rnd: () => number): number {
  // Sum of two uniforms ≈ triangular distribution centred on `center`.
  const u = (rnd() + rnd()) / 2; // in [0, 1], peaked at 0.5
  return center + (u * 2 - 1) * spread;
}

/** Deterministic PRNG (mulberry32) so a given scenario yields a stable result. */
function makeRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const idx = Math.min(sorted.length - 1, Math.max(0, Math.round((p / 100) * (sorted.length - 1))));
  return sorted[idx];
}

/**
 * Run many simulations with the key assumptions sampled from their uncertainty
 * ranges. Returns the probability buying wins, the median break-even year, and
 * P10/P50/P90 net-worth-gap bands per year for the fan chart.
 */
export function monteCarlo(input: RentVsBuyInput, runs = 2000): MonteCarloResult {
  const horizon = Math.max(1, Math.round(input.horizonYears));
  const rng = makeRng(Math.round(input.price + input.monthlyRent + input.mortgageRatePct * 1000));

  let buyWins = 0;
  let everBreakEven = 0;
  const breakEvenYears: number[] = [];
  const gapByYear: number[][] = Array.from({ length: horizon }, () => []);

  for (let i = 0; i < runs; i++) {
    const sample: RentVsBuyInput = {
      ...input,
      appreciationPct: triangular(input.appreciationPct, MC_SPREADS.appreciationPct, rng),
      investReturnPct: triangular(input.investReturnPct, MC_SPREADS.investReturnPct, rng),
      rentGrowthPct: triangular(input.rentGrowthPct, MC_SPREADS.rentGrowthPct, rng),
    };
    const r = simulate(sample);
    if (r.buyWins) buyWins++;
    if (r.breakEvenYear !== null) {
      everBreakEven++;
      breakEvenYears.push(r.breakEvenYear);
    }
    r.rows.forEach((row, y) => gapByYear[y].push(row.netWorthGap));
  }

  breakEvenYears.sort((a, b) => a - b);
  const bands = gapByYear.map((gaps, y) => {
    const sorted = [...gaps].sort((a, b) => a - b);
    return {
      year: y + 1,
      p10: Math.round(percentile(sorted, 10)),
      p50: Math.round(percentile(sorted, 50)),
      p90: Math.round(percentile(sorted, 90)),
    };
  });

  return {
    runs,
    pBuyWins: buyWins / runs,
    pEverBreakEven: everBreakEven / runs,
    breakEvenP50: breakEvenYears.length ? percentile(breakEvenYears, 50) : null,
    bands,
  };
}
