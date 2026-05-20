"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DISCOUNT_APPLIES_OPTIONS,
  FINANCING_KEYS,
  FINANCING_META,
  type FinancingKey,
} from "../_lib/options";
import type { VehicleInput } from "../_lib/types";
import { FieldLabel, NumField, SectionLabel, TextField } from "./form-controls";

export function VehicleSection({
  vehicle,
  onChange,
  disabled,
}: {
  vehicle: VehicleInput;
  onChange: <K extends keyof VehicleInput>(field: K, value: VehicleInput[K]) => void;
  disabled?: boolean;
}) {
  const toggleSelected = (key: FinancingKey) => {
    const exists = vehicle.selectedOptions.includes(key);
    onChange(
      "selectedOptions",
      exists
        ? vehicle.selectedOptions.filter((k) => k !== key)
        : [...vehicle.selectedOptions, key]
    );
  };

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <SectionLabel>Vehicle</SectionLabel>
        <CardTitle className="font-display font-light text-xl tracking-tight">
          Vehicle details &amp; dealer discount
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <TextField
          label="Vehicle name"
          value={vehicle.name}
          onChange={(v) => onChange("name", v)}
          placeholder="e.g. Toyota Yaris Cross 2026"
          disabled={disabled}
        />
        <NumField
          label="Original selling price"
          value={vehicle.originalPrice}
          onChange={(n) => onChange("originalPrice", n)}
          step={1000}
          disabled={disabled}
        />
        <NumField
          label="Dealer discount"
          value={vehicle.dealerDiscount}
          onChange={(n) => onChange("dealerDiscount", n)}
          step={1000}
          disabled={disabled}
          tip="Cash discount offered by the dealer. May only apply to specific financing channels."
        />
        <div>
          <FieldLabel tip="Controls which options have the discount netted from the price.">
            Discount applies to
          </FieldLabel>
          <Select
            value={vehicle.discountAppliesTo}
            onValueChange={(v) => onChange("discountAppliesTo", v as VehicleInput["discountAppliesTo"])}
            disabled={disabled}
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DISCOUNT_APPLIES_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {vehicle.discountAppliesTo === "selected" && (
          <div className="sm:col-span-2 lg:col-span-4">
            <FieldLabel>Discount applies to (select)</FieldLabel>
            <div className="flex flex-wrap gap-3">
              {FINANCING_KEYS.map((key) => (
                <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox
                    checked={vehicle.selectedOptions.includes(key)}
                    onCheckedChange={() => toggleSelected(key)}
                    disabled={disabled}
                  />
                  {FINANCING_META[key].label}
                </label>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
