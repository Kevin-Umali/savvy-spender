"use client";

import { useMemo, useState } from "react";
import { ComparisonTable } from "./_components/comparison-table";
import { DisclaimerCard } from "./_components/disclaimer-card";
import { SimulatorSidebar } from "./_components/simulator-sidebar";
import { useFxRates } from "./_lib/use-fx-rates";

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
      <div className="mb-8 max-w-3xl">
        <p className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-muted-foreground opacity-60 mb-2">
          Tool
        </p>
        <h1 className="font-display font-extralight text-3xl sm:text-4xl lg:text-5xl tracking-[-0.03em]">
          Card FX Comparison
        </h1>
        <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
          See which PH credit card is cheapest to use abroad. Compare foreign transaction markups
          across major card issuers and simulate the PHP cost of any foreign purchase.
        </p>
      </div>

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

        <section className="min-w-0">
          <ComparisonTable
            selectedCurrency={selectedCurrency}
            foreignAmount={foreignAmount}
            phpPerUnit={phpPerUnit}
            currencyName={currencyName}
          />
        </section>
      </div>
    </main>
  );
}
