/** All user-editable inputs for the Rent vs. Buy simulation. */
export interface RentVsBuyInput {
  // Property
  price: number; // PHP purchase price
  floorAreaSqm: number;
  appreciationPct: number; // annual property appreciation

  // Financing
  downPaymentPct: number;
  mortgageRatePct: number; // annual nominal rate
  loanTermYears: number;
  closingCostPct: number; // one-time, % of price (DST + transfer + registration + professional)

  // Carrying costs
  assessmentLevelPct: number; // RPT assessment level (residential ≈ 20%)
  rptRatePct: number; // real property tax rate (Metro Manila max 2%)
  sefRatePct: number; // Special Education Fund (1%)
  duesPerSqmMonthly: number; // association dues, PHP / sqm / month
  maintenancePct: number; // annual, % of property value
  homeInsurancePct: number; // annual, % of property value

  // Renting
  monthlyRent: number;
  rentGrowthPct: number; // annual rent escalation

  // Opportunity cost / economy
  investReturnPct: number; // annual return on invested cash
  costInflationPct: number; // general inflation for recurring costs + real-peso deflator

  // Horizon / exit
  horizonYears: number;
  assumeSaleAtHorizon: boolean; // value equity net of selling costs
  sellingCostPct: number; // CGT 6% + broker ~3% + notarial

  // Optional reality checks
  monthlyIncome: number; // 0 = not provided
}

/** One simulated year. Both net-worth figures are nominal pesos. */
export interface YearRow {
  year: number;
  propertyValue: number;
  loanBalance: number;
  buyEquity: number; // property value − loan balance − (selling costs if assuming sale)
  ownAnnualCost: number; // mortgage + carrying costs that year
  rentAnnual: number;
  buyInvestments: number; // surplus the buyer invested vs. the shared housing budget
  rentPortfolio: number; // renter's invested portfolio
  buyNetWorth: number; // buyEquity + buyInvestments
  rentNetWorth: number; // rentPortfolio
  netWorthGap: number; // buyNetWorth − rentNetWorth
}

export interface RentVsBuyResult {
  input: RentVsBuyInput;
  loanPrincipal: number;
  monthlyMortgage: number;
  upfrontCash: number; // down payment + closing costs
  totalInterest: number; // over the full loan term
  priceToRent: number; // price ÷ annual rent
  rows: YearRow[];
  breakEvenYear: number | null; // first year buy net worth ≥ rent net worth (null ⇒ renting wins)
  buyWins: boolean; // at the horizon
  buyNetWorthAtHorizon: number;
  rentNetWorthAtHorizon: number;
  totalOwnOutlay: number; // upfront + all owning out-of-pocket over horizon
  totalRentOutlay: number; // all rent over horizon
  mortgagePctOfIncome: number | null; // monthly mortgage ÷ monthly income
}

/** A single goal-seek (inverse) answer. */
export interface SolveResult {
  solved: boolean;
  value: number | null; // the input value that flips/meets the target
  message: string;
}

/** One bar in the sensitivity tornado. */
export interface SensitivityBar {
  key: keyof RentVsBuyInput;
  label: string;
  lowGap: number; // net-worth gap @ horizon when input is shifted down
  highGap: number; // … shifted up
  swing: number; // |highGap − lowGap| — used for ranking
}

export interface MonteCarloResult {
  runs: number;
  pBuyWins: number; // probability buy net worth ≥ rent net worth at horizon
  breakEvenP50: number | null; // median break-even year across runs that ever break even
  pEverBreakEven: number; // share of runs that break even within the horizon
  bands: { year: number; p10: number; p50: number; p90: number }[]; // net-worth gap percentile bands
}
