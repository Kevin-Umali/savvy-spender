import { formatCurrency } from "@/lib/client";
import {
  CASH_STYLE_TYPES,
  FINANCING_TYPE_LABEL,
  MONTHLY_MODE_SHORT,
  ZERO_VALUE_MODES,
  type ComparisonScope,
} from "./options";
import type {
  FeeBreakdown,
  FinancingOption,
  LoanCompareResponse,
  OptionResult,
  Recommendation,
  ScenarioInput,
  VehicleInput,
} from "./types";

const round = (n: number): number => Math.round(n * 100) / 100;

/** Standard annuity payment: P·i / (1 − (1+i)^−n). Falls back to P/n when i = 0. */
function annuityPayment(principal: number, monthlyRate: number, months: number): number {
  if (months <= 0) return 0;
  if (monthlyRate <= 0) return principal / months;
  const factor = Math.pow(1 + monthlyRate, -months);
  return (principal * monthlyRate) / (1 - factor);
}

interface MonthlyResult {
  monthly: number;
  totalLoanPayments: number;
  totalInterest: number;
  totalRepayment: number;
  label: string;
}

/** Resolve the monthly payment, total payments, and interest from the chosen mode. */
function computeMonthly(option: FinancingOption): MonthlyResult {
  const loan = option.loanAmount;
  const n = option.termMonths;
  const label = MONTHLY_MODE_SHORT[option.monthlyMode];

  const fromTotal = (totalRepayment: number, totalInterest: number): MonthlyResult => ({
    monthly: n > 0 ? totalRepayment / n : 0,
    totalLoanPayments: totalRepayment,
    totalInterest,
    totalRepayment,
    label,
  });

  switch (option.monthlyMode) {
    case "monthly_addon": {
      const interest = loan * (option.monthlyAddOnRate / 100) * n;
      return fromTotal(loan + interest, interest);
    }
    case "total_addon": {
      const interest = loan * (option.totalAddOnRate / 100);
      return fromTotal(loan + interest, interest);
    }
    case "annual_effective": {
      const i = Math.pow(1 + option.annualEffectiveRate / 100, 1 / 12) - 1;
      const total = annuityPayment(loan, i, n) * n;
      return fromTotal(total, total - loan);
    }
    case "annual_nominal": {
      const i = option.annualNominalRate / 100 / 12;
      const total = annuityPayment(loan, i, n) * n;
      return fromTotal(total, total - loan);
    }
    case "manual_total":
      return fromTotal(option.manualTotalRepayment, option.manualTotalRepayment - loan);
    case "quoted":
    default:
      return fromTotal(option.quotedMonthly * n, option.quotedMonthly * n - loan);
  }
}

function discountValue(vehicle: VehicleInput): number {
  const base =
    vehicle.discountType === "percent"
      ? (vehicle.originalPrice * vehicle.discountAmount) / 100
      : vehicle.discountAmount;
  return base + vehicle.otherDiscounts;
}

function collectWarnings(
  option: FinancingOption,
  netVehiclePrice: number,
  isCashStyle: boolean,
  downPayment: number,
  insuranceBase: number,
  registrationTotal: number,
  registrationDisplay: number
): string[] {
  const warnings: string[] = [];

  if (option.loanAmount > netVehiclePrice && netVehiclePrice > 0) {
    warnings.push(
      `Loan amount (${formatCurrency(option.loanAmount)}) exceeds the net vehicle price (${formatCurrency(
        netVehiclePrice
      )}).`
    );
  }
  if (!isCashStyle && option.loanAmount > 0 && downPayment > 0) {
    const sum = option.loanAmount + downPayment;
    if (Math.abs(sum - netVehiclePrice) > 1) {
      warnings.push(
        `Down payment + loan (${formatCurrency(sum)}) does not match the net price (${formatCurrency(
          netVehiclePrice
        )}).`
      );
    }
  }
  if (option.monthlyMode === "monthly_addon" && option.monthlyAddOnRate > 5) {
    warnings.push(
      `Monthly add-on rate of ${option.monthlyAddOnRate}% looks high — 0.49 means 0.49%, not 49%.`
    );
  }
  if (option.annualEffectiveRate > 0 && option.monthlyAddOnRate > 0) {
    warnings.push(
      "EIRPA and add-on rate are not directly comparable — compare monthly payment / total interest instead."
    );
  }
  if (insuranceBase === 0 && option.insurance.mode !== "free" && option.insurance.mode !== "included") {
    warnings.push("Comprehensive insurance is excluded — total cost may be understated.");
  }
  if (
    registrationTotal === 0 &&
    !option.registration.includedInDealerPackage &&
    registrationDisplay === 0
  ) {
    warnings.push("LTO registration is missing — add it or mark it as included.");
  }
  return warnings;
}

function computeOption(
  option: FinancingOption,
  vehicle: VehicleInput,
  fullTerm: boolean
): OptionResult {
  const years = Math.max(1, Math.ceil(option.termMonths / 12));

  // Price / discount.
  const applies =
    vehicle.discountAppliesTo === "all" ||
    (vehicle.discountAppliesTo === "selected" && option.receivesDiscount);
  const discount = applies ? discountValue(vehicle) : 0;
  const discountedPrice = vehicle.originalPrice - discount;
  const netVehiclePrice = discountedPrice + vehicle.accessories + vehicle.otherCharges;

  // Monthly payment.
  const monthly = computeMonthly(option);
  const effectiveAddOnRate = option.loanAmount > 0 ? monthly.totalInterest / option.loanAmount : 0;
  const monthlyAddOnEquivalent = option.termMonths > 0 ? effectiveAddOnRate / option.termMonths : 0;

  // Cash structure.
  const isCashStyle = CASH_STYLE_TYPES.includes(option.type);
  const downPayment = isCashStyle ? 0 : option.downPayment;
  const cashPortion = isCashStyle ? Math.max(0, netVehiclePrice - option.loanAmount) : 0;
  const cashSurplus = isCashStyle ? Math.max(0, option.loanAmount - netVehiclePrice) : 0;
  const oneMonthAdvance = option.paymentTiming === "oma" ? monthly.monthly : 0;

  // Fees (double-count safe).
  const fees: FeeBreakdown[] = option.fees.map((fee) => {
    const counted = !fee.waived && !fee.includedInMonthly && !fee.includedInUpfront;
    return {
      name: fee.name || "Fee",
      amount: counted ? fee.amount : 0,
      display: fee.waived ? fee.waivedAmount : fee.amount,
      timing: fee.timing,
      counted,
      waived: fee.waived,
    };
  });

  let upfrontFees = 0;
  let feesInTotal = 0;
  let waivedFeesTotal = 0;
  for (const fee of option.fees) {
    if (fee.waived) {
      waivedFeesTotal += fee.waivedAmount;
      continue;
    }
    if (fee.includedInMonthly || fee.includedInUpfront) continue;
    const expanded =
      fee.timing === "monthly"
        ? fee.amount * option.termMonths
        : fee.timing === "annual"
        ? fee.amount * (fullTerm ? years : 1)
        : fee.amount;
    feesInTotal += expanded;
    if (fee.timing === "upfront") upfrontFees += fee.amount;
  }

  // Insurance.
  const insuranceDisplay =
    option.insurance.comprehensive + option.insurance.ctpl + option.insurance.actsOfNature;
  const insuranceBase = ZERO_VALUE_MODES.includes(option.insurance.mode) ? 0 : insuranceDisplay;
  const insuranceYears = option.insurance.recurringYearly && fullTerm ? years : 1;
  const insuranceTotal = insuranceBase * insuranceYears;
  const insuranceUpfront = insuranceBase; // first year paid at purchase

  // Registration.
  const registrationDisplay =
    option.registration.ltoRegistration +
    option.registration.plateFee +
    option.registration.ctpl +
    option.registration.otherLto;
  const registrationTotal =
    ZERO_VALUE_MODES.includes(option.registration.mode) ||
    option.registration.includedInDealerPackage
      ? 0
      : registrationDisplay;

  // Aggregates.
  const principalCashOut = downPayment + cashPortion + vehicle.reservationFee;
  const upfrontCash =
    principalCashOut + oneMonthAdvance + upfrontFees + insuranceUpfront + registrationTotal;
  const totalCost =
    principalCashOut +
    monthly.totalLoanPayments +
    feesInTotal +
    insuranceTotal +
    registrationTotal;

  const warnings = collectWarnings(
    option,
    netVehiclePrice,
    isCashStyle,
    downPayment,
    insuranceBase,
    registrationTotal,
    registrationDisplay
  );

  return {
    id: option.id,
    name: option.name || FINANCING_TYPE_LABEL[option.type],
    type: option.type,
    typeLabel: FINANCING_TYPE_LABEL[option.type],
    provider: option.provider,
    discountApplied: applies && discount > 0,
    discountedPrice: round(discountedPrice),
    netVehiclePrice: round(netVehiclePrice),
    termMonths: option.termMonths,
    paymentTiming: option.paymentTiming,
    paymentTypeLabel:
      option.paymentTiming === "oma"
        ? "OMA (1st month upfront)"
        : option.paymentTiming === "arrears"
        ? "Arrears"
        : "Custom",
    monthlyMode: option.monthlyMode,
    monthlyLabel: monthly.label,
    monthlyPayment: round(monthly.monthly),
    totalLoanPayments: round(monthly.totalLoanPayments),
    totalInterest: round(monthly.totalInterest),
    totalRepayment: round(monthly.totalRepayment),
    effectiveAddOnRate: round(effectiveAddOnRate * 100) / 100,
    monthlyAddOnEquivalent: Math.round(monthlyAddOnEquivalent * 10000) / 10000,
    eirpa: option.annualEffectiveRate > 0 ? option.annualEffectiveRate : undefined,
    loanAmount: round(option.loanAmount),
    downPayment: round(downPayment),
    cashPortion: round(cashPortion),
    cashSurplus: round(cashSurplus),
    oneMonthAdvance: round(oneMonthAdvance),
    reservationFee: round(vehicle.reservationFee),
    fees,
    upfrontFees: round(upfrontFees),
    feesInTotal: round(feesInTotal),
    waivedFeesTotal: round(waivedFeesTotal),
    insuranceTotal: round(insuranceTotal),
    insuranceDisplay: round(insuranceDisplay),
    registrationTotal: round(registrationTotal),
    registrationDisplay: round(registrationDisplay),
    upfrontCash: round(upfrontCash),
    totalCost: round(totalCost),
    financingCostAboveDiscounted: round(totalCost - netVehiclePrice),
    differenceVsCheapest: 0, // filled in after ranking
    warnings,
  };
}

/** The metric a given comparison scope ranks options by. */
export function scopeMetric(result: OptionResult, scope: ComparisonScope): number {
  switch (scope) {
    case "loan_only":
      return result.totalLoanPayments;
    case "upfront":
      return result.upfrontCash;
    case "fee_inclusive":
      return (
        result.totalLoanPayments +
        result.feesInTotal +
        result.insuranceTotal +
        result.registrationTotal
      );
    case "full_purchase":
    default:
      return result.totalCost;
  }
}

function buildRecommendations(results: OptionResult[]): Recommendation[] {
  if (results.length === 0) return [];
  const minBy = (select: (r: OptionResult) => number): OptionResult =>
    results.reduce((a, b) => (select(a) <= select(b) ? a : b));
  const cashStyle = results.filter((r) => CASH_STYLE_TYPES.includes(r.type));

  const lowestTotal = minBy((r) => r.totalCost);
  const lowestMonthly = minBy((r) => r.monthlyPayment);
  const lowestUpfront = minBy((r) => r.upfrontCash);
  const lowestInterest = minBy((r) => r.totalInterest);
  const noChattel = [...cashStyle].sort((a, b) => a.totalCost - b.totalCost)[0] ?? lowestTotal;
  const simplest =
    [...cashStyle].sort((a, b) => a.fees.length - b.fees.length)[0] ?? minBy((r) => r.fees.length);

  return [
    {
      key: "lowest-total",
      label: "Lowest total cost",
      optionId: lowestTotal.id,
      optionName: lowestTotal.name,
      detail: formatCurrency(lowestTotal.totalCost),
    },
    {
      key: "lowest-monthly",
      label: "Lowest monthly payment",
      optionId: lowestMonthly.id,
      optionName: lowestMonthly.name,
      detail: `${formatCurrency(lowestMonthly.monthlyPayment)}/mo`,
    },
    {
      key: "lowest-upfront",
      label: "Lowest upfront cash",
      optionId: lowestUpfront.id,
      optionName: lowestUpfront.name,
      detail: formatCurrency(lowestUpfront.upfrontCash),
    },
    {
      key: "lowest-interest",
      label: "Lowest interest",
      optionId: lowestInterest.id,
      optionName: lowestInterest.name,
      detail: formatCurrency(lowestInterest.totalInterest),
    },
    {
      key: "no-chattel",
      label: "No chattel mortgage",
      optionId: noChattel.id,
      optionName: noChattel.name,
      detail: "Cash-style purchase — no encumbrance",
    },
    {
      key: "simplest",
      label: "Simplest process",
      optionId: simplest.id,
      optionName: simplest.name,
      detail: "Fewest fees / no bank collateral",
    },
  ];
}

export function computeComparison(scenario: ScenarioInput): LoanCompareResponse {
  const { vehicle, options, scope, fullTerm } = scenario;
  const results = options.map((option) => computeOption(option, vehicle, fullTerm));

  let cheapestId: string | null = null;
  if (results.length > 0) {
    const cheapest = results.reduce((a, b) =>
      scopeMetric(a, scope) <= scopeMetric(b, scope) ? a : b
    );
    cheapestId = cheapest.id;
    const base = scopeMetric(cheapest, scope);
    for (const result of results) {
      result.differenceVsCheapest = round(scopeMetric(result, scope) - base);
    }
  }

  return {
    vehicleName: vehicle.name,
    originalPrice: vehicle.originalPrice,
    discountAmount: vehicle.discountAmount,
    discountType: vehicle.discountType,
    discountAppliesTo: vehicle.discountAppliesTo,
    scope,
    fullTerm,
    cheapestId,
    results,
    recommendations: buildRecommendations(results),
  };
}
