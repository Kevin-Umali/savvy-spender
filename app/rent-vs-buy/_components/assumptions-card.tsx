"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

/** Methodology + the disclaimer every Savvy Spender tool carries. */
export const AssumptionsCard: React.FC = () => {
  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <p className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-muted-foreground opacity-60">
          How this works
        </p>
      </CardHeader>
      <CardContent className="space-y-2.5 text-[12px] text-muted-foreground leading-relaxed">
        <p>
          Both paths start with the same cash. The buyer sinks it into the down payment and closing
          costs; the renter keeps it invested. Each year the cheaper path invests the difference, so
          net worth is compared apples-to-apples — buying&apos;s net worth is home equity plus any
          invested surplus, renting&apos;s is the investment portfolio.
        </p>
        <p>
          Ownership carries the mortgage, amilyar (RPT + SEF on the assessed value), association
          dues, maintenance, and insurance. The home appreciates; rent escalates. The{" "}
          <span className="text-foreground">probability buying wins</span> comes from ~2,000
          Monte-Carlo runs that randomise appreciation, investment return, and rent growth around
          your estimates.
        </p>
        <p className="border-t border-border pt-2.5 text-[11px]">
          For reference only. Rates, taxes, and fees change and vary by bank, city, and property.
          This is a model, not financial advice — verify with the relevant institutions before
          deciding.
        </p>
      </CardContent>
    </Card>
  );
};
