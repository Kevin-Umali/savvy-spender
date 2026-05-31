import {
  BookOpen,
  Building2,
  Calculator,
  Globe,
  Home,
  PiggyBank,
  Scale,
  TrendingUp,
  Wallet,
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
    desc: "Compare unlimited financing options — bank auto loans, credit-to-cash, in-house, or custom — with full cost breakdown and a priority-based pick.",
    meta: "Unlimited options · 6 rate modes · loan / upfront / total cost",
  },
  {
    status: "live",
    icon: Wallet,
    title: "Freelancer Payout Comparison",
    href: "/payout-compare",
    desc: "Getting paid from abroad? See which app nets you the most pesos after fees and FX — Wise, Payoneer, PayPal, e-wallets, banks, and crypto.",
    meta: "8 platforms · live FX · net PHP simulator",
  },
  {
    status: "live",
    icon: Home,
    title: "Rent vs. Buy a Home",
    href: "/rent-vs-buy",
    desc: "Buy the condo or keep renting and invest the difference? A year-by-year wealth simulation with the break-even year and the odds buying actually wins.",
    meta: "break-even year · invest-the-difference · Monte-Carlo odds",
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
