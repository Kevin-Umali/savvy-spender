"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { TOOL_REGISTRY, TOOL_CATEGORIES_LIST } from "@/constant/tool-registry";
import {
  Search,
  Wallet,
  Scale,
  TrendingUp,
  Building2,
  Landmark,
  Car,
  BadgePercent,
  CreditCard,
  Banknote,
  Receipt,
  Target,
  PiggyBank,
  HandCoins,
  Shield,
  CircleDollarSign,
  ArrowUpRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";

type ToolCategory = "all" | "loans" | "credit" | "income" | "planning";

const SLUG_ICONS: Record<string, React.FC<{ className?: string }>> = {
  affordability: Wallet,
  "loan-comparison": Scale,
  "early-payoff": TrendingUp,
  "in-house-loan": Building2,
  "sss-loan": Landmark,
  "pagibig-loan": Landmark,
  "car-loan": Car,
  "rate-converter": BadgePercent,
  "break-even": TrendingUp,
  "credit-card-payoff": CreditCard,
  salary: Banknote,
  tax: Receipt,
  "debt-planner": Target,
  "savings-goal": PiggyBank,
  retirement: HandCoins,
  "emergency-fund": Shield,
  remittance: CircleDollarSign,
  investment: TrendingUp,
};

export default function ToolsPage() {
  const [activeCategory, setActiveCategory] = useState<ToolCategory>("all");
  const [search, setSearch] = useState("");

  const filteredTools = TOOL_REGISTRY.filter((t) => {
    const matchesCategory = activeCategory === "all" || t.category === activeCategory;
    const matchesSearch = search === "" ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display italic font-light text-4xl sm:text-5xl tracking-tight">
          Financial Tools
        </h1>
        <p className="mt-3 text-muted-foreground max-w-md leading-relaxed">
          Philippine-focused calculators with interactive charts and documentation.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground opacity-40" />
        <Input
          placeholder="Search tools..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-9 text-sm"
        />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {TOOL_CATEGORIES_LIST.map((cat) => (
          <button
            key={cat.value}
            className={cn(
              "font-mono-label text-[10px] uppercase tracking-[0.15em] px-3 py-1.5 rounded-sm border transition-colors",
              activeCategory === cat.value
                ? "border-foreground text-foreground"
                : "border-border text-muted-foreground opacity-60 hover:opacity-100 hover:border-foreground/30"
            )}
            onClick={() => setActiveCategory(cat.value)}
          >
            {cat.label}
            <span className="ml-1.5 opacity-50">{cat.count}</span>
          </button>
        ))}
      </div>

      <div className="h-px bg-border opacity-50" />

      {/* Tool Grid */}
      {filteredTools.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground text-sm">
          No tools match your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {filteredTools.map((tool) => {
            const IconComponent = SLUG_ICONS[tool.slug] || TrendingUp;
            return (
              <Link key={tool.slug} href={`/tools/${tool.slug}`}>
                <div className="group flex items-start gap-3 p-3 -mx-1 rounded-sm hover:bg-accent transition-colors">
                  <IconComponent className="h-3.5 w-3.5 mt-[5px] shrink-0 text-muted-foreground opacity-40 group-hover:opacity-70 transition-opacity" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[13px] font-medium text-foreground opacity-75 group-hover:opacity-100 transition-opacity">
                        {tool.title}
                      </span>
                      <ArrowUpRight className="h-3 w-3 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-50 transition-opacity" />
                    </div>
                    <p className="text-[11px] text-muted-foreground opacity-60 group-hover:opacity-80 transition-opacity leading-relaxed">
                      {tool.description}
                    </p>
                    <span className="font-mono-label text-[9px] uppercase tracking-[0.2em] text-muted-foreground opacity-30 mt-1 block">
                      {tool.categoryLabel}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
