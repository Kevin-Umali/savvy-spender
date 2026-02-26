import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Calculator,
  PiggyBank,
  TrendingUp,
  CreditCard,
  ArrowUpRight,
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
  Shield,
  BookOpen,
  LayoutGrid,
} from "lucide-react";

interface Tool {
  icon: LucideIcon;
  title: string;
  slug: string;
  desc: string;
}

const CATEGORIES: { name: string; tools: Tool[] }[] = [
  {
    name: "Loans",
    tools: [
      { icon: Wallet, title: "Affordability", slug: "affordability", desc: "How much can you borrow?" },
      { icon: Scale, title: "Loan Comparison", slug: "loan-comparison", desc: "Compare two bank offers" },
      { icon: TrendingUp, title: "Early Payoff", slug: "early-payoff", desc: "Save with extra payments" },
      { icon: Building2, title: "In-House Loan", slug: "in-house-loan", desc: "Developer financing" },
      { icon: Landmark, title: "SSS Loan", slug: "sss-loan", desc: "SSS salary loan" },
      { icon: Landmark, title: "Pag-IBIG Loan", slug: "pagibig-loan", desc: "Pag-IBIG housing loan" },
      { icon: Car, title: "Car Loan", slug: "car-loan", desc: "Auto financing" },
    ],
  },
  {
    name: "Credit & Rates",
    tools: [
      { icon: BadgePercent, title: "Rate Converter", slug: "rate-converter", desc: "Flat to effective rate" },
      { icon: TrendingUp, title: "Break-Even", slug: "break-even", desc: "Bank vs merchant 0%" },
      { icon: CreditCard, title: "Credit Card Payoff", slug: "credit-card-payoff", desc: "Pay off faster" },
    ],
  },
  {
    name: "Income & Tax",
    tools: [
      { icon: Banknote, title: "Salary Calculator", slug: "salary", desc: "Net take-home pay" },
      { icon: Receipt, title: "Tax Calculator", slug: "tax", desc: "TRAIN law tax" },
    ],
  },
  {
    name: "Planning & Savings",
    tools: [
      { icon: Target, title: "Debt Planner", slug: "debt-planner", desc: "Snowball / Avalanche" },
      { icon: PiggyBank, title: "Savings Goal", slug: "savings-goal", desc: "Reach your target" },
      { icon: HandCoins, title: "Retirement", slug: "retirement", desc: "Are you on track?" },
      { icon: Shield, title: "Emergency Fund", slug: "emergency-fund", desc: "Build your safety net" },
      { icon: CircleDollarSign, title: "Remittance", slug: "remittance", desc: "OFW currency convert" },
      { icon: TrendingUp, title: "Investment", slug: "investment", desc: "Project growth" },
    ],
  },
];

export default function LandingPage() {
  return (
    <main>
      <header className="container mx-auto px-4 pt-20 sm:pt-28 pb-14 landing-reveal">
        <h1 className="font-display italic font-light text-5xl sm:text-7xl lg:text-8xl leading-[0.95] tracking-tight">
          Savvy Spender
        </h1>
        <p className="mt-6 text-muted-foreground max-w-sm leading-relaxed">
          Philippine financial calculators.
          <br />
          Free, open source, no&nbsp;sign&#8209;up.
        </p>
      </header>

      <Rule />

      <section
        className="container mx-auto px-4 py-12 landing-reveal"
        style={{ animationDelay: "80ms" }}
      >
        <Link href="/calculator" className="group block max-w-2xl">
          <div className="border-l-2 border-amber-500/40 dark:border-amber-400/25 pl-6 sm:pl-8">
            <p className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-amber-600/60 dark:text-amber-400/40 mb-3">
              Featured
            </p>
            <h2 className="font-display italic font-light text-2xl sm:text-3xl">
              Installment Calculator
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-md leading-relaxed">
              Compare balance conversion, credit-to-cash, and personal loan
              installment plans side by side.
            </p>
            <span className="inline-flex items-center gap-1.5 mt-5 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
              Open calculator
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </Link>
      </section>

      <Rule />

      <section className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-12">
          {CATEGORIES.map((cat, i) => (
            <div
              key={cat.name}
              className="landing-reveal"
              style={{ animationDelay: `${160 + i * 80}ms` }}
            >
              <h2 className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-muted-foreground opacity-60 pb-3 border-b border-border">
                {cat.name}
              </h2>
              <ul className="mt-3 space-y-0.5">
                {cat.tools.map((tool) => (
                  <li key={tool.slug}>
                    <Link
                      href={`/tools/${tool.slug}`}
                      className="group flex items-start gap-2.5 py-2 -mx-2 px-2 rounded-sm hover:bg-accent transition-colors"
                    >
                      <tool.icon className="h-3.5 w-3.5 mt-[3px] shrink-0 text-muted-foreground opacity-40 group-hover:opacity-70 transition-opacity" />
                      <div className="min-w-0">
                        <span className="text-[13px] font-medium text-foreground opacity-75 group-hover:opacity-100 transition-opacity">
                          {tool.title}
                        </span>
                        <p className="text-[11px] text-muted-foreground opacity-70 group-hover:opacity-100 transition-opacity leading-relaxed">
                          {tool.desc}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <Rule />

      <nav
        className="container mx-auto px-4 py-10 landing-reveal"
        style={{ animationDelay: "520ms" }}
      >
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          {[
            { href: "/tools", label: "All Tools", icon: LayoutGrid },
            { href: "/bank-conversion-list", label: "Bank Conversion List", icon: Receipt },
            { href: "/docs", label: "Docs", icon: BookOpen },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono-label inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground opacity-50 hover:opacity-100 transition-opacity"
            >
              <link.icon className="h-3 w-3" />
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </main>
  );
}

function Rule() {
  return (
    <div className="container mx-auto px-4" aria-hidden="true">
      <div className="h-px bg-border opacity-50" />
    </div>
  );
}
