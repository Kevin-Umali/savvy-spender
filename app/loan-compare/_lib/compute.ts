import type { DiscountAppliesTo, FinancingKey } from "./options";
import type { LoanCompareResponse, OptionResult, ScenarioInput } from "./types";

function discountApplies(
  key: FinancingKey,
  appliesTo: DiscountAppliesTo,
  selected: FinancingKey[]
): boolean {
  if (appliesTo === "all") return true;
  if (appliesTo === "none") return false;
  if (appliesTo === "selected") return selected.includes(key);
  return appliesTo === key;
}

const round = (n: number): number => Math.round(n * 100) / 100;

export function computeComparison(scenario: ScenarioInput): LoanCompareResponse {
  const { vehicle, bank, c2c, inHouse } = scenario;
  const discount = Math.max(0, vehicle.dealerDiscount || 0);
  const priceFor = (key: FinancingKey) =>
    vehicle.originalPrice -
    (discountApplies(key, vehicle.discountAppliesTo, vehicle.selectedOptions) ? discount : 0);

  const bankResult: OptionResult = (() => {
    const warnings: string[] = [];
    const discounted = priceFor("bank");
    const applied = discountApplies("bank", vehicle.discountAppliesTo, vehicle.selectedOptions);

    const totalFees =
      bank.chattelMortgage +
      bank.bankFees +
      bank.docStampTax +
      bank.notarial +
      bank.ltoEncumbrance +
      bank.registration +
      bank.comprehensiveInsurance +
      bank.ctpl +
      bank.otherFees;

    const requiredDP = bank.downPayment;
    const implied = discounted - requiredDP;
    if (bank.loanAmount > 0 && Math.abs(bank.loanAmount - implied) > 1) {
      warnings.push(
        `Loan amount (${bank.loanAmount.toLocaleString()}) does not equal discounted price − down payment (${implied.toLocaleString()}). Check inputs.`
      );
    }

    const oma = bank.paymentType === "oma" ? bank.monthlyAmortization : 0;
    const totalMonthly = bank.monthlyAmortization * bank.termMonths;
    const upfront = requiredDP + oma + totalFees;
    const totalCost = requiredDP + totalMonthly + totalFees;

    return {
      key: "bank",
      label: "Bank Auto Loan",
      discountApplied: applied,
      discountedPrice: round(discounted),
      downPayment: round(requiredDP),
      cashPortion: 0,
      loanAmount: round(bank.loanAmount || implied),
      oneMonthAdvance: round(oma),
      totalFees: round(totalFees),
      upfrontCash: round(upfront),
      termMonths: bank.termMonths,
      monthlyPayment: round(bank.monthlyAmortization),
      monthlyLabel: "Quoted amortization",
      totalMonthlyPayments: round(totalMonthly),
      paymentTypeLabel: bank.paymentType === "oma" ? "OMA (1st month upfront)" : "Arrears",
      totalCost: round(totalCost),
      financingCostAboveDiscounted: round(totalCost - discounted),
      warnings,
    };
  })();

  const c2cResult: OptionResult = (() => {
    const warnings: string[] = [];
    const discounted = priceFor("c2c");
    const applied = discountApplies("c2c", vehicle.discountAppliesTo, vehicle.selectedOptions);

    const totalFees =
      c2c.processingFee +
      c2c.registration +
      c2c.comprehensiveInsurance +
      c2c.ctpl +
      c2c.otherFees;

    const loanable = Math.max(0, c2c.loanableAmount);
    const cashPortion = Math.max(0, discounted - loanable);

    const computedInterest = loanable * (c2c.monthlyAddOnRate / 100) * c2c.termMonths;
    const totalRepayment = loanable + computedInterest;
    const computedMonthly = c2c.termMonths > 0 ? totalRepayment / c2c.termMonths : 0;

    const hasOverride = c2c.monthlyPaymentOverride > 0;
    const monthly = hasOverride ? c2c.monthlyPaymentOverride : computedMonthly;
    if (hasOverride) {
      warnings.push("Using bank-quoted monthly payment instead of the add-on-rate formula.");
    }

    const totalMonthly = monthly * c2c.termMonths;
    const upfront = cashPortion + totalFees;
    const totalCost = cashPortion + totalMonthly + totalFees;

    return {
      key: "c2c",
      label: "Credit-to-Cash",
      discountApplied: applied,
      discountedPrice: round(discounted),
      downPayment: 0,
      cashPortion: round(cashPortion),
      loanAmount: round(loanable),
      oneMonthAdvance: 0,
      totalFees: round(totalFees),
      upfrontCash: round(upfront),
      termMonths: c2c.termMonths,
      monthlyPayment: round(monthly),
      monthlyLabel: hasOverride ? "Bank-quoted monthly" : "Computed (add-on)",
      totalMonthlyPayments: round(totalMonthly),
      paymentTypeLabel: "Fixed monthly",
      totalCost: round(totalCost),
      financingCostAboveDiscounted: round(totalCost - discounted),
      totalInterest: round(computedInterest),
      totalRepayment: round(totalRepayment),
      monthlyAddOnRate: c2c.monthlyAddOnRate,
      eirpa: c2c.eirpa,
      loanableAmount: round(loanable),
      warnings,
    };
  })();

  const inHouseResult: OptionResult = (() => {
    const warnings: string[] = [];
    const discounted = priceFor("in-house");
    const applied = discountApplies("in-house", vehicle.discountAppliesTo, vehicle.selectedOptions);

    const totalFees =
      inHouse.chattelMortgage +
      inHouse.processingFee +
      inHouse.documentationFee +
      inHouse.registration +
      inHouse.comprehensiveInsurance +
      inHouse.ctpl +
      inHouse.otherFees;

    const requiredDP = inHouse.downPayment;
    const implied = discounted - requiredDP;
    if (inHouse.loanAmount > 0 && Math.abs(inHouse.loanAmount - implied) > 1) {
      warnings.push(
        `Loan amount (${inHouse.loanAmount.toLocaleString()}) does not equal discounted price − down payment (${implied.toLocaleString()}). Check inputs.`
      );
    }

    const oma = inHouse.paymentType === "oma" ? inHouse.monthlyAmortization : 0;
    const totalMonthly = inHouse.monthlyAmortization * inHouse.termMonths;
    const upfront = requiredDP + oma + totalFees;
    const totalCost = requiredDP + totalMonthly + totalFees;

    return {
      key: "in-house",
      label: "In-House Financing",
      discountApplied: applied,
      discountedPrice: round(discounted),
      downPayment: round(requiredDP),
      cashPortion: 0,
      loanAmount: round(inHouse.loanAmount || implied),
      oneMonthAdvance: round(oma),
      totalFees: round(totalFees),
      upfrontCash: round(upfront),
      termMonths: inHouse.termMonths,
      monthlyPayment: round(inHouse.monthlyAmortization),
      monthlyLabel: "Quoted amortization",
      totalMonthlyPayments: round(totalMonthly),
      paymentTypeLabel: inHouse.paymentType === "oma" ? "OMA (1st month upfront)" : "Arrears",
      totalCost: round(totalCost),
      financingCostAboveDiscounted: round(totalCost - discounted),
      warnings,
    };
  })();

  return {
    vehicleName: vehicle.name,
    originalPrice: vehicle.originalPrice,
    dealerDiscount: discount,
    discountAppliesTo: vehicle.discountAppliesTo,
    results: [bankResult, c2cResult, inHouseResult],
  };
}
