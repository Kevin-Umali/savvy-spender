"use client";

import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { TERM_OPTIONS } from "../_lib/options";

export const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-muted-foreground opacity-60">
    {children}
  </p>
);

export const FieldLabel: React.FC<{ children: React.ReactNode; tip?: string }> = ({
  children,
  tip,
}) => (
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
  placeholder?: string;
  disabled?: boolean;
}> = ({ label, value, onChange, placeholder, disabled }) => (
  <div>
    <FieldLabel>{label}</FieldLabel>
    <Input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-9 text-sm"
      disabled={disabled}
    />
  </div>
);

export const TermPicker: React.FC<{
  value: number;
  onChange: (n: number) => void;
  disabled?: boolean;
}> = ({ value, onChange, disabled }) => (
  <div>
    <FieldLabel>Loan Term (Months)</FieldLabel>
    <div className="flex flex-wrap gap-1">
      {TERM_OPTIONS.map((t) => (
        <button
          key={t}
          type="button"
          disabled={disabled}
          onClick={() => onChange(t)}
          className={cn(
            "font-mono-label text-[11px] tabular-nums rounded-sm px-2.5 py-1 border transition-colors",
            value === t
              ? "border-foreground bg-foreground text-background"
              : "border-foreground/20 hover:border-foreground/50"
          )}
        >
          {t}
        </button>
      ))}
    </div>
  </div>
);

export const FeesGroup: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="border-t pt-3">
    <SectionLabel>{title}</SectionLabel>
    <div className="mt-2 grid grid-cols-2 gap-2">{children}</div>
  </div>
);
