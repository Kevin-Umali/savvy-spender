"use client";

import type { ChangeEvent } from "react";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { FIELD_GROUPS } from "../_lib/defaults";
import type { RentVsBuyInput } from "../_lib/types";

interface Props {
  input: RentVsBuyInput;
  onChange: <K extends keyof RentVsBuyInput>(key: K, value: RentVsBuyInput[K]) => void;
  realPesos: boolean;
  setRealPesos: (v: boolean) => void;
}

export const InputsForm: React.FC<Props> = ({ input, onChange, realPesos, setRealPesos }) => {
  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <p className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-muted-foreground opacity-60">
          Your scenario
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {FIELD_GROUPS.map((group) => (
          <div key={group.title}>
            <p className="font-mono-label text-[10px] uppercase tracking-[0.18em] text-foreground/70 mb-2">
              {group.title}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {group.fields.map((f) => (
                <NumField
                  key={f.key}
                  label={f.label}
                  tip={f.tip}
                  suffix={f.suffix}
                  step={f.step}
                  value={input[f.key] as number}
                  onChange={(v) => onChange(f.key, v as RentVsBuyInput[typeof f.key])}
                />
              ))}
            </div>
          </div>
        ))}

        <div className="space-y-2 pt-1 border-t">
          <CheckRow
            label="Assume you sell at the horizon (nets selling costs from equity)"
            checked={input.assumeSaleAtHorizon}
            onChange={(v) => onChange("assumeSaleAtHorizon", v)}
          />
          <CheckRow
            label="Show figures in today's pesos (inflation-adjusted)"
            checked={realPesos}
            onChange={setRealPesos}
          />
        </div>
      </CardContent>
    </Card>
  );
};

interface NumFieldProps {
  label: string;
  tip: string;
  suffix?: string;
  step: number;
  value: number;
  onChange: (v: number) => void;
}

const NumField: React.FC<NumFieldProps> = ({ label, tip, suffix, step, value, onChange }) => {
  return (
    <div>
      <Label className="font-mono-label text-[10px] uppercase tracking-[0.14em] text-muted-foreground opacity-70 mb-1 flex items-center gap-1">
        <span className="truncate">{label}</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <InfoCircledIcon className="h-3 w-3 shrink-0 text-muted-foreground cursor-help" />
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[240px] text-xs font-normal leading-relaxed">
            {tip}
          </TooltipContent>
        </Tooltip>
      </Label>
      <div className="relative">
        <Input
          type="number"
          min={0}
          step={step}
          value={value === 0 ? "" : value}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(+e.target.value || 0)}
          className="tabular-nums h-9 text-sm pr-12"
          placeholder="0"
        />
        {suffix && (
          <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
};

interface CheckRowProps {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

const CheckRow: React.FC<CheckRowProps> = ({ label, checked, onChange }) => {
  return (
    <label className="flex items-start gap-2 text-[11px] text-muted-foreground cursor-pointer select-none leading-relaxed">
      <Checkbox
        checked={checked}
        onCheckedChange={(v) => onChange(Boolean(v))}
        className="mt-0.5"
      />
      {label}
    </label>
  );
};
