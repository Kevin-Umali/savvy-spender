"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionLabel } from "./form-controls";

const ITEMS: { term: string; def: string }[] = [
  {
    term: "OMA (One Month Advance)",
    def: "The first monthly payment is collected at signing, so it's part of the upfront cash. Effectively, you start at month 2 on paper.",
  },
  {
    term: "Arrears",
    def: "The first monthly payment is billed after release or on the next billing cycle, so upfront cash is lower.",
  },
  {
    term: "Add-on rate",
    def: "Flat interest charged on the original principal every month, not the declining balance. Always higher than the equivalent effective interest rate.",
  },
  {
    term: "EIRPA",
    def: "Effective Interest Rate per Annum. The apples-to-apples cost of borrowing across products. Use this to compare bank auto loans vs personal loans vs credit-to-cash.",
  },
  {
    term: "Credit-to-Cash trade-off",
    def: "Often the lowest monthly payment because terms can be longer, but requires more upfront cash when the loanable amount is below the car's price.",
  },
  {
    term: "Bank Auto Loan trade-off",
    def: "Typically the cheapest overall cost, but adds chattel mortgage, stricter documentation, and comprehensive insurance requirements.",
  },
  {
    term: "In-House Financing trade-off",
    def: "Easiest approval and most flexible, but often the most expensive over the full term. Watch for hidden fees vs the dealer's advertised promo.",
  },
];

export function GlossaryCard() {
  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <SectionLabel>Glossary</SectionLabel>
        <CardTitle className="font-display font-light text-lg tracking-tight">
          Terms &amp; trade-offs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
          {ITEMS.map((i) => (
            <div key={i.term}>
              <dt className="font-mono-label text-[11px] uppercase tracking-[0.15em] text-foreground">
                {i.term}
              </dt>
              <dd className="text-[12px] text-muted-foreground leading-relaxed mt-0.5">{i.def}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
