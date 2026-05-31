"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckField, FieldLabel, SelectField } from "./form-controls";
import { FEE_TIMING_OPTIONS, type FeeTiming } from "../_lib/options";
import { newFee } from "../_lib/defaults";
import type { FeeItem } from "../_lib/types";

const COMMON_FEES = [
  "Chattel mortgage",
  "Bank processing fee",
  "Documentary stamp tax",
  "Notarial fee",
  "LTO encumbrance",
  "Documentation fee",
  "Release fee",
  "GPS tracker",
];

export const FeeListEditor: React.FC<{
  fees: FeeItem[];
  onChange: (fees: FeeItem[]) => void;
  disabled?: boolean;
}> = ({ fees, onChange, disabled }) => {
  const update = (id: string, patch: Partial<FeeItem>) =>
    onChange(fees.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  const remove = (id: string) => onChange(fees.filter((f) => f.id !== id));
  const add = () => onChange([...fees, newFee()]);

  return (
    <div className="space-y-2">
      <FieldLabel tip="Add itemized fees. Flag fees already baked into the quoted monthly or down payment so they are not double-counted.">
        Itemized fees
      </FieldLabel>

      {fees.length === 0 && (
        <p className="text-[11px] text-muted-foreground italic">No fees added.</p>
      )}

      {fees.map((fee) => (
        <div key={fee.id} className="rounded-sm border border-border p-2.5 space-y-2 bg-muted/10">
          <div className="flex items-center gap-2">
            <Input
              list="common-fees"
              value={fee.name}
              onChange={(e) => update(fee.id, { name: e.target.value })}
              placeholder="Fee name"
              className="h-8 text-sm"
              disabled={disabled}
            />
            <Input
              type="number"
              min={0}
              value={fee.amount === 0 ? "" : fee.amount}
              onChange={(e) => update(fee.id, { amount: +e.target.value || 0 })}
              placeholder="₱0"
              className="h-8 text-sm tabular-nums w-28"
              disabled={disabled || fee.waived}
            />
            <button
              type="button"
              onClick={() => remove(fee.id)}
              disabled={disabled}
              className="text-muted-foreground hover:text-destructive shrink-0"
              aria-label="Remove fee"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <SelectField
              label="Applies to"
              value={fee.timing}
              onChange={(v: FeeTiming) => update(fee.id, { timing: v })}
              options={FEE_TIMING_OPTIONS}
              disabled={disabled}
            />
            {fee.waived && (
              <div>
                <FieldLabel>Original value (waived)</FieldLabel>
                <Input
                  type="number"
                  min={0}
                  value={fee.waivedAmount === 0 ? "" : fee.waivedAmount}
                  onChange={(e) => update(fee.id, { waivedAmount: +e.target.value || 0 })}
                  placeholder="₱0"
                  className="h-9 text-sm tabular-nums"
                  disabled={disabled}
                />
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            <CheckField
              label="In quoted monthly"
              checked={fee.includedInMonthly}
              onChange={(v) => update(fee.id, { includedInMonthly: v })}
              disabled={disabled}
            />
            <CheckField
              label="In upfront cash"
              checked={fee.includedInUpfront}
              onChange={(v) => update(fee.id, { includedInUpfront: v })}
              disabled={disabled}
            />
            <CheckField
              label="Waived / free"
              checked={fee.waived}
              onChange={(v) =>
                update(fee.id, {
                  waived: v,
                  waivedAmount: v && fee.waivedAmount === 0 ? fee.amount : fee.waivedAmount,
                })
              }
              disabled={disabled}
            />
          </div>
        </div>
      ))}

      <datalist id="common-fees">
        {COMMON_FEES.map((f) => (
          <option key={f} value={f} />
        ))}
      </datalist>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={add}
        disabled={disabled}
        className="gap-1.5 h-8 text-xs"
      >
        <Plus className="h-3.5 w-3.5" />
        Add fee
      </Button>
    </div>
  );
};
