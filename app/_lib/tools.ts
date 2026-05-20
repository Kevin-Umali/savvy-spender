import {
  BookOpen,
  Building2,
  Calculator,
  Globe,
  PiggyBank,
  Scale,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

export interface LiveTool {
  status: "live";
  icon: LucideIcon;
  title: string;
  href: string;
  desc: string;
  meta: string;
}

export interface PlaceholderTool {
  status: "soon";
  icon: LucideIcon;
  title: string;
  desc: string;
  eta: string;
}

export type Tool = LiveTool | PlaceholderTool;

export const TOOLS: Tool[] = [
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
    title: "Car Financing Comparison",
    href: "/loan-compare",
    desc: "Compare a bank auto loan, credit-to-cash, and dealer in-house financing side by side with full cost breakdown.",
    meta: "3 financing types · upfront + monthly + total cost",
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

export const SECONDARY_LINKS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/bank-conversion-list", label: "Bank Conversion List", icon: Building2 },
  { href: "/docs", label: "Documentation", icon: BookOpen },
];
