"use client";

import { useMemo, useState } from "react";
import { ComparisonTable } from "./_components/comparison-table";
import { DisclaimerCard } from "./_components/disclaimer-card";
import { SimulatorSidebar } from "./_components/simulator-sidebar";
import { useFxRates } from "./_lib/use-fx-rates";
import { ToolHeader } from "@/app/_components/tool-header";
import { HowItWorks } from "@/app/_components/how-it-works";
import { Glossary } from "@/app/_components/glossary";

const FX_GLOSSARY = [
  { term: "Mid-market rate", def: "The real interbank rate with no markup — the benchmark every card is measured against." },
  { term: "FX markup", def: "The total % your card adds over the mid-market rate on a foreign charge." },
  { term: "Network assessment", def: "Visa (~1%) or Mastercard (~0.2–1%) cross-border fee, usually bundled into the markup." },
  { term: "0% forex", def: "Cards that waive the bank's markup; the network assessment may still apply." },
];

export default function FxComparePage() {
  const rateState = useFxRates();
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [foreignAmount, setForeignAmount] = useState<number>(100);
  const [search, setSearch] = useState("");

  const phpPerUnit = useMemo(() => {
    if (!rateState.rates || !rateState.rates[selectedCurrency]) return null;
    return 1 / rateState.rates[selectedCurrency];
  }, [rateState.rates, selectedCurrency]);

  const currencyName =
    rateState.currencies.find((c) => c.code === selectedCurrency)?.name ?? selectedCurrency;

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
      <ToolHeader
        title="Card FX Comparison"
        description="See which PH credit card is cheapest to use abroad. Compare foreign transaction markups across major card issuers and simulate the PHP cost of any foreign purchase."
      />

      <div className="grid lg:grid-cols-[280px_1fr] gap-6 lg:gap-10">
        <aside className="lg:sticky lg:top-20 lg:self-start space-y-5">
          <SimulatorSidebar
            state={rateState}
            foreignAmount={foreignAmount}
            setForeignAmount={setForeignAmount}
            selectedCurrency={selectedCurrency}
            setSelectedCurrency={setSelectedCurrency}
            search={search}
            setSearch={setSearch}
            phpPerUnit={phpPerUnit}
          />
          <DisclaimerCard />
        </aside>

        <section className="min-w-0 space-y-5">
          <ComparisonTable
            selectedCurrency={selectedCurrency}
            foreignAmount={foreignAmount}
            phpPerUnit={phpPerUnit}
            currencyName={currencyName}
          />
          <HowItWorks
            docsHref="/docs"
            points={[
              { heading: "What it does", body: "Ranks PH credit cards by their all-in foreign-transaction markup and shows the peso cost of a purchase at the live mid-market rate." },
              { heading: "Reading it", body: "Lower markup = cheaper abroad. A 0% card keeps the full mid-market value; standard cards add ~1.5–3.5%." },
            ]}
          />
          <Glossary items={FX_GLOSSARY} />
        </section>
      </div>
    </main>
  );
}
