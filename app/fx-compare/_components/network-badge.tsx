"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const NETWORK_COLORS: Record<string, string> = {
  Visa: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900",
  Mastercard: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-900",
  Amex: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-900",
  Diners: "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  JCB: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-300 dark:border-green-900",
  UnionPay: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900",
};

export function NetworkBadge({ network }: { network: string }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-mono-label text-[9px] uppercase tracking-[0.12em] px-1.5 py-0 font-normal",
        NETWORK_COLORS[network] ?? "bg-muted text-muted-foreground border-border"
      )}
    >
      {network}
    </Badge>
  );
}
