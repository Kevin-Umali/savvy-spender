"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Tool components - Loan Calculators
import AffordabilityCalculator from "@/components/tools/affordability-calculator";
import LoanComparison from "@/components/tools/loan-comparison";
import EarlyPayoffCalculator from "@/components/tools/early-payoff-calculator";
import InHouseLoanCalculator from "@/components/tools/in-house-loan-calculator";
import SSSLoanCalculator from "@/components/tools/sss-loan-calculator";
import PagIBIGLoanCalculator from "@/components/tools/pagibig-loan-calculator";
import CarLoanCalculator from "@/components/tools/car-loan-calculator";

// Tool components - Credit & Rates
import InterestRateConverter from "@/components/tools/interest-rate-converter";
import BreakEvenAnalyzer from "@/components/tools/break-even-analyzer";
import CreditCardPayoff from "@/components/tools/credit-card-payoff";

// Tool components - Income & Tax
import SalaryCalculator from "@/components/tools/salary-calculator";
import TaxCalculator from "@/components/tools/tax-calculator";

// Tool components - Planning & Savings
import DebtPlanner from "@/components/tools/debt-planner";
import SavingsGoalCalculator from "@/components/tools/savings-goal-calculator";
import RetirementCalculator from "@/components/tools/retirement-calculator";
import EmergencyFundCalculator from "@/components/tools/emergency-fund-calculator";
import RemittanceCalculator from "@/components/tools/remittance-calculator";
import InvestmentCalculator from "@/components/tools/investment-calculator";

type ToolCategory = "all" | "loans" | "credit" | "income" | "planning";

interface ToolDef {
  id: string;
  title: string;
  description: string;
  category: ToolCategory;
  component: React.FC;
}

const TOOLS: ToolDef[] = [
  // Loan Calculators
  {
    id: "affordability",
    title: "Affordability Calculator",
    description: "Find the max amount you can borrow based on your monthly budget",
    category: "loans",
    component: AffordabilityCalculator,
  },
  {
    id: "loan-comparison",
    title: "Loan Comparison",
    description: "Compare two bank offers side-by-side across all terms",
    category: "loans",
    component: LoanComparison,
  },
  {
    id: "early-payoff",
    title: "Early Payoff Calculator",
    description: "See how extra payments accelerate your loan payoff",
    category: "loans",
    component: EarlyPayoffCalculator,
  },
  {
    id: "in-house-loan",
    title: "In-House Loan",
    description: "Calculate developer/dealer direct financing with down payment",
    category: "loans",
    component: InHouseLoanCalculator,
  },
  {
    id: "sss-loan",
    title: "SSS Loan Calculator",
    description: "Compute SSS salary loan amortization and total cost",
    category: "loans",
    component: SSSLoanCalculator,
  },
  {
    id: "pagibig-loan",
    title: "Pag-IBIG Housing Loan",
    description: "Estimate Pag-IBIG housing loan payments with MRI and insurance",
    category: "loans",
    component: PagIBIGLoanCalculator,
  },
  {
    id: "car-loan",
    title: "Car Loan Calculator",
    description: "Auto financing with down payment and chattel mortgage fees",
    category: "loans",
    component: CarLoanCalculator,
  },
  // Credit & Rates
  {
    id: "rate-converter",
    title: "Interest Rate Converter",
    description: "Convert flat/add-on rates to effective interest rate (EIR)",
    category: "credit",
    component: InterestRateConverter,
  },
  {
    id: "break-even",
    title: "Break-Even Analyzer",
    description: "Find when bank installment becomes cheaper than merchant 0%",
    category: "credit",
    component: BreakEvenAnalyzer,
  },
  {
    id: "credit-card-payoff",
    title: "Credit Card Payoff",
    description: "Compare minimum payments vs fixed payments to pay off faster",
    category: "credit",
    component: CreditCardPayoff,
  },
  // Income & Tax
  {
    id: "salary",
    title: "Salary Calculator (PH)",
    description: "Compute net take-home pay with SSS, PhilHealth, Pag-IBIG, and tax",
    category: "income",
    component: SalaryCalculator,
  },
  {
    id: "tax",
    title: "Tax Calculator (PH)",
    description: "Income tax based on TRAIN law with freelancer 8% flat rate option",
    category: "income",
    component: TaxCalculator,
  },
  // Planning & Savings
  {
    id: "debt-planner",
    title: "Debt Snowball / Avalanche",
    description: "Optimize multi-debt payoff with snowball or avalanche strategy",
    category: "planning",
    component: DebtPlanner,
  },
  {
    id: "savings-goal",
    title: "Savings Goal Calculator",
    description: "How much to save monthly to reach your financial target",
    category: "planning",
    component: SavingsGoalCalculator,
  },
  {
    id: "retirement",
    title: "Retirement Calculator",
    description: "Project your retirement fund and check if you're on track",
    category: "planning",
    component: RetirementCalculator,
  },
  {
    id: "emergency-fund",
    title: "Emergency Fund",
    description: "Calculate your target emergency fund and track progress",
    category: "planning",
    component: EmergencyFundCalculator,
  },
  {
    id: "remittance",
    title: "Remittance Calculator",
    description: "Convert currencies with fees for OFW remittances",
    category: "planning",
    component: RemittanceCalculator,
  },
  {
    id: "investment",
    title: "Investment Returns",
    description: "Project investment growth with contributions and tax",
    category: "planning",
    component: InvestmentCalculator,
  },
];

const CATEGORIES: Array<{ value: ToolCategory; label: string; count: number }> = [
  { value: "all", label: "All Tools", count: TOOLS.length },
  { value: "loans", label: "Loans", count: TOOLS.filter((t) => t.category === "loans").length },
  { value: "credit", label: "Credit & Rates", count: TOOLS.filter((t) => t.category === "credit").length },
  { value: "income", label: "Income & Tax", count: TOOLS.filter((t) => t.category === "income").length },
  { value: "planning", label: "Planning & Savings", count: TOOLS.filter((t) => t.category === "planning").length },
];

export default function ToolsPage() {
  const [activeCategory, setActiveCategory] = useState<ToolCategory>("all");
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const filteredTools = activeCategory === "all" ? TOOLS : TOOLS.filter((t) => t.category === activeCategory);
  const ActiveComponent = activeTool ? TOOLS.find((t) => t.id === activeTool)?.component : null;

  return (
    <main className="p-4 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Financial Tools</h1>
        <p className="text-sm text-muted-foreground mt-1">
          A collection of Philippine-focused financial calculators to help you make smarter money decisions.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all border",
              activeCategory === cat.value
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-background text-muted-foreground border-border hover:bg-muted hover:text-foreground"
            )}
            onClick={() => {
              setActiveCategory(cat.value);
              setActiveTool(null);
            }}
          >
            {cat.label}
            <Badge variant="secondary" className={cn(
              "text-[10px] px-1.5 py-0",
              activeCategory === cat.value && "bg-primary-foreground/20 text-primary-foreground"
            )}>
              {cat.count}
            </Badge>
          </button>
        ))}
      </div>

      {/* Active Tool */}
      {activeTool && ActiveComponent && (
        <div className="space-y-3">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground"
            onClick={() => setActiveTool(null)}
          >
            &larr; Back to all tools
          </Button>
          <ActiveComponent />
        </div>
      )}

      {/* Tool Grid */}
      {!activeTool && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredTools.map((tool) => (
            <Card
              key={tool.id}
              className="cursor-pointer transition-all hover:shadow-md hover:border-primary/40 group"
              onClick={() => setActiveTool(tool.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-sm font-semibold group-hover:text-primary transition-colors">
                    {tool.title}
                  </CardTitle>
                  <Badge variant="outline" className="text-[10px] capitalize shrink-0 ml-2">
                    {tool.category === "credit" ? "Credit" : tool.category === "income" ? "Income" : tool.category === "planning" ? "Planning" : "Loan"}
                  </Badge>
                </div>
                <CardDescription className="text-xs">{tool.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
