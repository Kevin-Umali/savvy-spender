"use client";

import { Suspense, useMemo, useState } from "react";
import { useFxRates } from "@/lib/fx";
import { ComparisonTable } from "./_components/comparison-table";
import { DisclaimerCard } from "./_components/disclaimer-card";
import { SimulatorSidebar } from "./_components/simulator-sidebar";
import { ToolHeader } from "@/app/_components/tool-header";
import { HowItWorks } from "@/app/_components/how-it-works";
import { Glossary } from "@/app/_components/glossary";
import { CopyLinkButton } from "@/app/_components/copy-link-button";
import { useQueryState } from "@/lib/use-query-state";

const PAYOUT_GLOSSARY = [
  { term: "Receiving fee", def: "Charged when the payment lands — a %, a fixed fee, or both." },
  { term: "FX markup", def: "The % over the mid-market rate when the platform converts to PHP." },
  { term: "Cash-out fee", def: "Cost to move pesos from the platform to your bank or e-wallet." },
  { term: "Inactivity fee", def: "Some platforms (e.g. Payoneer) charge an annual fee if the account goes unused." },
  { term: "Hold foreign", def: "Whether you can keep a USD balance instead of auto-converting on arrival." },
];

const PAYOUT_DEFAULTS = { currency: "USD", amount: 1000 };
const PAYOUT_CODES = { currency: "c", amount: "a" } as const;

function PayoutCompare() {
  const rateState = useFxRates();
  const [state, patch] = useQueryState(PAYOUT_DEFAULTS, PAYOUT_CODES);
  const [search, setSearch] = useState("");

  const selectedCurrency = state.currency;
  const amount = state.amount;

  const phpPerUnit = useMemo(() => {
    if (!rateState.rates || !rateState.rates[selectedCurrency]) return null;
    return 1 / rateState.rates[selectedCurrency];
  }, [rateState.rates, selectedCurrency]);

  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-6 lg:gap-10">
      <aside className="lg:sticky lg:top-20 lg:self-start space-y-5">
        <SimulatorSidebar
          state={rateState}
          amount={amount}
          setAmount={(n) => patch({ amount: n })}
          selectedCurrency={selectedCurrency}
          setSelectedCurrency={(c) => patch({ currency: c })}
          search={search}
          setSearch={setSearch}
          phpPerUnit={phpPerUnit}
        />
        <DisclaimerCard />
      </aside>

      <section className="min-w-0 space-y-5">
        <div className="flex justify-end">
          <CopyLinkButton />
        </div>
        <ComparisonTable selectedCurrency={selectedCurrency} amount={amount} phpPerUnit={phpPerUnit} />
        <HowItWorks
          docsHref="/docs"
          points={[
            { heading: "What it does", body: "Computes the net pesos you keep after three fee layers — receiving fee, FX markup, and cash-out fee — on a live mid-market rate." },
            { heading: "Reading it", body: "Rows are sorted by net PHP, so the top keeps the most of your money. Wise usually converts closest to mid-market; Payoneer adds ~2%; PayPal is typically costliest." },
            { heading: "Tip", body: "If a platform lets you hold a foreign balance, you can convert when the rate is better instead of on arrival." },
          ]}
        />
        <Glossary items={PAYOUT_GLOSSARY} />
      </section>
    </div>
  );
}

export default function PayoutComparePage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
      <ToolHeader
        title="Freelancer Payout Comparison"
        description="Getting paid by a client abroad? See which app puts the most pesos in your pocket. Compare Wise, Payoneer, PayPal, e-wallets, bank wires, remittance, and a crypto off-ramp — net of receiving fees, FX markup, and cash-out charges, on a live mid-market rate."
      />
      <Suspense fallback={<div className="py-10 text-sm text-muted-foreground">Loading…</div>}>
        <PayoutCompare />
      </Suspense>
    </main>
  );
}
