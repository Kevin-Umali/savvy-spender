"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CheckField, SectionLabel, SelectField } from "./form-controls";
import {
  COMPARISON_SCOPE_OPTIONS,
  PRIORITY_OPTIONS,
  type ComparisonScope,
  type Priority,
} from "../_lib/options";

export const CompareSettings: React.FC<{
  scope: ComparisonScope;
  setScope: (s: ComparisonScope) => void;
  priority: Priority;
  setPriority: (p: Priority) => void;
  fullTerm: boolean;
  setFullTerm: (v: boolean) => void;
  disabled?: boolean;
}> = ({ scope, setScope, priority, setPriority, fullTerm, setFullTerm, disabled }) => (
  <Card className="border-border">
    <CardHeader className="pb-3 space-y-1">
      <SectionLabel>Comparison settings</SectionLabel>
      <p className="text-[11px] text-muted-foreground leading-snug">
        Choose the lens for ranking and which priority decides the recommendation.
      </p>
    </CardHeader>
    <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
      <SelectField
        label="Comparison scope"
        value={scope}
        onChange={setScope}
        options={COMPARISON_SCOPE_OPTIONS}
        tip="Loan-only compares financing alone; full purchase includes down payment, fees, insurance and registration."
        disabled={disabled}
      />
      <SelectField
        label="Priority"
        value={priority}
        onChange={setPriority}
        options={PRIORITY_OPTIONS}
        disabled={disabled}
      />
      <div className="pb-1.5">
        <CheckField
          label="Include yearly insurance for the full term"
          checked={fullTerm}
          onChange={setFullTerm}
          disabled={disabled}
        />
      </div>
    </CardContent>
  </Card>
);
