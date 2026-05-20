"use client";

import { FINANCING_META } from "../_lib/options";
import type { C2cInput } from "../_lib/types";
import { FeesGroup, NumField, TermPicker, TextField } from "./form-controls";
import { OptionShell } from "./option-shell";
import { PromoNotes } from "./promo-notes";

export function C2cSection({
  input,
  onChange,
  disabled,
}: {
  input: C2cInput;
  onChange: <K extends keyof C2cInput>(field: K, value: C2cInput[K]) => void;
  disabled?: boolean;
}) {
  return (
    <OptionShell meta={FINANCING_META.c2c}>
      <TextField
        label="Bank / card provider"
        value={input.providerName}
        onChange={(v) => onChange("providerName", v)}
        placeholder="e.g. BPI Card, Metrobank"
        disabled={disabled}
      />
      <NumField
        label="Loanable amount (₱)"
        value={input.loanableAmount}
        onChange={(n) => onChange("loanableAmount", n)}
        step={1000}
        disabled={disabled}
        tip="Cash the lender will release. If lower than the discounted price, you cover the difference upfront."
      />
      <TermPicker
        value={input.termMonths}
        onChange={(n) => onChange("termMonths", n)}
        disabled={disabled}
      />
      <div className="grid grid-cols-2 gap-3">
        <NumField
          label="Monthly add-on rate (%)"
          value={input.monthlyAddOnRate}
          onChange={(n) => onChange("monthlyAddOnRate", n)}
          step={0.01}
          disabled={disabled}
          tip="Flat rate on the original principal. Not the same as EIR."
        />
        <NumField
          label="EIRPA (%)"
          value={input.eirpa}
          onChange={(n) => onChange("eirpa", n)}
          step={0.01}
          disabled={disabled}
          tip="Effective interest rate per annum. Use this when comparing the true cost across products."
        />
      </div>
      <NumField
        label="Monthly payment override (₱)"
        value={input.monthlyPaymentOverride}
        onChange={(n) => onChange("monthlyPaymentOverride", n)}
        disabled={disabled}
        tip="Optional. If your bank quotes a fixed monthly, enter it here and it'll be used instead of the add-on-rate formula."
      />

      <FeesGroup title="Fees (enter 0 if free)">
        <NumField label="Processing fee" value={input.processingFee} onChange={(n) => onChange("processingFee", n)} disabled={disabled} />
        <NumField label="Registration" value={input.registration} onChange={(n) => onChange("registration", n)} disabled={disabled} />
        <NumField label="Comprehensive insurance" value={input.comprehensiveInsurance} onChange={(n) => onChange("comprehensiveInsurance", n)} disabled={disabled} />
        <NumField label="CTPL" value={input.ctpl} onChange={(n) => onChange("ctpl", n)} disabled={disabled} />
        <NumField label="Other fees" value={input.otherFees} onChange={(n) => onChange("otherFees", n)} disabled={disabled} />
      </FeesGroup>

      <PromoNotes value={input.promoNotes} onChange={(v) => onChange("promoNotes", v)} disabled={disabled} />
    </OptionShell>
  );
}
