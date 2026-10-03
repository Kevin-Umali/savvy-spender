export const DEFAULTS = {
  minimum: 1198400, bid: 2399999.99, mode: "long",
  cashDiscount: 30, shortDiscount: 20, longDiscount: 30, customDiscount: 30,
  annualRate: 6.25, years: 30, months: 12, shortRate: 0,
  downMode: "percent", downPercent: 10, downAmount: 0, monthlyBudget: 0,
};
export type BidInput = typeof DEFAULTS;
export const CODES: Record<keyof BidInput, string> = {
  minimum: "min", bid: "bid", mode: "mode", cashDiscount: "cash", shortDiscount: "short",
  longDiscount: "long", customDiscount: "custom", annualRate: "rate", years: "years",
  months: "months", shortRate: "sr", downMode: "dpMode", downPercent: "dp", downAmount: "down", monthlyBudget: "budget",
};
export const MODES = [
  { value: "cash", label: "Cash", discountKey: "cashDiscount" },
  { value: "short", label: "Short-term", discountKey: "shortDiscount" },
  { value: "long", label: "Long-term", discountKey: "longDiscount" },
] as const;
export const peso = (value: number) => new Intl.NumberFormat("en-PH", {
  style: "currency", currency: "PHP", maximumFractionDigits: 2,
}).format(value);
export const netPrice = (bid: number, discount: number) => bid * (1 - discount / 100);

export function monthlyPayment(principal: number, annualRate: number, months: number): number {
  const r = annualRate / 1200;
  if (principal === 0) return 0;
  if (r === 0) return principal / months;
  // Stable even for very small interest rates.
  return principal * r / -Math.expm1(-months * Math.log1p(r));
}

export function validateInput(input: BidInput): string | null {
  for (const [key, value] of Object.entries(input)) {
    if (typeof value === "number" && (!Number.isFinite(value) || value < 0)) return "Enter valid, non-negative amounts and rates.";
  }
  if (!MODES.some((m) => m.value === input.mode)) return "Choose a payment mode.";
  if (!["percent", "amount"].includes(input.downMode)) return "Choose how to enter the down payment.";
  if (input.downAmount > 1e12 || input.monthlyBudget > 1e12) return "Enter down payment and budget amounts no greater than ₱1 trillion.";
  if (input.bid <= 0 || input.minimum <= 0 || input.bid > 1e12 || input.minimum > 1e12) return "Enter an offer and minimum price between ₱0.01 and ₱1 trillion.";
  if ([input.cashDiscount, input.shortDiscount, input.longDiscount, input.customDiscount, input.downPercent].some((n) => n > 100)) return "Discounts and down payment percentages must be between 0 and 100.";
  if (input.annualRate > 100 || input.shortRate > 100) return "Enter an annual interest rate between 0 and 100%.";
  if (!Number.isInteger(input.years) || input.years < 1 || input.years > 30) return "Choose a long-term duration from 1 to 30 years.";
  if (!Number.isInteger(input.months) || input.months < 1 || input.months > 12) return "Choose a short-term duration from 1 to 12 months.";
  const discount = MODES.find((m) => m.value === input.mode)!;
  if (input.mode !== "cash" && input.downMode === "amount" && input.downAmount > netPrice(input.bid, input[discount.discountKey])) return "Down payment cannot exceed the selected net price.";
  return null;
}

export function computeBid(input: BidInput) {
  const error = validateInput(input);
  if (error) throw new RangeError(error);
  const selected = MODES.find((m) => m.value === input.mode)!;
  const discount = input[selected.discountKey];
  const net = netPrice(input.bid, discount);
  const down = input.mode === "cash" ? net : input.downMode === "amount" ? input.downAmount : net * input.downPercent / 100;
  const principal = net - down;
  const months = input.mode === "long" ? input.years * 12 : input.mode === "short" ? input.months : 0;
  const rate = input.mode === "long" ? input.annualRate : input.shortRate;
  const monthly = months ? monthlyPayment(principal, rate, months) : 0;
  const totalPayments = monthly * months;
  return { net, discount, saved: input.bid - net, down, principal, months, monthly,
    totalPayments, interest: Math.max(0, totalPayments - principal), totalOutlay: down + totalPayments,
    premium: input.bid - input.minimum,
    premiumPercent: (input.bid / input.minimum - 1) * 100,
    minimumNet: netPrice(input.minimum, discount),
    extraNet: netPrice(input.bid - input.minimum, discount),
  };
}

/** Budget constrains installments only; the corresponding upfront amount is separate. */
export function offerForBudget(input: BidInput): { offer: number; down: number } | null {
  if (validateInput(input) || input.mode === "cash" || input.monthlyBudget <= 0) return null;
  const selected = MODES.find((mode) => mode.value === input.mode)!;
  const netFraction = 1 - input[selected.discountKey] / 100;
  const downFraction = input.downMode === "percent" ? input.downPercent / 100 : 0;
  if (netFraction <= 0 || downFraction >= 1) return null;
  const months = input.mode === "long" ? input.years * 12 : input.months;
  const rate = input.mode === "long" ? input.annualRate : input.shortRate;
  const financed = input.monthlyBudget / monthlyPayment(1, rate, months);
  const net = input.downMode === "amount" ? financed + input.downAmount : financed / (1 - downFraction);
  return { offer: net / netFraction, down: net - financed };
}
