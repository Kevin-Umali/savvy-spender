"use client";

import { Card, CardContent } from "@/components/ui/card";
import { PAYOUT_DATA_REVIEWED } from "../_lib/data";

export const DisclaimerCard: React.FC = () => (
  <Card className="border-border">
    <CardContent className="pt-5">
      <p className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-muted-foreground opacity-60 mb-2">
        Disclaimer
      </p>
      <p className="text-[11px] text-muted-foreground leading-relaxed">
        Platform fees are indicative and folded into a single estimate (receiving fee + FX markup +
        cash-out). They change often and vary by corridor, amount, and sender. Reviewed{" "}
        {PAYOUT_DATA_REVIEWED}. Always confirm the exact fees with the provider before relying on
        them.
      </p>
    </CardContent>
  </Card>
);
