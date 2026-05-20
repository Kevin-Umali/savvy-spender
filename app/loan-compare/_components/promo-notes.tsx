"use client";

import { FieldLabel } from "./form-controls";

export const PromoNotes: React.FC<{
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}> = ({ value, onChange, disabled }) => (
  <div>
    <FieldLabel tip="Free-form notes for freebies, eligibility rules, or anything to remember.">
      Promo / freebies notes
    </FieldLabel>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="e.g. Free chattel mortgage, free first-year insurance, only on 60-mo term."
      disabled={disabled}
      rows={2}
      className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-y"
    />
  </div>
);
