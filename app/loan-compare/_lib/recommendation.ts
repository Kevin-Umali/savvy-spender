import { formatCurrency } from "@/lib/client";
import { CASH_STYLE_TYPES, type Priority } from "./options";
import type { OptionResult } from "./types";

/** Normalize a metric to 0..1 where 0 = best (lowest). */
function normalize(values: number[]): number[] {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min;
  if (span === 0) return values.map(() => 0);
  return values.map((v) => (v - min) / span);
}

interface Scored {
  result: OptionResult;
  score: number;
}

/** Weighted balanced score: lower is better. */
export function balancedRanking(results: OptionResult[]): Scored[] {
  if (results.length === 0) return [];
  const total = normalize(results.map((r) => r.totalCost));
  const monthly = normalize(results.map((r) => r.monthlyPayment));
  const upfront = normalize(results.map((r) => r.upfrontCash));
  const fees = normalize(results.map((r) => r.feesInTotal + r.insuranceTotal + r.registrationTotal));
  const complexity = normalize(
    results.map((r) => r.fees.length + (CASH_STYLE_TYPES.includes(r.type) ? 0 : 1))
  );

  return results
    .map((r, i) => ({
      result: r,
      // total cost weighted most heavily, then monthly, upfront, fees, complexity
      score:
        total[i] * 0.4 +
        monthly[i] * 0.2 +
        upfront[i] * 0.2 +
        fees[i] * 0.1 +
        complexity[i] * 0.1,
    }))
    .sort((a, b) => a.score - b.score);
}

export function pickByPriority(results: OptionResult[], priority: Priority): OptionResult {
  const minBy = (sel: (r: OptionResult) => number) =>
    results.reduce((a, b) => (sel(a) <= sel(b) ? a : b));

  switch (priority) {
    case "lowest-total":
      return minBy((r) => r.totalCost);
    case "lowest-monthly":
      return minBy((r) => r.monthlyPayment);
    case "lowest-upfront":
      return minBy((r) => r.upfrontCash);
    case "lowest-interest":
      return minBy((r) => r.totalInterest);
    case "no-chattel":
    case "ownership-flexibility":
      return (
        results
          .filter((r) => CASH_STYLE_TYPES.includes(r.type))
          .sort((a, b) => a.totalCost - b.totalCost)[0] ?? minBy((r) => r.totalCost)
      );
    case "fastest-approval":
    case "lowest-paperwork":
      return (
        results
          .filter((r) => CASH_STYLE_TYPES.includes(r.type))
          .sort((a, b) => a.fees.length - b.fees.length)[0] ?? minBy((r) => r.fees.length)
      );
    case "balanced":
    default:
      return balancedRanking(results)[0]?.result ?? results[0];
  }
}

export function priorityRationale(
  priority: Priority,
  winner: OptionResult,
  results: OptionResult[]
): string {
  const others = results.filter((r) => r.id !== winner.id);
  const cheapestOther = others.length
    ? others.reduce((a, b) => (a.totalCost <= b.totalCost ? a : b))
    : null;
  const gap =
    cheapestOther && cheapestOther.totalCost > winner.totalCost
      ? ` — ${formatCurrency(cheapestOther.totalCost - winner.totalCost)} cheaper than ${cheapestOther.name}`
      : "";

  switch (priority) {
    case "lowest-monthly":
      return `${winner.name} has the lowest monthly outlay at ${formatCurrency(
        winner.monthlyPayment
      )} for ${winner.termMonths} months.`;
    case "lowest-upfront":
      return `${winner.name} needs the least cash at signing: ${formatCurrency(winner.upfrontCash)}.`;
    case "lowest-interest":
      return `${winner.name} carries the lowest total interest: ${formatCurrency(
        winner.totalInterest
      )}.`;
    case "lowest-total":
      return `${winner.name} has the lowest lifecycle cost: ${formatCurrency(
        winner.totalCost
      )} over ${winner.termMonths} months${gap}.`;
    case "no-chattel":
      return `${winner.name} is a cash-style purchase, so there is no chattel mortgage or bank encumbrance.`;
    case "fastest-approval":
      return `${winner.name} typically funds fastest from an existing credit line, with the least paperwork.`;
    case "lowest-paperwork":
      return `${winner.name} has the fewest itemized fees and no bank collateral process.`;
    case "ownership-flexibility":
      return `${winner.name} leaves the title unencumbered, so you can resell or transfer without a lender's release.`;
    case "balanced":
    default:
      return `${winner.name} wins the balanced score across total cost, monthly payment, upfront cash, and fees: total ${formatCurrency(
        winner.totalCost
      )}${gap}.`;
  }
}
