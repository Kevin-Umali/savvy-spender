"use client";

import { Suspense, useCallback, useMemo, useState } from "react";
import { useQueryState } from "nuqs";
import { scenarioParser } from "./_lib/url-state";
import { computeComparison } from "./_lib/compute";
import { scenarioSchema } from "./_lib/schema";
import { CopyLinkButton } from "@/app/_components/copy-link-button";
import { useShareSnapshot } from "@/components/share-state-provider";
import { toast } from "sonner";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { downloadCsv } from "@/lib/csv";
import { ActionBar } from "./_components/action-bar";
import { CompareSettings } from "./_components/compare-settings";
import { EmptyResults } from "./_components/empty-results";
import { FeesTable } from "./_components/fees-table";
import { GlossaryCard } from "./_components/glossary-card";
import { KeyAssumptionsTable } from "./_components/key-assumptions-table";
import { MonthlyPaymentTable } from "./_components/monthly-payment-table";
import { OptionListEditor } from "./_components/option-list-editor";
import { RecommendationCard } from "./_components/recommendation-card";
import { ResultSummary } from "./_components/result-summary";
import { AmortizationCard } from "./_components/amortization-card";
import { TcoCard } from "./_components/tco-card";
import { SampleCallout } from "./_components/sample-callout";
import { TotalCostTable } from "./_components/total-cost-table";
import { UpfrontCashTable } from "./_components/upfront-cash-table";
import { VehicleSection } from "./_components/vehicle-section";
import { ToolHeader } from "@/app/_components/tool-header";
import { HowItWorks } from "@/app/_components/how-it-works";
import {
  EMPTY_SCENARIO,
  SAMPLE_SCENARIO,
  newId,
  newOption,
} from "./_lib/defaults";
import type { ComparisonScope, Priority } from "./_lib/options";
import type { FinancingOption, VehicleInput } from "./_lib/types";

const shareParsers = { s: scenarioParser.withDefault(EMPTY_SCENARIO) };
function LoanCompare() {
  const [scenario, setScenario] = useQueryState("s", shareParsers.s);
  const shareValues = useMemo(() => ({ s: scenario }), [scenario]);
  useShareSnapshot(shareParsers, shareValues);
  const response = useMemo(() => {
    const parsed = scenarioSchema.safeParse(scenario);
    return parsed.success && parsed.data.vehicle.originalPrice > 0
      ? computeComparison(parsed.data)
      : null;
  }, [scenario]);
  const isLoading = false;
  const [sampleDismissed, setSampleDismissed] = useState(false);

  const updateVehicle = useCallback(
    <K extends keyof VehicleInput>(field: K, value: VehicleInput[K]) => {
      setScenario((p) => ({ ...p, vehicle: { ...p.vehicle, [field]: value } }));
    },
    [setScenario],
  );

  const updateOption = useCallback(
    (id: string, patch: Partial<FinancingOption>) => {
      setScenario((p) => ({
        ...p,
        options: p.options.map((o) => (o.id === id ? { ...o, ...patch } : o)),
      }));
    },
    [setScenario],
  );

  const addOption = useCallback(() => {
    setScenario((p) => ({
      ...p,
      options:
        p.options.length >= 20
          ? p.options
          : [
              ...p.options,
              newOption({ name: `Option ${p.options.length + 1}` }),
            ],
    }));
  }, [setScenario]);

  const addPresetOption = useCallback(
    (option: FinancingOption) => {
      setScenario((p) => ({
        ...p,
        options: p.options.length >= 20 ? p.options : [...p.options, option],
      }));
    },
    [setScenario],
  );

  const exportCsv = useCallback(() => {
    if (!response) return;
    downloadCsv(
      "car-financing-comparison",
      [
        "Option",
        "Type",
        "Provider",
        "Term (mo)",
        "Monthly",
        "Total interest",
        "Upfront cash",
        "Total cost",
      ],
      response.results.map((r) => [
        r.name,
        r.typeLabel,
        r.provider || "",
        r.termMonths,
        r.monthlyPayment.toFixed(2),
        r.totalInterest.toFixed(2),
        r.upfrontCash.toFixed(2),
        r.totalCost.toFixed(2),
      ]),
    );
  }, [response]);

  const duplicateOption = useCallback(
    (id: string) => {
      setScenario((p) => {
        const src = p.options.find((o) => o.id === id);
        if (!src || p.options.length >= 20) return p;
        const copy: FinancingOption = {
          ...src,
          id: newId(),
          name: `${src.name || "Option"} (copy)`,
          fees: src.fees.map((f) => ({ ...f, id: newId("fee") })),
          insurance: { ...src.insurance },
          registration: { ...src.registration },
        };
        const idx = p.options.findIndex((o) => o.id === id);
        const options = [...p.options];
        options.splice(idx + 1, 0, copy);
        return { ...p, options };
      });
    },
    [setScenario],
  );

  const removeOption = useCallback(
    (id: string) => {
      setScenario((p) =>
        p.options.length <= 1
          ? p
          : { ...p, options: p.options.filter((o) => o.id !== id) },
      );
    },
    [setScenario],
  );

  const setScope = useCallback(
    (scope: ComparisonScope) => setScenario((p) => ({ ...p, scope })),
    [setScenario],
  );
  const setPriority = useCallback(
    (priority: Priority) => setScenario((p) => ({ ...p, priority })),
    [setScenario],
  );
  const setFullTerm = useCallback(
    (fullTerm: boolean) => setScenario((p) => ({ ...p, fullTerm })),
    [setScenario],
  );

  const handleCompare = () => {
    if (
      !scenario.vehicle.originalPrice ||
      scenario.vehicle.originalPrice <= 0
    ) {
      toast.error("Enter a valid vehicle price.");
      return;
    }
    if (scenario.options.length === 0) {
      toast.error("Add at least one financing option.");
      return;
    }
    if (!scenarioSchema.safeParse(scenario).success)
      toast.error("Check the option amounts, rates, and terms.");
    else toast.success("Comparison updated. Results also update as you edit.");
  };

  const handleLoadSample = () => {
    setScenario(SAMPLE_SCENARIO);
    setSampleDismissed(true);
    toast.success("Loaded Toyota Yaris Cross 2026 sample.");
  };

  const handleClear = () => {
    setScenario({
      ...EMPTY_SCENARIO,
      options: [newOption({ name: "Option 1" })],
    });
    setSampleDismissed(false);
  };

  const showSampleCallout = !sampleDismissed && !response;

  return (
    <TooltipProvider delayDuration={200}>
      <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8 space-y-6">
        <ToolHeader
          title="Car Financing Comparison"
          description="Compare up to 20 financing options — bank auto loans, credit-to-cash, personal loans, dealer in-house, or fully custom — side by side. Six monthly-payment modes, itemized fees, insurance and registration handling, and a recommendation tuned to your priority."
        />
        <div className="flex justify-end">
          <CopyLinkButton
            disabled={!scenarioSchema.safeParse(scenario).success}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Shared links include vehicle details, all options, fees, and notes in
          the URL. Do not include private information.
        </p>

        <HowItWorks
          docsHref="/docs"
          points={[
            {
              heading: "What it does",
              body: "Converts any quoted rate mode (add-on, effective, nominal, or a flat quote) into a monthly payment and total cost, so bank, in-house, and cash-style options compare on equal terms.",
            },
            {
              heading: "Reading it",
              body: "Pick a comparison scope (full cost, loan-only, or upfront cash) and the recommendation updates to your chosen priority.",
            },
          ]}
        />

        {showSampleCallout && <SampleCallout onLoad={handleLoadSample} />}

        <VehicleSection
          vehicle={scenario.vehicle}
          onChange={updateVehicle}
          disabled={isLoading}
        />

        <CompareSettings
          scope={scenario.scope}
          setScope={setScope}
          priority={scenario.priority}
          setPriority={setPriority}
          fullTerm={scenario.fullTerm}
          setFullTerm={setFullTerm}
          disabled={isLoading}
        />

        <OptionListEditor
          options={scenario.options}
          discountAppliesTo={scenario.vehicle.discountAppliesTo}
          onUpdate={updateOption}
          onAdd={addOption}
          onAddPreset={addPresetOption}
          onDuplicate={duplicateOption}
          onRemove={removeOption}
          disabled={isLoading}
        />

        <ActionBar
          isLoading={isLoading}
          onCompare={handleCompare}
          onLoadSample={handleLoadSample}
          onClear={handleClear}
        />

        {response ? (
          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-muted-foreground opacity-60">
                Results
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={exportCsv}
                className="gap-1.5"
              >
                <Download className="h-3.5 w-3.5" />
                Export CSV
              </Button>
            </div>
            <ResultSummary
              results={response.results}
              cheapestId={response.cheapestId}
            />
            <KeyAssumptionsTable response={response} />
            <MonthlyPaymentTable
              results={response.results}
              cheapestId={response.cheapestId}
            />
            <UpfrontCashTable results={response.results} />
            <FeesTable results={response.results} />
            <TotalCostTable
              results={response.results}
              cheapestId={response.cheapestId}
              scope={response.scope}
            />
            {(() => {
              const cheapest =
                response.results.find((r) => r.id === response.cheapestId) ??
                response.results[0];
              if (!cheapest) return null;
              return (
                <>
                  <AmortizationCard result={cheapest} />
                  <TcoCard
                    vehiclePrice={cheapest.netVehiclePrice}
                    financingCost={cheapest.totalCost}
                    optionName={cheapest.name}
                  />
                </>
              );
            })()}
            <RecommendationCard
              results={response.results}
              recommendations={response.recommendations}
              priority={scenario.priority}
              setPriority={setPriority}
            />
            <GlossaryCard />
          </div>
        ) : (
          <EmptyResults onLoadSample={handleLoadSample} />
        )}
      </main>
    </TooltipProvider>
  );
}

export default function LoanComparePage() {
  return (
    <Suspense
      fallback={
        <p className="p-6 text-sm text-muted-foreground">Loading comparison…</p>
      }
    >
      <LoanCompare />
    </Suspense>
  );
}
