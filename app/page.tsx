import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  BookOpen,
  Building2,
  Calculator,
  Globe,
  PiggyBank,
  Scale,
  TrendingUp,
} from "lucide-react";

interface LiveTool {
  status: "live";
  icon: LucideIcon;
  title: string;
  href: string;
  desc: string;
  meta: string;
}

interface PlaceholderTool {
  status: "soon";
  icon: LucideIcon;
  title: string;
  desc: string;
  eta: string;
}

type Tool = LiveTool | PlaceholderTool;

const TOOLS: Tool[] = [
  {
    status: "live",
    icon: Calculator,
    title: "Installment Calculator",
    href: "/calculator",
    desc: "Compare balance conversion, credit-to-cash, and personal loan plans across multiple terms.",
    meta: "3 modes · 7+ terms · EIR / amortization",
  },
  {
    status: "live",
    icon: Globe,
    title: "Card FX Comparison",
    href: "/fx-compare",
    desc: "Find the cheapest PH credit card for foreign transactions. Compare bank markups and simulate PHP costs.",
    meta: "15+ cards · live FX rates · 3 API fallbacks",
  },
  {
    status: "live",
    icon: Scale,
    title: "Loan Comparison",
    href: "/loan-compare",
    desc: "Compare in-house financing, bank auto loan, and credit-to-cash side by side with full cost breakdown.",
    meta: "3 financing types · EIR · monthly + total cost",
  },
  {
    status: "soon",
    icon: TrendingUp,
    title: "Investment Planner",
    desc: "Project compounded growth and the effect of regular contributions.",
    eta: "Planned",
  },
  {
    status: "soon",
    icon: PiggyBank,
    title: "Salary Calculator",
    desc: "Compute net take-home pay with PH withholding tax, SSS, PhilHealth, and Pag-IBIG.",
    eta: "Planned",
  },
];

const SECONDARY_LINKS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/bank-conversion-list", label: "Bank Conversion List", icon: Building2 },
  { href: "/docs", label: "Documentation", icon: BookOpen },
];

export default function LandingPage() {
  return (
    <main>
      {/* Hero */}
      <header className="container mx-auto px-4 pt-20 sm:pt-28 pb-12 landing-reveal">
        <p className="font-mono-label text-[10px] uppercase tracking-[0.3em] text-muted-foreground opacity-60 mb-4">
          Philippine Personal Finance
        </p>
        <h1 className="font-display font-extralight text-5xl sm:text-7xl lg:text-8xl leading-[0.95] tracking-[-0.04em]">
          Savvy Spender
        </h1>
        <p className="mt-6 text-muted-foreground max-w-md leading-relaxed">
          Calmly check the math before you sign. Installment calculator, card FX comparison, and loan comparison — with more on the way.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2">
          <Link
            href="/calculator"
            className="inline-flex items-center gap-1.5 text-sm font-medium border-b border-foreground/30 hover:border-foreground transition-colors pb-0.5"
          >
            Open the calculator
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
          <span className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-muted-foreground opacity-50">
            Free · No sign-up · Open source
          </span>
        </div>
      </header>

      <Rule />

      {/* Tools grid */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <div className="flex items-baseline justify-between mb-6 flex-wrap gap-3">
          <h2 className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-muted-foreground opacity-60">
            Tools
          </h2>
          <p className="text-[11px] text-muted-foreground">
            <span className="tabular-nums">1</span> live ·{" "}
            <span className="tabular-nums">{TOOLS.filter((t) => t.status === "soon").length}</span> in progress
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOOLS.map((tool, i) => (
            <ToolCard key={tool.title} tool={tool} delay={i * 60} />
          ))}
        </div>
      </section>

      <Rule />

      {/* Secondary nav */}
      <nav
        className="container mx-auto px-4 py-10 landing-reveal flex flex-wrap gap-x-8 gap-y-3"
        style={{ animationDelay: "320ms" }}
      >
        {SECONDARY_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="font-mono-label inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground opacity-60 hover:opacity-100 hover:text-foreground transition-all"
          >
            <link.icon className="h-3 w-3" />
            {link.label}
          </Link>
        ))}
      </nav>
    </main>
  );
}

function ToolCard({ tool, delay }: { tool: Tool; delay: number }) {
  const Icon = tool.icon;
  const isLive = tool.status === "live";

  const inner = (
    <div
      className={[
        "h-full rounded-sm border p-5 transition-colors relative",
        isLive
          ? "border-border hover:border-foreground/40 group-hover:bg-accent/30"
          : "border-dashed border-border opacity-60",
      ].join(" ")}
    >
      <div className="flex items-start justify-between mb-4">
        <Icon
          className={[
            "h-5 w-5 transition-opacity",
            isLive ? "text-foreground/70 group-hover:text-foreground" : "text-muted-foreground/50",
          ].join(" ")}
        />
        {isLive ? (
          <span className="font-mono-label text-[9px] uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
            ● Live
          </span>
        ) : (
          <span className="font-mono-label text-[9px] uppercase tracking-[0.18em] text-muted-foreground/70">
            {tool.eta}
          </span>
        )}
      </div>
      <h3 className="font-display font-light text-xl tracking-tight leading-tight">{tool.title}</h3>
      <p className="mt-2 text-[12px] text-muted-foreground leading-relaxed">{tool.desc}</p>
      {isLive && (
        <div className="mt-4 flex items-center justify-between">
          <span className="font-mono-label text-[10px] uppercase tracking-[0.15em] text-muted-foreground opacity-60">
            {tool.meta}
          </span>
          <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </div>
      )}
    </div>
  );

  const className = "group block h-full landing-reveal";
  const style = { animationDelay: `${100 + delay}ms` };

  if (isLive) {
    return (
      <Link href={tool.href} className={className} style={style}>
        {inner}
      </Link>
    );
  }
  return (
    <div className={className} style={style} aria-disabled="true">
      {inner}
    </div>
  );
}

function Rule() {
  return (
    <div className="container mx-auto px-4" aria-hidden="true">
      <div className="h-px bg-border opacity-50" />
    </div>
  );
}
