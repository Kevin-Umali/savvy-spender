"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
      <main className="max-w-5xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="font-display italic font-light text-3xl">Tool Not Found</h1>
        <p className="text-muted-foreground text-sm">The tool you&apos;re looking for doesn&apos;t exist.</p>
        <Link
          href="/tools"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to All Tools
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumb */}
      <div className="font-mono-label flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground opacity-60">
        <Link href="/tools" className="hover:opacity-100 transition-opacity">Tools</Link>
        <span>/</span>
        <span className="text-foreground opacity-70">{tool.title}</span>
      </div>

      {/* Header */}
      <div>
        <span className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-muted-foreground opacity-50 mb-3 block">
          {tool.categoryLabel}
        </span>
        <h1 className="font-display italic font-light text-3xl sm:text-4xl tracking-tight">{tool.title}</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl leading-relaxed">{tool.longDescription}</p>
      </div>

      <div className="h-px bg-border opacity-50" />

      {/* Calculator */}
      <div className="landing-reveal">
        <ToolComponent />
      </div>

      {/* Documentation */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-muted-foreground opacity-50" />
          <h2 className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-muted-foreground opacity-60">
            How This Tool Works
          </h2>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="prose dark:prose-invert max-w-none prose-sm">
              <ReactMarkdown>{cleanMarkdown(tool.docs)}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-muted-foreground opacity-60">
            Related Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {relatedTools.map((related) => (
              <Link key={related.slug} href={`/tools/${related.slug}`}>
                <div className="group p-4 rounded-sm border border-border hover:bg-accent transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13px] font-medium text-foreground opacity-75 group-hover:opacity-100 transition-opacity">
                      {related.title}
                    </span>
                    <ArrowUpRight className="h-3 w-3 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-50 transition-opacity" />
                  </div>
                  <p className="text-[11px] text-muted-foreground opacity-60 mt-1 leading-relaxed">{related.description}</p>
                  <span className="font-mono-label text-[9px] uppercase tracking-[0.2em] text-muted-foreground opacity-30 mt-2 block">
                    {related.categoryLabel}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
