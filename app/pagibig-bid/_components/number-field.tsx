"use client";

import { useEffect, useId, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HelpTooltip } from "@/components/help-tooltip";

export function NumberField({ label, value, onChange, max, step = 0.01, tip }: {
  label: string; value: number; onChange: (value: number) => void;
  max?: number; step?: number; tip?: string;
}) {
  const id = useId();
  const money = label.includes("₱");
  const [text, setText] = useState(String(value));
  const [focused, setFocused] = useState(false);
  useEffect(() => { if (!focused) setText(Number.isFinite(value) ? value.toLocaleString("en-PH", { maximumFractionDigits: 2 }) : ""); }, [value, focused]);
  return (
    <div className="space-y-1.5 min-w-0">
      <div className="flex items-center gap-1">
        <Label htmlFor={id} className="text-xs leading-relaxed">{label}</Label>
        {tip && <HelpTooltip label={`About ${label}`}>{tip}</HelpTooltip>}
      </div>
      {money ? <Input id={id} type="text" inputMode="decimal" value={text}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        onChange={(event) => {
          const raw = event.target.value;
          setText(raw);
          const clean = raw.replace(/[₱,\s]/g, "");
          onChange(/^\d*(\.\d{0,2})?$/.test(clean) && clean !== "." ? Number(clean) : NaN);
        }} className="tabular-nums" /> : <Input id={id} type="number" inputMode="decimal" min={0} max={max} step={step}
        value={value} onChange={(event) => onChange(Number(event.target.value))} className="tabular-nums" />}
    </div>
  );
}
