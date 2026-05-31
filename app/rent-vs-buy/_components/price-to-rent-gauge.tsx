"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * Price-to-rent ratio (price ÷ annual rent) — the classic at-a-glance heuristic.
 * <15 favours buying, 15–20 is a toss-up, >20 favours renting.
 */
export function PriceToRentGauge({ ratio }: { ratio: number }) {
  const verdict = ratio < 15 ? "Buy-favoured" : ratio <= 20 ? "Borderline" : "Rent-favoured";
  const color =
    ratio < 15 ? "text-emerald-600 dark:text-emerald-400" : ratio <= 20 ? "text-amber-600 dark:text-amber-400" : "text-sky-600 dark:text-sky-400";
  // Map ratio 5..30 → 0..100% for the marker position.
  const pos = Math.min(100, Math.max(0, ((ratio - 5) / 25) * 100));

  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <p className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-muted-foreground opacity-60">
          Price-to-rent ratio
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="tabular-nums font-display font-light text-3xl">{ratio.toFixed(1)}</span>
          <span className={cn("text-sm font-medium", color)}>{verdict}</span>
        </div>
        <div className="relative mt-3 h-2.5 rounded-full overflow-hidden flex">
          <div className="h-full bg-emerald-500/40" style={{ width: "40%" }} />
          <div className="h-full bg-amber-500/40" style={{ width: "20%" }} />
          <div className="h-full bg-sky-500/40" style={{ width: "40%" }} />
          <div
            className="absolute top-1/2 -translate-y-1/2 h-4 w-1 rounded-full bg-foreground"
            style={{ left: `calc(${pos}% - 2px)` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1 font-mono-label">
          <span>5</span>
          <span>15</span>
          <span>20</span>
          <span>30+</span>
        </div>
        <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
          A quick sanity check independent of the full simulation: how many years of rent equal the
          purchase price.
        </p>
      </CardContent>
    </Card>
  );
}
