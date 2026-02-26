"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getToolBySlug, getRelatedTools } from "@/constant/tool-registry";
import ReactMarkdown from "react-markdown";
import { cleanMarkdown } from "@/lib/client";

// Tool components
import AffordabilityCalculator from "@/components/tools/affordability-calculator";
import LoanComparison from "@/components/tools/loan-comparison";
import EarlyPayoffCalculator from "@/components/tools/early-payoff-calculator";
import InHouseLoanCalculator from "@/components/tools/in-house-loan-calculator";
import SSSLoanCalculator from "@/components/tools/sss-loan-calculator";
import PagIBIGLoanCalculator from "@/components/tools/pagibig-loan-calculator";
import CarLoanCalculator from "@/components/tools/car-loan-calculator";
import InterestRateConverter from "@/components/tools/interest-rate-converter";
import BreakEvenAnalyzer from "@/components/tools/break-even-analyzer";
import CreditCardPayoff from "@/components/tools/credit-card-payoff";
import SalaryCalculator from "@/components/tools/salary-calculator";
import TaxCalculator from "@/components/tools/tax-calculator";
import DebtPlanner from "@/components/tools/debt-planner";
import SavingsGoalCalculator from "@/components/tools/savings-goal-calculator";
import RetirementCalculator from "@/components/tools/retirement-calculator";
import EmergencyFundCalculator from "@/components/tools/emergency-fund-calculator";
import RemittanceCalculator from "@/components/tools/remittance-calculator";
import InvestmentCalculator from "@/components/tools/investment-calculator";

const TOOL_COMPONENTS: Record<string, React.FC> = {
  affordability: AffordabilityCalculator,
  "loan-comparison": LoanComparison,
  "early-payoff": EarlyPayoffCalculator,
  "in-house-loan": InHouseLoanCalculator,
  "sss-loan": SSSLoanCalculator,
  "pagibig-loan": PagIBIGLoanCalculator,
  "car-loan": CarLoanCalculator,
  "rate-converter": InterestRateConverter,
  "break-even": BreakEvenAnalyzer,
  "credit-card-payoff": CreditCardPayoff,
  salary: SalaryCalculator,
  tax: TaxCalculator,
  "debt-planner": DebtPlanner,
  "savings-goal": SavingsGoalCalculator,
  retirement: RetirementCalculator,
  "emergency-fund": EmergencyFundCalculator,
  remittance: RemittanceCalculator,
  investment: InvestmentCalculator,
};

export default function ToolPage() {
  const params = useParams();
  const slug = params.slug as string;
  const tool = getToolBySlug(slug);
  const ToolComponent = TOOL_COMPONENTS[slug];
  const relatedTools = getRelatedTools(slug);

  if (!tool || !ToolComponent) {
    return (
      <main className="max-w-5xl mx-auto p-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold">Tool Not Found</h1>
        <p className="text-muted-foreground">The tool you&apos;re looking for doesn&apos;t exist.</p>
        <Button asChild variant="outline">
          <Link href="/tools">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Tools
          </Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto p-4 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/tools" className="hover:text-foreground transition-colors">Tools</Link>
        <span>/</span>
        <span className="text-foreground">{tool.title}</span>
      </div>

      {/* Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="outline" className="capitalize">{tool.categoryLabel}</Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{tool.title}</h1>
        <p className="text-muted-foreground max-w-2xl">{tool.longDescription}</p>
      </div>

      {/* Calculator */}
      <div className="animate-fade-in">
        <ToolComponent />
      </div>

      {/* Documentation */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <CardTitle>How This Tool Works</CardTitle>
          </div>
          <CardDescription>
            Understand the calculations, formulas, and assumptions behind this tool.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none prose-sm">
            <ReactMarkdown>{cleanMarkdown(tool.docs)}</ReactMarkdown>
          </div>
        </CardContent>
      </Card>

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Related Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {relatedTools.map((related) => (
              <Link key={related.slug} href={`/tools/${related.slug}`}>
                <Card className="h-full transition-all hover:shadow-md hover:border-primary/30 group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-sm font-semibold group-hover:text-primary transition-colors">
                        {related.title}
                      </CardTitle>
                      <Badge variant="outline" className="text-[10px] capitalize shrink-0 ml-2">
                        {related.categoryLabel}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs">{related.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
