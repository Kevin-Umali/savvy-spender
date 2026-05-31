"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
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
import { SampleCallout } from "./_components/sample-callout";
import { TotalCostTable } from "./_components/total-cost-table";
import { UpfrontCashTable } from "./_components/upfront-cash-table";
import { VehicleSection } from "./_components/vehicle-section";
import { ToolHeader } from "@/app/_components/tool-header";
import { HowItWorks } from "@/app/_components/how-it-works";
import { EMPTY_SCENARIO, SAMPLE_SCENARIO, newId, newOption } from "./_lib/defaults";
import type { ComparisonScope, Priority } from "./_lib/options";
import type {
  FinancingOption,
  LoanCompareResponse,
  ScenarioInput,
  VehicleInput,
} from "./_lib/types";

export default function LoanComparePage() {
  const [scenario, setScenario] = useState<ScenarioInput>(EMPTY_SCENARIO);
  const [response, setResponse] = useState<LoanCompareResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sampleDismissed, setSampleDismissed] = useState(false);

  const updateVehicle = useCallback(
    <K extends keyof VehicleInput>(field: K, value: VehicleInput[K]) => {
      setScenario((p) => ({ ...p, vehicle: { ...p.vehicle, [field]: value } }));
    },
    []
  );

  const updateOption = useCallback((id: string, patch: Partial<FinancingOption>) => {
    setScenario((p) => ({
      ...p,
      options: p.options.map((o) => (o.id === id ? { ...o, ...patch } : o)),
    }));
  }, []);

  const addOption = useCallback(() => {
    setScenario((p) => ({
      ...p,
      options: [...p.options, newOption({ name: `Option ${p.options.length + 1}` })],
    }));
  }, []);

  const duplicateOption = useCallback((id: string) => {
    setScenario((p) => {
      const src = p.options.find((o) => o.id === id);
      if (!src) return p;
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
  }, []);

  const removeOption = useCallback((id: string) => {
    setScenario((p) =>
      p.options.length <= 1 ? p : { ...p, options: p.options.filter((o) => o.id !== id) }
    );
  }, []);

  const setScope = useCallback((scope: ComparisonScope) => setScenario((p) => ({ ...p, scope })), []);
  const setPriority = useCallback(
    (priority: Priority) => setScenario((p) => ({ ...p, priority })),
    []
  );
  const setFullTerm = useCallback(
    (fullTerm: boolean) => setScenario((p) => ({ ...p, fullTerm })),
    []
  );

  const handleCompare = async () => {
    if (!scenario.vehicle.originalPrice || scenario.vehicle.originalPrice <= 0) {
      toast.error("Enter a valid vehicle price.");
      return;
    }
    if (scenario.options.length === 0) {
      toast.error("Add at least one financing option.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/loan-compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scenario),
      });
      if (!res.ok) throw new Error("Calculation failed");
      const data = (await res.json()) as LoanCompareResponse;
      setResponse(data);
    } catch {
      toast.error("Failed to calculate. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSample = () => {
    setScenario(SAMPLE_SCENARIO);
    setSampleDismissed(true);
    setResponse(null);
    toast.success("Loaded Toyota Yaris Cross 2026 sample.");
  };

  const handleClear = () => {
    setScenario({ ...EMPTY_SCENARIO, options: [newOption({ name: "Option 1" })] });
    setResponse(null);
    setSampleDismissed(false);
  };

  const showSampleCallout = !sampleDismissed && !response;

  return (
    <TooltipProvider delayDuration={200}>
      <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8 space-y-6">
        <ToolHeader
          title="Car Financing Comparison"
          description="Compare any number of financing options — bank auto loans, credit-to-cash, personal loans, dealer in-house, or fully custom — side by side. Six monthly-payment modes, itemized fees with no double-counting, insurance and registration handling, and a recommendation tuned to your priority."
        />

        <HowItWorks
          docsHref="/docs"
          points={[
            { heading: "What it does", body: "Converts any quoted rate mode (add-on, effective, nominal, or a flat quote) into a monthly payment and total cost, so bank, in-house, and cash-style options compare on equal terms." },
            { heading: "Reading it", body: "Pick a comparison scope (full cost, loan-only, or upfront cash) and the recommendation updates to your chosen priority." },
          ]}
        />

        {showSampleCallout && <SampleCallout onLoad={handleLoadSample} />}

        <VehicleSection vehicle={scenario.vehicle} onChange={updateVehicle} disabled={isLoading} />

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
            <ResultSummary results={response.results} cheapestId={response.cheapestId} />
            <KeyAssumptionsTable response={response} />
            <MonthlyPaymentTable results={response.results} cheapestId={response.cheapestId} />
            <UpfrontCashTable results={response.results} />
            <FeesTable results={response.results} />
            <TotalCostTable
              results={response.results}
              cheapestId={response.cheapestId}
              scope={response.scope}
            />
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
