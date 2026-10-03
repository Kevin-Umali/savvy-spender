"use client";

import { useMemo } from "react";
import { useQueryState } from "@/lib/use-query-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/client";
import { NumField } from "./form-controls";

interface TcoCardProps {
  vehiclePrice: number; // net vehicle price of the reference option
  financingCost: number; // total cost of the lowest-total option
  optionName: string;
}

/**
 * Opt-in total-cost-of-ownership estimate layered on top of the financing cost:
 * adds fuel over the holding period and subtracts the car's estimated resale
 * value. Assumptions are editable and clearly indicative (PH market, 2026):
 * ~20% depreciation year 1, ~15%/yr after; gasoline ~₱65/L; ~12 km/L.
 */
const DEFAULTS = {
  years: 5,
  annualKm: 15000,
  fuelPrice: 65,
  kmPerL: 12,
  firstYearDep: 20,
  laterDep: 15,
};
const CODES = {
  years: "ty",
  annualKm: "tk",
  fuelPrice: "tf",
  kmPerL: "te",
  firstYearDep: "td1",
  laterDep: "td2",
};
const BOUNDS = {
  years: [0, 50] as const,
  annualKm: [0, 1e7] as const,
  fuelPrice: [0, 1e5] as const,
  kmPerL: [0.1, 1e5] as const,
  firstYearDep: [0, 100] as const,
  laterDep: [0, 100] as const,
};
export const TcoCard: React.FC<TcoCardProps> = ({
  vehiclePrice,
  financingCost,
  optionName,
}) => {
  const [
    { years, annualKm, fuelPrice, kmPerL, firstYearDep, laterDep },
    patch,
  ] = useQueryState(DEFAULTS, CODES, BOUNDS);
  const setYears = (years: number) =>
    patch({ years: Math.max(0, Math.min(50, years)) });
  const setAnnualKm = (annualKm: number) =>
    patch({ annualKm: Math.max(0, annualKm) });
  const setFuelPrice = (fuelPrice: number) =>
    patch({ fuelPrice: Math.max(0, fuelPrice) });
  const setKmPerL = (kmPerL: number) =>
    patch({ kmPerL: Math.max(0.1, kmPerL) });
  const setFirstYearDep = (firstYearDep: number) =>
    patch({ firstYearDep: Math.max(0, Math.min(100, firstYearDep)) });
  const setLaterDep = (laterDep: number) =>
    patch({ laterDep: Math.max(0, Math.min(100, laterDep)) });

  const { resaleValue, retentionPct, fuelTotal, tco } = useMemo(() => {
    const y = Math.max(0, Math.round(years));
    const retention =
      y <= 0
        ? 1
        : (1 - firstYearDep / 100) *
          Math.pow(1 - laterDep / 100, Math.max(0, y - 1));
    const resale = vehiclePrice * retention;
    const fuel = kmPerL > 0 ? y * (annualKm / kmPerL) * fuelPrice : 0;
    return {
      resaleValue: resale,
      retentionPct: retention * 100,
      fuelTotal: fuel,
      tco: financingCost + fuel - resale,
    };
  }, [
    years,
    annualKm,
    fuelPrice,
    kmPerL,
    firstYearDep,
    laterDep,
    vehiclePrice,
    financingCost,
  ]);

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <p className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-muted-foreground opacity-60">
          Total cost of ownership
        </p>
        <CardTitle className="font-display font-light text-xl tracking-tight mt-0.5">
          Beyond the loan — fuel &amp; resale
        </CardTitle>
        <p className="text-[12px] text-muted-foreground mt-1">
          Layers fuel and estimated resale onto the lowest-total option (
          {optionName}). Edit the assumptions — these are illustrative inputs,
          not current fuel prices or verified resale forecasts.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <NumField
            label="Years owned"
            value={years}
            onChange={setYears}
            step={1}
          />
          <NumField
            label="Km / year"
            value={annualKm}
            onChange={setAnnualKm}
            step={1000}
          />
          <NumField
            label="Fuel ₱ / liter"
            value={fuelPrice}
            onChange={setFuelPrice}
            step={1}
          />
          <NumField
            label="Fuel economy (km/L)"
            value={kmPerL}
            onChange={setKmPerL}
            step={0.5}
          />
          <NumField
            label="Year-1 depreciation %"
            value={firstYearDep}
            onChange={setFirstYearDep}
            step={1}
            tip="Illustrative assumption. Use a resale estimate for the actual model and condition."
          />
          <NumField
            label="Later depreciation %/yr"
            value={laterDep}
            onChange={setLaterDep}
            step={1}
            tip="Illustrative yearly depreciation. Actual resale depends on model, mileage, condition, and market."
          />
        </div>

        <dl className="rounded-sm border bg-muted/20 divide-y text-sm">
          <Row
            label="Financing total cost"
            value={formatCurrency(financingCost)}
          />
          <Row
            label={`Fuel over ${Math.max(0, Math.round(years))} yrs`}
            value={`+ ${formatCurrency(fuelTotal)}`}
          />
          <Row
            label={`Est. resale value (${retentionPct.toFixed(0)}% retained)`}
            value={`− ${formatCurrency(resaleValue)}`}
          />
          <div className="flex items-center justify-between px-3 py-2.5">
            <dt className="font-medium">Net cost of ownership</dt>
            <dd className="tabular-nums font-semibold">
              {formatCurrency(tco)}
            </dd>
          </div>
        </dl>
        <p className="text-[11px] text-muted-foreground/80 leading-relaxed">
          Estimate only. Excludes insurance renewals, maintenance, parking, and
          tolls. Resale assumes average condition; actual offers vary by brand,
          mileage, and demand.
        </p>
      </CardContent>
    </Card>
  );
};

const Row: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex items-center justify-between px-3 py-2">
    <dt className="text-muted-foreground">{label}</dt>
    <dd className="tabular-nums">{value}</dd>
  </div>
);
