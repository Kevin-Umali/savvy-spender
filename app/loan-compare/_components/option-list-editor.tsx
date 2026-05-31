"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OptionCard } from "./option-card";
import { SectionLabel } from "./form-controls";
import type { DiscountAppliesTo } from "../_lib/options";
import type { FinancingOption } from "../_lib/types";

export const OptionListEditor: React.FC<{
  options: FinancingOption[];
  discountAppliesTo: DiscountAppliesTo;
  onUpdate: (id: string, patch: Partial<FinancingOption>) => void;
  onDuplicate: (id: string) => void;
  onRemove: (id: string) => void;
  onAdd: () => void;
  disabled?: boolean;
}> = ({ options, discountAppliesTo, onUpdate, onDuplicate, onRemove, onAdd, disabled }) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <SectionLabel>Financing options ({options.length})</SectionLabel>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onAdd}
        disabled={disabled}
        className="gap-1.5 h-8 text-xs"
      >
        <Plus className="h-3.5 w-3.5" />
        Add option
      </Button>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 items-start">
      {options.map((option, i) => (
        <OptionCard
          key={option.id}
          option={option}
          index={i}
          showDiscountToggle={discountAppliesTo === "selected"}
          canRemove={options.length > 1}
          onChange={(patch) => onUpdate(option.id, patch)}
          onDuplicate={() => onDuplicate(option.id)}
          onRemove={() => onRemove(option.id)}
          disabled={disabled}
        />
      ))}
    </div>
  </div>
);
