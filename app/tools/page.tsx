"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  ArrowRight,
} from "lucide-react";

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
    <main className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Financial Tools</h1>
        <p className="text-muted-foreground max-w-xl">
          20+ Philippine-focused financial calculators. Each tool has its own page with interactive charts and documentation.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tools..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {TOOL_CATEGORIES_LIST.map((cat) => (
          <button
            key={cat.value}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all border",
              activeCategory === cat.value
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-background text-muted-foreground border-border hover:bg-muted hover:text-foreground"
            )}
            onClick={() => setActiveCategory(cat.value)}
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

      {/* Tool Grid */}
      {filteredTools.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No tools match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredTools.map((tool) => {
            const IconComponent = SLUG_ICONS[tool.slug] || TrendingUp;
            return (
              <Link key={tool.slug} href={`/tools/${tool.slug}`}>
                <Card className="h-full cursor-pointer transition-all hover:shadow-md hover:border-primary/40 group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                          <IconComponent className="h-4 w-4 text-primary" />
                        </div>
                        <CardTitle className="text-sm font-semibold group-hover:text-primary transition-colors">
                          {tool.title}
                        </CardTitle>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </div>
                    <CardDescription className="text-xs mt-2">{tool.description}</CardDescription>
                    <Badge variant="outline" className="text-[10px] capitalize w-fit mt-2">
                      {tool.categoryLabel}
                    </Badge>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
