"use client";

import { CARD_FX_DATA_REVIEWED } from "../_lib/data";

export function DisclaimerCard() {
  return (
    <div className="rounded-sm border border-dashed p-4 text-[11px] text-muted-foreground leading-relaxed space-y-2">
      <p className="font-mono-label text-[10px] uppercase tracking-[0.2em] opacity-60">
        Disclaimer
      </p>
      <p>
        Bank markups are sourced from publicly available fee schedules and may
        change. The reference rate used here is from an open FX API (not a bank
        rate). Final PHP amount may differ from your actual billing.
      </p>
      <p>
        Network assessments are issuer- and product-specific, not a universal
        Visa/Mastercard rate. The table includes verified products only; it is
        not an exhaustive card directory. Promo eligibility matters.
      </p>
      <p className="border-t pt-2 text-[10px] opacity-60">
        Bank markup data last reviewed: {CARD_FX_DATA_REVIEWED}. Sources: bank
        fee schedules, cardholder agreements, BSP filings.
      </p>
    </div>
  );
}
