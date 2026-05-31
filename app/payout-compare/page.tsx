"use client";

import { useMemo, useState } from "react";
import { useFxRates } from "@/app/fx-compare/_lib/use-fx-rates";
import { ComparisonTable } from "./_components/comparison-table";
import { DisclaimerCard } from "./_components/disclaimer-card";
import { SimulatorSidebar } from "./_components/simulator-sidebar";

export default function PayoutComparePage() {
  const rateState = useFxRates();
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [amount, setAmount] = useState<number>(1000);
  const [search, setSearch] = useState("");

  const phpPerUnit = useMemo(() => {
    if (!rateState.rates || !rateState.rates[selectedCurrency]) return null;
    return 1 / rateState.rates[selectedCurrency];
  }, [rateState.rates, selectedCurrency]);

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
      <div className="mb-8 max-w-3xl">
        <p className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-muted-foreground opacity-60 mb-2">
          Tool
        </p>
        <h1 className="font-display font-extralight text-3xl sm:text-4xl lg:text-5xl tracking-[-0.03em]">
          Freelancer Payout Comparison
        </h1>
        <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
          Getting paid by a client abroad? See which app puts the most pesos in your pocket. Compare
          Wise, Payoneer, PayPal, e-wallets, bank wires, remittance, and a crypto off-ramp — net of
          receiving fees, FX markup, and cash-out charges, on a live mid-market rate.
        </p>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-6 lg:gap-10">
        <aside className="lg:sticky lg:top-20 lg:self-start space-y-5">
          <SimulatorSidebar
            state={rateState}
            amount={amount}
            setAmount={setAmount}
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
            amount={amount}
            phpPerUnit={phpPerUnit}
          />
        </section>
      </div>
    </main>
  );
}
