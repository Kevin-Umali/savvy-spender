import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionRule, ToolCard } from "./_components/tool-card";
import { SECONDARY_LINKS, TOOLS } from "./_lib/tools";
import { JsonLd } from "@/components/json-ld";
import { SITE_URL, webApplicationLd } from "./_lib/seo";

export const metadata: Metadata = {
  alternates: { canonical: SITE_URL },
};

export default function LandingPage() {
  const liveCount = TOOLS.filter((t) => t.status === "live").length;
  const soonCount = TOOLS.filter((t) => t.status === "soon").length;

  return (
    <main>
      <JsonLd data={webApplicationLd()} />
      {/* Hero */}
      <header className="container mx-auto px-4 pt-20 sm:pt-28 pb-12 landing-reveal">
        <p className="font-mono-label text-[10px] uppercase tracking-[0.3em] text-muted-foreground opacity-60 mb-4">
          Philippine Personal Finance
        </p>
        <h1 className="font-display font-extralight text-5xl sm:text-7xl lg:text-8xl leading-[0.95] tracking-[-0.04em]">
          Savvy Spender
        </h1>
        <p className="mt-6 text-muted-foreground max-w-md leading-relaxed">
          Calmly check the math before you sign. Installment and rent-vs-buy calculators, card FX and
          freelancer-payout comparisons, and car financing — all free, no sign-up.
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

      <SectionRule />

      {/* Tools grid */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <div className="flex items-baseline justify-between mb-6 flex-wrap gap-3">
          <h2 className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-muted-foreground opacity-60">
            Tools
          </h2>
          <p className="text-[11px] text-muted-foreground">
            <span className="tabular-nums">{liveCount}</span> live ·{" "}
            <span className="tabular-nums">{soonCount}</span> in progress
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOOLS.map((tool, i) => (
            <ToolCard key={tool.title} tool={tool} delay={i * 60} />
          ))}
        </div>
      </section>

      <SectionRule />

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
