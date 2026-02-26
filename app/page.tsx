import Link from "next/link";
import {
  Calculator,
  PiggyBank,
  TrendingUp,
  CreditCard,
  BarChart3,
  Shield,
  ArrowRight,
  Wallet,
  Receipt,
  Building2,
  Car,
  Landmark,
  HandCoins,
  Target,
  Banknote,
  CircleDollarSign,
  Scale,
  BadgePercent,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const HERO_STATS = [
  { value: "20+", label: "Financial Tools" },
  { value: "Free", label: "No Hidden Fees" },
  { value: "PH", label: "Focused" },
];

const MAIN_FEATURES = [
  {
    icon: Calculator,
    title: "Installment Calculator",
    description: "Compare balance conversion, credit-to-cash, and personal loan installment plans side by side.",
    href: "/calculator",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: BarChart3,
    title: "20+ Financial Tools",
    description: "From salary calculators to retirement planners - every tool you need for smarter financial decisions.",
    href: "/tools",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Receipt,
    title: "Bank Conversion List",
    description: "Reference guide for Philippine bank transaction conversion options and rates.",
    href: "/bank-conversion-list",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    icon: Shield,
    title: "Documentation",
    description: "Understand exactly how every calculation works with detailed explanations and formulas.",
    href: "/docs",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
];

const TOOL_CATEGORIES = [
  {
    category: "Loan Calculators",
    color: "text-blue-500",
    tools: [
      { icon: Wallet, title: "Affordability", slug: "affordability", description: "How much can you borrow?" },
      { icon: Scale, title: "Loan Comparison", slug: "loan-comparison", description: "Compare two bank offers" },
      { icon: TrendingUp, title: "Early Payoff", slug: "early-payoff", description: "Save with extra payments" },
      { icon: Building2, title: "In-House Loan", slug: "in-house-loan", description: "Developer financing" },
      { icon: Landmark, title: "SSS Loan", slug: "sss-loan", description: "SSS salary loan" },
      { icon: Landmark, title: "Pag-IBIG Loan", slug: "pagibig-loan", description: "Housing loan" },
      { icon: Car, title: "Car Loan", slug: "car-loan", description: "Auto financing" },
    ],
  },
  {
    category: "Credit & Rates",
    color: "text-violet-500",
    tools: [
      { icon: BadgePercent, title: "Rate Converter", slug: "rate-converter", description: "Flat to effective rate" },
      { icon: TrendingUp, title: "Break-Even", slug: "break-even", description: "Bank vs merchant 0%" },
      { icon: CreditCard, title: "Credit Card Payoff", slug: "credit-card-payoff", description: "Pay off faster" },
    ],
  },
  {
    category: "Income & Tax",
    color: "text-emerald-500",
    tools: [
      { icon: Banknote, title: "Salary Calculator", slug: "salary", description: "Net take-home pay" },
      { icon: Receipt, title: "Tax Calculator", slug: "tax", description: "TRAIN law tax" },
    ],
  },
  {
    category: "Planning & Savings",
    color: "text-amber-500",
    tools: [
      { icon: Target, title: "Debt Planner", slug: "debt-planner", description: "Snowball / Avalanche" },
      { icon: PiggyBank, title: "Savings Goal", slug: "savings-goal", description: "Reach your target" },
      { icon: HandCoins, title: "Retirement", slug: "retirement", description: "Are you on track?" },
      { icon: Shield, title: "Emergency Fund", slug: "emergency-fund", description: "Build your safety net" },
      { icon: CircleDollarSign, title: "Remittance", slug: "remittance", description: "OFW currency convert" },
      { icon: TrendingUp, title: "Investment", slug: "investment", description: "Project growth" },
    ],
  },
];

export default function LandingPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5" />
        <div className="container mx-auto px-4 py-16 sm:py-24 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in-up">
            <Badge variant="secondary" className="px-4 py-1.5 text-sm">
              Philippine Financial Calculator
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Make Smarter{" "}
              <span className="text-gradient">Financial Decisions</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Free, open-source financial tools built for Filipinos. Compare installment plans, calculate loans, plan your retirement, and visualize your money with interactive charts.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="text-base">
                <Link href="/calculator">
                  <Calculator className="mr-2 h-5 w-5" />
                  Open Calculator
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-base">
                <Link href="/tools">
                  Browse All Tools
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-4 max-w-md mx-auto animate-fade-in">
            {HERO_STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold">Everything You Need</h2>
          <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
            From comparing installment plans to planning your retirement, all in one place.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MAIN_FEATURES.map((feature) => (
            <Link key={feature.title} href={feature.href}>
              <Card className="h-full transition-all hover:shadow-lg hover:border-primary/30 group">
                <CardHeader>
                  <div className={`h-12 w-12 rounded-lg ${feature.bg} flex items-center justify-center mb-3`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-base group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-sm">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Tool Showcase */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold">20+ Financial Tools</h2>
            <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
              Each tool has its own dedicated page with interactive charts, documentation, and Philippine-specific calculations.
            </p>
          </div>
          <div className="space-y-10">
            {TOOL_CATEGORIES.map((cat) => (
              <div key={cat.category}>
                <h3 className={`text-lg font-semibold mb-4 ${cat.color}`}>{cat.category}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                  {cat.tools.map((tool) => (
                    <Link key={tool.slug} href={`/tools/${tool.slug}`}>
                      <Card className="h-full transition-all hover:shadow-md hover:border-primary/30 group cursor-pointer">
                        <CardHeader className="p-4">
                          <div className="flex items-center gap-2 mb-1">
                            <tool.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            <CardTitle className="text-sm group-hover:text-primary transition-colors">
                              {tool.title}
                            </CardTitle>
                          </div>
                          <CardDescription className="text-xs">{tool.description}</CardDescription>
                        </CardHeader>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Savvy Spender */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold">Why Savvy Spender?</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Visual Insights</h3>
            <p className="text-sm text-muted-foreground">
              Interactive charts and graphs make complex numbers easy to understand at a glance.
            </p>
          </div>
          <div className="text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
              <Landmark className="h-6 w-6 text-emerald-500" />
            </div>
            <h3 className="font-semibold">PH-Focused</h3>
            <p className="text-sm text-muted-foreground">
              Built with SSS, PhilHealth, Pag-IBIG, TRAIN law, and Philippine banking practices in mind.
            </p>
          </div>
          <div className="text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-violet-500/10 flex items-center justify-center mx-auto">
              <Shield className="h-6 w-6 text-violet-500" />
            </div>
            <h3 className="font-semibold">Transparent</h3>
            <p className="text-sm text-muted-foreground">
              Every calculation is documented. Open-source so you can verify the math yourself.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary/10 via-blue-500/10 to-primary/10 py-16">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold">Ready to Take Control of Your Finances?</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Start calculating now. No sign-up required, no hidden fees, no ads.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg">
              <Link href="/calculator">
                Start Calculating
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/tools">
                Explore Tools
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
