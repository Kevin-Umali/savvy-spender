import { createParser, parseAsStringLiteral } from "nuqs/server";
import { createToolParsers } from "@/lib/query-parsers";

export const CALC_DEFAULTS = {
  calculatorType: "balance-conversion" as const,
  amount: 10000,
  interestRate: 0.99,
  numInstallments: "3",
  processingFee: 0,
  installmentAmount: 0,
  monthlyBudget: 0,
  dstExempt: false,
};
export const calculatorParsers = {
  ...createToolParsers(CALC_DEFAULTS),
  calculatorType: parseAsStringLiteral([
    "balance-conversion",
    "credit-to-cash",
    "personal-loan",
  ] as const).withDefault("balance-conversion"),
  customPlanList: createParser({
    parse: (raw) => {
      const terms = raw.split(",");
      return terms.length <= 30 &&
        terms.every((t) => /^\d+$/.test(t) && +t >= 1 && +t <= 360)
        ? terms
        : null;
    },
    serialize: (terms: string[]) => terms.join(","),
    eq: (a, b) => a.join(",") === b.join(","),
  }),
};
// Maintain existing links from the bank reference page.
export const calculatorUrlKeys = {
  calculatorType: "type",
  amount: "amt",
  interestRate: "rate",
  numInstallments: "term",
  processingFee: "fee",
  installmentAmount: "merchant",
  monthlyBudget: "budget",
  customPlanList: "plans",
  dstExempt: "exempt",
};
