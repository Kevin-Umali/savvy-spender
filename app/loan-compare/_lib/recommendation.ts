import { formatCurrency } from "@/lib/client";
import type { Priority } from "./options";
import type { OptionResult } from "./types";

export interface Recommendations {
  lowestMonthly: OptionResult;
  lowestUpfront: OptionResult;
  lowestTotal: OptionResult;
  noChattel: OptionResult;
}

export function computeRecommendations(results: OptionResult[]): Recommendations {
  const lowestMonthly = results.reduce((a, b) => (a.monthlyPayment < b.monthlyPayment ? a : b));
  const lowestUpfront = results.reduce((a, b) => (a.upfrontCash < b.upfrontCash ? a : b));
  const lowestTotal = results.reduce((a, b) => (a.totalCost < b.totalCost ? a : b));
  const noChattel = results.find((r) => r.key === "c2c") ?? results[0];
  return { lowestMonthly, lowestUpfront, lowestTotal, noChattel };
}

export function pickByPriority(results: OptionResult[], priority: Priority): OptionResult {
  switch (priority) {
    case "lowest-monthly":
      return results.reduce((a, b) => (a.monthlyPayment < b.monthlyPayment ? a : b));
    case "lowest-upfront":
      return results.reduce((a, b) => (a.upfrontCash < b.upfrontCash ? a : b));
    case "lowest-total":
      return results.reduce((a, b) => (a.totalCost < b.totalCost ? a : b));
    case "no-chattel":
      return results.find((r) => r.key === "c2c") ?? results[0];
    case "fastest-approval":
      return (
        results.find((r) => r.key === "c2c") ??
        results.find((r) => r.key === "in-house") ??
        results[0]
      );
    case "ownership-flexibility":
      return results.find((r) => r.key === "c2c") ?? results[0];
  }
}

export function priorityRationale(priority: Priority, winner: OptionResult): string {
  switch (priority) {
    case "lowest-monthly":
      return `Cheapest monthly outlay at ${formatCurrency(winner.monthlyPayment)} for ${winner.termMonths} months.`;
    case "lowest-upfront":
      return `Lowest cash required at signing: ${formatCurrency(winner.upfrontCash)}.`;
    case "lowest-total":
      return `Lowest lifecycle cost: ${formatCurrency(winner.totalCost)} over ${winner.termMonths} months.`;
    case "no-chattel":
      return "Credit-to-cash is a cash purchase from the dealer's perspective, so no chattel mortgage is needed.";
    case "fastest-approval":
      return "Credit-to-cash typically funds in days from a credit limit you already have. In-house is the next-fastest option.";
    case "ownership-flexibility":
      return "Paid as cash with no encumbrance, so you can resell or transfer the title without a bank's release.";
  }
}
