"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ActionBar } from "./_components/action-bar";
import { BankSection } from "./_components/bank-section";
import { C2cSection } from "./_components/c2c-section";
import { EmptyResults } from "./_components/empty-results";
import { GlossaryCard } from "./_components/glossary-card";
import { InHouseSection } from "./_components/in-house-section";
import { KeyAssumptionsTable } from "./_components/key-assumptions-table";
import { MonthlyPaymentTable } from "./_components/monthly-payment-table";
import { RecommendationCard } from "./_components/recommendation-card";
import { ResultSummary } from "./_components/result-summary";
import { SampleCallout } from "./_components/sample-callout";
import { SectionLabel } from "./_components/form-controls";
import { TotalCostTable } from "./_components/total-cost-table";
import { UpfrontCashTable } from "./_components/upfront-cash-table";
import { VehicleSection } from "./_components/vehicle-section";
import { EMPTY_SCENARIO, SAMPLE_SCENARIO } from "./_lib/defaults";
import type { Priority } from "./_lib/options";
import type {
  BankInput,
  C2cInput,
  InHouseInput,
  LoanCompareResponse,
  ScenarioInput,
  VehicleInput,
} from "./_lib/types";

export default function LoanComparePage() {
  const [scenario, setScenario] = useState<ScenarioInput>(EMPTY_SCENARIO);
  const [response, setResponse] = useState<LoanCompareResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [priority, setPriority] = useState<Priority>("lowest-total");
  const [sampleDismissed, setSampleDismissed] = useState(false);

  const updateVehicle = useCallback(<K extends keyof VehicleInput>(
    field: K,
    value: VehicleInput[K]
  ) => {
    setScenario((p) => ({ ...p, vehicle: { ...p.vehicle, [field]: value } }));
  }, []);

  const updateBank = useCallback(<K extends keyof BankInput>(field: K, value: BankInput[K]) => {
    setScenario((p) => ({ ...p, bank: { ...p.bank, [field]: value } }));
  }, []);

  const updateC2c = useCallback(<K extends keyof C2cInput>(field: K, value: C2cInput[K]) => {
    setScenario((p) => ({ ...p, c2c: { ...p.c2c, [field]: value } }));
  }, []);

  const updateInHouse = useCallback(<K extends keyof InHouseInput>(
    field: K,
    value: InHouseInput[K]
  ) => {
    setScenario((p) => ({ ...p, inHouse: { ...p.inHouse, [field]: value } }));
  }, []);

  const handleCompare = async () => {
    if (!scenario.vehicle.originalPrice || scenario.vehicle.originalPrice <= 0) {
      toast.error("Enter a valid vehicle price.");
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
    setScenario(EMPTY_SCENARIO);
    setResponse(null);
    setSampleDismissed(false);
  };

  const showSampleCallout = !sampleDismissed && !response;

  return (
    <TooltipProvider delayDuration={200}>
      <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8 space-y-6">
        <header className="max-w-3xl">
          <SectionLabel>Tool</SectionLabel>
          <h1 className="font-display font-extralight text-3xl sm:text-4xl lg:text-5xl tracking-[-0.03em] mt-2">
            Car Financing Comparison
          </h1>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
            Compare a bank auto loan, credit-to-cash / personal loan, and dealer in-house financing
            side by side. Discounted price, upfront cash, monthly amortization, and lifecycle cost
            — with freebies and discounts handled cleanly so nothing is double-counted.
          </p>
        </header>

        {showSampleCallout && <SampleCallout onLoad={handleLoadSample} />}

        <VehicleSection vehicle={scenario.vehicle} onChange={updateVehicle} disabled={isLoading} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <BankSection input={scenario.bank} onChange={updateBank} disabled={isLoading} />
          <C2cSection input={scenario.c2c} onChange={updateC2c} disabled={isLoading} />
          <InHouseSection input={scenario.inHouse} onChange={updateInHouse} disabled={isLoading} />
        </div>

        <ActionBar
          isLoading={isLoading}
          onCompare={handleCompare}
          onLoadSample={handleLoadSample}
          onClear={handleClear}
        />

        {response ? (
          <div className="space-y-6 pt-4">
            <ResultSummary results={response.results} />
            <KeyAssumptionsTable response={response} />
            <UpfrontCashTable results={response.results} />
            <MonthlyPaymentTable results={response.results} />
            <TotalCostTable results={response.results} />
            <RecommendationCard
              results={response.results}
              priority={priority}
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
