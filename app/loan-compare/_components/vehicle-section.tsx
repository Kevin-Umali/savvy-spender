"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DISCOUNT_APPLIES_OPTIONS,
  DISCOUNT_TYPE_OPTIONS,
  type DiscountAppliesTo,
  type DiscountType,
} from "../_lib/options";
import type { VehicleInput } from "../_lib/types";
import { NumField, SectionLabel, SelectField, TextField } from "./form-controls";

interface VehicleSectionProps {
  vehicle: VehicleInput;
  onChange: <K extends keyof VehicleInput>(field: K, value: VehicleInput[K]) => void;
  disabled?: boolean;
}

export const VehicleSection: React.FC<VehicleSectionProps> = ({ vehicle, onChange, disabled }) => (
  <Card className="border-border">
    <CardHeader className="pb-3 space-y-1">
      <SectionLabel>Vehicle</SectionLabel>
      <p className="text-[11px] text-muted-foreground leading-snug">
        Applies to every financing option. Discounts are subtracted once per eligible option — never
        double-counted.
      </p>
    </CardHeader>
    <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <TextField
        label="Vehicle name"
        value={vehicle.name}
        onChange={(v) => onChange("name", v)}
        disabled={disabled}
        placeholder="Toyota Yaris Cross 2026"
      />
      <NumField
        label="Original selling price"
        value={vehicle.originalPrice}
        onChange={(v) => onChange("originalPrice", v)}
        step={1000}
        disabled={disabled}
        placeholder="1690000"
      />
      <NumField
        label={vehicle.discountType === "percent" ? "Dealer discount (%)" : "Dealer discount (₱)"}
        value={vehicle.discountAmount}
        onChange={(v) => onChange("discountAmount", v)}
        step={vehicle.discountType === "percent" ? 0.1 : 1000}
        disabled={disabled}
        tip="The headline dealer discount. Switch between a fixed amount and a percentage with the selector beside it."
      />
      <SelectField
        label="Discount type"
        value={vehicle.discountType}
        onChange={(v: DiscountType) => onChange("discountType", v)}
        options={DISCOUNT_TYPE_OPTIONS}
        disabled={disabled}
      />
      <SelectField
        label="Discount applies to"
        value={vehicle.discountAppliesTo}
        onChange={(v: DiscountAppliesTo) => onChange("discountAppliesTo", v)}
        options={DISCOUNT_APPLIES_OPTIONS}
        tip="'Selected' uses each option's own 'receives discount' toggle."
        disabled={disabled}
      />
      <NumField
        label="Other discounts / promos (₱)"
        value={vehicle.otherDiscounts}
        onChange={(v) => onChange("otherDiscounts", v)}
        disabled={disabled}
      />
      <NumField
        label="Reservation fee (₱)"
        value={vehicle.reservationFee}
        onChange={(v) => onChange("reservationFee", v)}
        tip="Counted as upfront cash and part of total cost."
        disabled={disabled}
      />
      <NumField
        label="Required accessories (₱)"
        value={vehicle.accessories}
        onChange={(v) => onChange("accessories", v)}
        disabled={disabled}
      />
      <NumField
        label="Other dealer charges (₱)"
        value={vehicle.otherCharges}
        onChange={(v) => onChange("otherCharges", v)}
        disabled={disabled}
      />
    </CardContent>
  </Card>
);
