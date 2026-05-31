"use client";

import { useMemo, useState } from "react";
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
export const TcoCard: React.FC<TcoCardProps> = ({ vehiclePrice, financingCost, optionName }) => {
  const [years, setYears] = useState(5);
  const [annualKm, setAnnualKm] = useState(15000);
  const [fuelPrice, setFuelPrice] = useState(65);
  const [kmPerL, setKmPerL] = useState(12);
  const [firstYearDep, setFirstYearDep] = useState(20);
  const [laterDep, setLaterDep] = useState(15);

  const { resaleValue, retentionPct, fuelTotal, tco } = useMemo(() => {
    const y = Math.max(0, Math.round(years));
    const retention =
      y <= 0 ? 1 : (1 - firstYearDep / 100) * Math.pow(1 - laterDep / 100, Math.max(0, y - 1));
    const resale = vehiclePrice * retention;
    const fuel = kmPerL > 0 ? y * (annualKm / kmPerL) * fuelPrice : 0;
    return {
      resaleValue: resale,
      retentionPct: retention * 100,
      fuelTotal: fuel,
      tco: financingCost + fuel - resale,
    };
  }, [years, annualKm, fuelPrice, kmPerL, firstYearDep, laterDep, vehiclePrice, financingCost]);

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
          Layers fuel and estimated resale onto the lowest-total option ({optionName}). Edit the
          assumptions — they&apos;re indicative PH 2026 figures, and Japanese brands hold value better.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <NumField label="Years owned" value={years} onChange={setYears} step={1} />
          <NumField label="Km / year" value={annualKm} onChange={setAnnualKm} step={1000} />
          <NumField label="Fuel ₱ / liter" value={fuelPrice} onChange={setFuelPrice} step={1} />
          <NumField label="Fuel economy (km/L)" value={kmPerL} onChange={setKmPerL} step={0.5} />
          <NumField
            label="Year-1 depreciation %"
            value={firstYearDep}
            onChange={setFirstYearDep}
            step={1}
            tip="New cars typically lose ~20% in the first year (up to 25% with heavy use)."
          />
          <NumField
            label="Later depreciation %/yr"
            value={laterDep}
            onChange={setLaterDep}
            step={1}
            tip="After year 1, ~15%/yr is typical; well-holding models lose ~10%."
          />
        </div>

        <dl className="rounded-sm border bg-muted/20 divide-y text-sm">
          <Row label="Financing total cost" value={formatCurrency(financingCost)} />
          <Row label={`Fuel over ${Math.max(0, Math.round(years))} yrs`} value={`+ ${formatCurrency(fuelTotal)}`} />
          <Row
            label={`Est. resale value (${retentionPct.toFixed(0)}% retained)`}
            value={`− ${formatCurrency(resaleValue)}`}
          />
          <div className="flex items-center justify-between px-3 py-2.5">
            <dt className="font-medium">Net cost of ownership</dt>
            <dd className="tabular-nums font-semibold">{formatCurrency(tco)}</dd>
          </div>
        </dl>
        <p className="text-[11px] text-muted-foreground/80 leading-relaxed">
          Estimate only. Excludes insurance renewals, maintenance, parking, and tolls. Resale assumes
          average condition; actual offers vary by brand, mileage, and demand.
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
