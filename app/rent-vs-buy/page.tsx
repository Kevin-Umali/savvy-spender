"use client";

import { Suspense, useMemo } from "react";
import { useQueryState } from "@/lib/use-query-state";
import { simulate } from "./_lib/compute";
import { monteCarlo } from "./_lib/monte-carlo";
import { sensitivity } from "./_lib/solver";
import { DEFAULT_INPUT } from "./_lib/defaults";
import { QUERY_CODES, INPUT_BOUNDS } from "./_lib/url-state";
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
import { ToolHeader } from "@/app/_components/tool-header";

const VIEW_DEFAULTS = { realPesos: false };
const VIEW_CODES = { realPesos: "real" };

const RentVsBuy: React.FC = () => {
  const [input, applyPreset, reset] = useQueryState(
    DEFAULT_INPUT,
    QUERY_CODES,
    INPUT_BOUNDS,
  );
  const [{ realPesos }, patchView] = useQueryState(VIEW_DEFAULTS, VIEW_CODES);
  const setRealPesos = (value: boolean) => patchView({ realPesos: value });
  const onChange = <K extends keyof RentVsBuyInput>(
    key: K,
    value: RentVsBuyInput[K],
  ) => {
    const range = INPUT_BOUNDS[key];
    applyPreset({
      [key]:
        typeof value === "number" && range
          ? Math.max(range[0], Math.min(range[1], value))
          : value,
    });
  };

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
          <ShareBar
            onReset={() => {
              reset();
              setRealPesos(false);
            }}
          />
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
};

const RentVsBuyPage: React.FC = () => {
  return (
    <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
      <ToolHeader
        title="Rent vs. Buy a Home"
        description="Should you buy that condo or keep renting and invest the difference? This runs a year-by-year wealth simulation — mortgage, amilyar, dues, appreciation, and the opportunity cost of your down payment — then tells you the break-even year and the share of illustrative model runs where buying wins."
      />

      <Suspense
        fallback={
          <div className="py-10 text-sm text-muted-foreground">
            Loading simulator…
          </div>
        }
      >
        <RentVsBuy />
      </Suspense>
    </main>
  );
};

export default RentVsBuyPage;
