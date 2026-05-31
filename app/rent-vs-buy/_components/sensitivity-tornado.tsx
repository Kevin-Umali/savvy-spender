"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SensitivityBar } from "../_lib/types";

const compact = (n: number): string => {
  const abs = Math.abs(n);
  if (abs >= 1e6) return `₱${(n / 1e6).toFixed(1)}M`;
  if (abs >= 1e3) return `₱${(n / 1e3).toFixed(0)}k`;
  return `₱${n.toFixed(0)}`;
};

/**
 * Ranked bars showing how far the net-worth verdict swings when each assumption
 * is shifted ±20%. The longest bar is the lever the decision hinges on.
 */
export const SensitivityTornado: React.FC<{ bars: SensitivityBar[] }> = ({ bars }) => {
  const maxSwing = Math.max(1, ...bars.map((b) => b.swing));

  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <p className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-muted-foreground opacity-60">
          Sensitivity
        </p>
        <CardTitle className="font-display font-light text-xl tracking-tight mt-0.5">
          What moves the answer most
        </CardTitle>
        <p className="text-[12px] text-muted-foreground mt-1">
          Net-worth swing at the horizon when each input is shifted ±20%. The top lever decides it.
        </p>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {bars.map((bar) => (
          <div key={String(bar.key)}>
            <div className="flex items-center justify-between text-[12px] mb-1">
              <span className="font-medium">{bar.label}</span>
              <span className="tabular-nums text-muted-foreground">±{compact(bar.swing / 2)}</span>
            </div>
            <div className="h-2.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-500/70"
                style={{ width: `${(bar.swing / maxSwing) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
