"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FINANCING_PRESETS } from "../_lib/presets";
import type { RentVsBuyInput } from "../_lib/types";

interface Props {
  input: RentVsBuyInput;
  onApply: (overrides: Partial<RentVsBuyInput>) => void;
}

/** Quick Philippine financing profiles that prefill rate / term / down payment. */
export function FinancingPresets({ input, onApply }: Props) {
  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <p className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-muted-foreground opacity-60">
          Financing profile
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        {FINANCING_PRESETS.map((preset) => {
          const active =
            input.mortgageRatePct === preset.overrides.mortgageRatePct &&
            input.loanTermYears === preset.overrides.loanTermYears &&
            input.downPaymentPct === preset.overrides.downPaymentPct;
          return (
            <button
              key={preset.key}
              type="button"
              onClick={() => onApply(preset.overrides)}
              className={cn(
                "w-full text-left rounded-sm border px-3 py-2 transition-colors",
                active
                  ? "border-foreground bg-foreground/[0.03]"
                  : "border-border hover:border-foreground/40"
              )}
            >
              <span className="block text-sm font-medium">{preset.label}</span>
              <span className="block text-[11px] text-muted-foreground">{preset.note}</span>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}
