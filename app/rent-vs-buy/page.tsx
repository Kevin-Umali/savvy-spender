"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { simulate } from "./_lib/compute";
import { monteCarlo } from "./_lib/monte-carlo";
import { sensitivity } from "./_lib/solver";
import { DEFAULT_INPUT } from "./_lib/defaults";
import { decodeInput, encodeInput } from "./_lib/url-state";
import type { RentVsBuyInput } from "./_lib/types";
import { InputsForm } from "./_components/inputs-form";
import { FinancingPresets } from "./_components/financing-presets";
import { ShareBar } from "./_components/share-bar";
import { ResultSummary } from "./_components/result-summary";
import { BreakevenChart } from "./_components/breakeven-chart";
import { SensitivityTornado } from "./_components/sensitivity-tornado";
import { GoalSeekCard } from "./_components/goal-seek-card";
import { PriceToRentGauge } from "./_components/price-to-rent-gauge";
import { YearlyTable } from "./_components/yearly-table";
import { AssumptionsCard } from "./_components/assumptions-card";

function RentVsBuy() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [input, setInput] = useState<RentVsBuyInput>(() => decodeInput(searchParams));
  const [realPesos, setRealPesos] = useState(false);

  // Keep the URL in sync so the scenario is shareable / reloadable.
  useEffect(() => {
    const query = encodeInput(input);
    router.replace(query ? `?${query}` : window.location.pathname, { scroll: false });
  }, [input, router]);

  const onChange = useCallback(
    <K extends keyof RentVsBuyInput>(key: K, value: RentVsBuyInput[K]) =>
      setInput((prev) => ({ ...prev, [key]: value })),
    []
  );
  const applyPreset = useCallback(
    (overrides: Partial<RentVsBuyInput>) => setInput((prev) => ({ ...prev, ...overrides })),
    []
  );

  const result = useMemo(() => simulate(input), [input]);
  const mc = useMemo(() => monteCarlo(input), [input]);
  const bars = useMemo(() => sensitivity(input), [input]);

  return (
    <div className="grid lg:grid-cols-[300px_1fr] gap-6 lg:gap-10">
        <aside className="lg:sticky lg:top-20 lg:self-start space-y-5">
          <FinancingPresets input={input} onApply={applyPreset} />
          <InputsForm
            input={input}
            onChange={onChange}
            realPesos={realPesos}
            setRealPesos={setRealPesos}
          />
          <AssumptionsCard />
        </aside>

        <section className="min-w-0 space-y-5">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <p className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-muted-foreground opacity-60">
              Results {realPesos ? "· today's pesos" : "· nominal pesos"}
            </p>
            <ShareBar input={input} onReset={() => setInput(DEFAULT_INPUT)} />
          </div>

          <ResultSummary result={result} mc={mc} realPesos={realPesos} />

          <div className="grid md:grid-cols-2 gap-5">
            <PriceToRentGauge ratio={result.priceToRent} />
            <SensitivityTornado bars={bars} />
          </div>

          <BreakevenChart result={result} mc={mc} realPesos={realPesos} />

          <GoalSeekCard input={input} />

          <YearlyTable result={result} realPesos={realPesos} />
        </section>
    </div>
  );
}

export default function RentVsBuyPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
      <div className="mb-8 max-w-3xl">
        <p className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-muted-foreground opacity-60 mb-2">
          Tool
        </p>
        <h1 className="font-display font-extralight text-3xl sm:text-4xl lg:text-5xl tracking-[-0.03em]">
          Rent vs. Buy a Home
        </h1>
        <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
          Should you buy that condo or keep renting and invest the difference? This runs a year-by-year
          wealth simulation — mortgage, amilyar, dues, appreciation, and the opportunity cost of your
          down payment — then tells you the break-even year and the probability buying actually wins.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="py-10 text-sm text-muted-foreground">Loading simulator…</div>
        }
      >
        <RentVsBuy />
      </Suspense>
    </main>
  );
}
