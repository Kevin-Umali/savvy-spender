import type { RentVsBuyInput, RentVsBuyResult, YearRow } from "./types";

const round = (n: number): number => Math.round(n * 100) / 100;

/** Standard annuity payment: P·i / (1 − (1+i)^−n). Falls back to P/n when i = 0. */
export function annuityPayment(principal: number, monthlyRate: number, months: number): number {
  if (months <= 0) return 0;
  if (monthlyRate <= 0) return principal / months;
  const factor = Math.pow(1 + monthlyRate, -months);
  return (principal * monthlyRate) / (1 - factor);
}

/** Remaining loan balance after `paymentsMade` monthly payments. */
function remainingBalance(
  principal: number,
  monthlyRate: number,
  totalMonths: number,
  paymentsMade: number
): number {
  if (paymentsMade >= totalMonths) return 0;
  if (monthlyRate <= 0) return principal * (1 - paymentsMade / totalMonths);
  const pow = (k: number) => Math.pow(1 + monthlyRate, k);
  return principal * ((pow(totalMonths) - pow(paymentsMade)) / (pow(totalMonths) - 1));
}

/**
 * Year-by-year wealth simulation comparing owning a home against renting and
 * investing the difference. The two paths share an identical annual housing
 * budget — whoever spends less that year invests the surplus — so net worth is
 * compared apples-to-apples. This is the single source of truth that the solver,
 * sensitivity, and Monte-Carlo layers all call.
 */
export function simulate(input: RentVsBuyInput): RentVsBuyResult {
  const horizon = Math.max(1, Math.round(input.horizonYears));
  const termMonths = Math.max(0, Math.round(input.loanTermYears * 12));
  const monthlyRate = input.mortgageRatePct / 100 / 12;

  const downPayment = input.price * (input.downPaymentPct / 100);
  const closingCosts = input.price * (input.closingCostPct / 100);
  const loanPrincipal = Math.max(0, input.price - downPayment);
  const upfrontCash = downPayment + closingCosts;
  const monthlyMortgage = annuityPayment(loanPrincipal, monthlyRate, termMonths);
  const totalInterest = monthlyMortgage * termMonths - loanPrincipal;

  const app = input.appreciationPct / 100;
  const rentGrowth = input.rentGrowthPct / 100;
  const inflation = input.costInflationPct / 100;
  const ret = input.investReturnPct / 100;
  const rptEff = (input.assessmentLevelPct / 100) * ((input.rptRatePct + input.sefRatePct) / 100);
  const sellFactor = input.assumeSaleAtHorizon ? 1 - input.sellingCostPct / 100 : 1;

  // Both start with the same liquid cash. The buyer sinks it into the home, so
  // the buyer's side-portfolio starts empty; the renter keeps it invested.
  let buyInvestments = 0;
  let rentPortfolio = upfrontCash;

  let totalOwnOutlay = upfrontCash;
  let totalRentOutlay = 0;

  const rows: YearRow[] = [];

  for (let year = 1; year <= horizon; year++) {
    const propertyValue = input.price * Math.pow(1 + app, year);
    const paymentsMade = Math.min(termMonths, year * 12);
    const loanBalance = remainingBalance(loanPrincipal, monthlyRate, termMonths, paymentsMade);

    // Owning out-of-pocket this year.
    const mortgageThisYear = year * 12 <= termMonths ? monthlyMortgage * 12 : 0;
    const amilyar = propertyValue * rptEff;
    const dues = input.duesPerSqmMonthly * input.floorAreaSqm * 12 * Math.pow(1 + inflation, year - 1);
    const maintenance = propertyValue * (input.maintenancePct / 100);
    const insurance = propertyValue * (input.homeInsurancePct / 100);
    const ownAnnualCost = mortgageThisYear + amilyar + dues + maintenance + insurance;

    // Renting out-of-pocket this year.
    const rentAnnual = input.monthlyRent * 12 * Math.pow(1 + rentGrowth, year - 1);

    // Shared housing budget — the cheaper path invests the surplus.
    const budget = Math.max(ownAnnualCost, rentAnnual);
    buyInvestments = buyInvestments * (1 + ret) + (budget - ownAnnualCost);
    rentPortfolio = rentPortfolio * (1 + ret) + (budget - rentAnnual);

    const buyEquity = propertyValue * sellFactor - loanBalance;
    const buyNetWorth = buyEquity + buyInvestments;
    const rentNetWorth = rentPortfolio;

    totalOwnOutlay += ownAnnualCost;
    totalRentOutlay += rentAnnual;

    rows.push({
      year,
      propertyValue: round(propertyValue),
      loanBalance: round(loanBalance),
      buyEquity: round(buyEquity),
      ownAnnualCost: round(ownAnnualCost),
      rentAnnual: round(rentAnnual),
      buyInvestments: round(buyInvestments),
      rentPortfolio: round(rentPortfolio),
      buyNetWorth: round(buyNetWorth),
      rentNetWorth: round(rentNetWorth),
      netWorthGap: round(buyNetWorth - rentNetWorth),
    });
  }

  const breakEvenRow = rows.find((r) => r.buyNetWorth >= r.rentNetWorth);
  const last = rows[rows.length - 1];

  return {
    input,
    loanPrincipal: round(loanPrincipal),
    monthlyMortgage: round(monthlyMortgage),
    upfrontCash: round(upfrontCash),
    totalInterest: round(Math.max(0, totalInterest)),
    priceToRent: input.monthlyRent > 0 ? round(input.price / (input.monthlyRent * 12)) : 0,
    rows,
    breakEvenYear: breakEvenRow ? breakEvenRow.year : null,
    buyWins: last.buyNetWorth >= last.rentNetWorth,
    buyNetWorthAtHorizon: last.buyNetWorth,
    rentNetWorthAtHorizon: last.rentNetWorth,
    totalOwnOutlay: round(totalOwnOutlay),
    totalRentOutlay: round(totalRentOutlay),
    mortgagePctOfIncome:
      input.monthlyIncome > 0 ? round((monthlyMortgage / input.monthlyIncome) * 100) : null,
  };
}

/** Deflate a nominal peso figure at `year` into today's pesos. */
export function toRealPesos(nominal: number, year: number, inflationPct: number): number {
  return nominal / Math.pow(1 + inflationPct / 100, year);
}
