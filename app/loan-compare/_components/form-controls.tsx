"use client";

import type { ReactNode } from "react";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { TERM_OPTIONS } from "../_lib/options";

export const SectionLabel: React.FC<{ children: ReactNode }> = ({ children }) => (
  <p className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-muted-foreground opacity-60">
    {children}
  </p>
);

export const FieldLabel: React.FC<{ children: ReactNode; tip?: string }> = ({ children, tip }) => (
  <Label className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground mb-1.5">
    {children}
    {tip && (
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button" className="inline-flex" tabIndex={-1}>
            <InfoCircledIcon className="h-3 w-3 opacity-50 hover:opacity-100" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-[240px] text-xs">{tip}</TooltipContent>
      </Tooltip>
    )}
  </Label>
);

export const NumField: React.FC<{
  label: string;
  value: number;
  onChange: (n: number) => void;
  tip?: string;
  step?: number;
  disabled?: boolean;
  placeholder?: string;
}> = ({ label, value, onChange, tip, step = 1, disabled, placeholder }) => (
  <div>
    <FieldLabel tip={tip}>{label}</FieldLabel>
    <Input
      type="number"
      min={0}
      step={step}
      value={value === 0 ? "" : value}
      onChange={(e) => onChange(+e.target.value || 0)}
      className="tabular-nums h-9 text-sm"
      disabled={disabled}
      placeholder={placeholder ?? "0"}
    />
  </div>
);

export const TextField: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  tip?: string;
  disabled?: boolean;
  placeholder?: string;
}> = ({ label, value, onChange, tip, disabled, placeholder }) => (
  <div>
    <FieldLabel tip={tip}>{label}</FieldLabel>
    <Input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 text-sm"
      disabled={disabled}
      placeholder={placeholder}
    />
  </div>
);

export const TextAreaField: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  tip?: string;
  disabled?: boolean;
  placeholder?: string;
}> = ({ label, value, onChange, tip, disabled, placeholder }) => (
  <div>
    <FieldLabel tip={tip}>{label}</FieldLabel>
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="text-sm min-h-[64px]"
      disabled={disabled}
      placeholder={placeholder}
    />
  </div>
);

export function SelectField<T extends string>({
  label,
  value,
  onChange,
  options,
  tip,
  disabled,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: readonly { value: T; label: string }[];
  tip?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <FieldLabel tip={tip}>{label}</FieldLabel>
      <Select value={value} onValueChange={(v) => onChange(v as T)} disabled={disabled}>
        <SelectTrigger className="h-9 text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value} className="text-sm">
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export const CheckField: React.FC<{
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}> = ({ label, checked, onChange, disabled }) => (
  <label className="flex items-center gap-2 text-[11px] text-muted-foreground cursor-pointer select-none">
    <Checkbox
      checked={checked}
      onCheckedChange={(v) => onChange(Boolean(v))}
      disabled={disabled}
    />
    {label}
  </label>
);

export const TermPicker: React.FC<{
  value: number;
  onChange: (n: number) => void;
  disabled?: boolean;
}> = ({ value, onChange, disabled }) => (
  <div>
    <FieldLabel tip="Loan term in months.">Term (months)</FieldLabel>
    <div className="flex flex-wrap gap-1.5">
      {TERM_OPTIONS.map((t) => (
        <button
          key={t}
          type="button"
          disabled={disabled}
          onClick={() => onChange(t)}
          className={cn(
            "h-8 px-3 rounded-sm border text-xs tabular-nums transition-colors",
            value === t
              ? "border-foreground bg-foreground text-background"
              : "border-border text-muted-foreground hover:border-foreground/40"
          )}
        >
          {t}
        </button>
      ))}
    </div>
  </div>
);
