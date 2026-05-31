"use client";

import type { ChangeEvent, ReactNode } from "react";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { TERM_OPTIONS } from "../_lib/options";

interface LabelProps {
  children: ReactNode;
}

export const SectionLabel: React.FC<LabelProps> = ({ children }) => (
  <p className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-muted-foreground opacity-60">
    {children}
  </p>
);

interface FieldLabelProps {
  children: ReactNode;
  tip?: string;
}

export const FieldLabel: React.FC<FieldLabelProps> = ({ children, tip }) => (
  <Label className="font-mono-label text-[10px] uppercase tracking-[0.18em] text-muted-foreground opacity-70 mb-1 block">
    {children}
    {tip && (
      <Tooltip>
        <TooltipTrigger asChild>
          <InfoCircledIcon className="ml-1 h-3 w-3 inline-block text-muted-foreground cursor-help align-text-bottom" />
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[260px] text-xs font-normal leading-relaxed">
          {tip}
        </TooltipContent>
      </Tooltip>
    )}
  </Label>
);

interface NumFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  tip?: string;
  step?: number;
  disabled?: boolean;
  placeholder?: string;
}

export const NumField: React.FC<NumFieldProps> = ({
  label,
  value,
  onChange,
  tip,
  step = 1,
  disabled,
  placeholder,
}) => (
  <div>
    <FieldLabel tip={tip}>{label}</FieldLabel>
    <Input
      type="number"
      min={0}
      step={step}
      value={value === 0 ? "" : value}
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(+e.target.value || 0)}
      className="tabular-nums h-9 text-sm"
      disabled={disabled}
      placeholder={placeholder ?? "0"}
    />
  </div>
);

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  tip?: string;
  disabled?: boolean;
  placeholder?: string;
}

export const TextField: React.FC<TextFieldProps> = ({
  label,
  value,
  onChange,
  tip,
  disabled,
  placeholder,
}) => (
  <div>
    <FieldLabel tip={tip}>{label}</FieldLabel>
    <Input
      type="text"
      value={value}
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      className="h-9 text-sm"
      disabled={disabled}
      placeholder={placeholder}
    />
  </div>
);

interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  tip?: string;
  disabled?: boolean;
  placeholder?: string;
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  value,
  onChange,
  tip,
  disabled,
  placeholder,
}) => (
  <div>
    <FieldLabel tip={tip}>{label}</FieldLabel>
    <Textarea
      value={value}
      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
      className="text-sm min-h-[64px]"
      disabled={disabled}
      placeholder={placeholder}
    />
  </div>
);

interface SelectOption<T extends string> {
  value: T;
  label: string;
}

interface SelectFieldProps<T extends string> {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: readonly SelectOption<T>[];
  tip?: string;
  disabled?: boolean;
}

export function SelectField<T extends string>({
  label,
  value,
  onChange,
  options,
  tip,
  disabled,
}: SelectFieldProps<T>) {
  return (
    <div>
      <FieldLabel tip={tip}>{label}</FieldLabel>
      <Select value={value} onValueChange={(v) => onChange(v as T)} disabled={disabled}>
        <SelectTrigger className="h-9 text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value} className="text-sm">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

interface CheckFieldProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const CheckField: React.FC<CheckFieldProps> = ({ label, checked, onChange, disabled }) => (
  <label className="flex items-center gap-2 text-[11px] text-muted-foreground cursor-pointer select-none">
    <Checkbox
      checked={checked}
      onCheckedChange={(v) => onChange(Boolean(v))}
      disabled={disabled}
    />
    {label}
  </label>
);

interface TermPickerProps {
  value: number;
  onChange: (months: number) => void;
  disabled?: boolean;
}

export const TermPicker: React.FC<TermPickerProps> = ({ value, onChange, disabled }) => (
  <div>
    <FieldLabel tip="Loan term in months.">Term (months)</FieldLabel>
    <div className="flex flex-wrap gap-1.5">
      {TERM_OPTIONS.map((term) => (
        <button
          key={term}
          type="button"
          disabled={disabled}
          onClick={() => onChange(term)}
          className={cn(
            "h-8 px-3 rounded-sm border text-xs tabular-nums transition-colors",
            value === term
              ? "border-foreground bg-foreground text-background"
              : "border-border text-muted-foreground hover:border-foreground/40"
          )}
        >
          {term}
        </button>
      ))}
    </div>
  </div>
);
