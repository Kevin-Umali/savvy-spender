"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FINANCING_META, PAYMENT_TYPE_OPTIONS } from "../_lib/options";
import type { InHouseInput } from "../_lib/types";
import { FeesGroup, FieldLabel, NumField, TermPicker, TextField } from "./form-controls";
import { OptionShell } from "./option-shell";
import { PromoNotes } from "./promo-notes";

export function InHouseSection({
  input,
  onChange,
  disabled,
}: {
  input: InHouseInput;
  onChange: <K extends keyof InHouseInput>(field: K, value: InHouseInput[K]) => void;
  disabled?: boolean;
}) {
  return (
    <OptionShell meta={FINANCING_META["in-house"]}>
      <TextField
        label="Dealer name"
        value={input.dealerName}
        onChange={(v) => onChange("dealerName", v)}
        placeholder="e.g. Toyota dealer"
        disabled={disabled}
      />
      <div className="grid grid-cols-2 gap-3">
        <NumField
          label="Down payment (₱)"
          value={input.downPayment}
          onChange={(n) => onChange("downPayment", n)}
          step={1000}
          disabled={disabled}
        />
        <NumField
          label="Loan amount (₱)"
          value={input.loanAmount}
          onChange={(n) => onChange("loanAmount", n)}
          step={1000}
          disabled={disabled}
          tip="Balance financed by the dealer."
        />
      </div>
      <TermPicker
        value={input.termMonths}
        onChange={(n) => onChange("termMonths", n)}
        disabled={disabled}
      />
      <NumField
        label="Monthly amortization (₱)"
        value={input.monthlyAmortization}
        onChange={(n) => onChange("monthlyAmortization", n)}
        disabled={disabled}
        tip="Dealer's quoted monthly payment."
      />
      <div>
        <FieldLabel>Payment type</FieldLabel>
        <Select
          value={input.paymentType}
          onValueChange={(v) => onChange("paymentType", v as InHouseInput["paymentType"])}
          disabled={disabled}
        >
          <SelectTrigger className="h-9 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PAYMENT_TYPE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <FeesGroup title="Fees (enter 0 if free)">
        <NumField label="Chattel mortgage" value={input.chattelMortgage} onChange={(n) => onChange("chattelMortgage", n)} disabled={disabled} />
        <NumField label="Processing fee" value={input.processingFee} onChange={(n) => onChange("processingFee", n)} disabled={disabled} />
        <NumField label="Documentation fee" value={input.documentationFee} onChange={(n) => onChange("documentationFee", n)} disabled={disabled} />
        <NumField label="Registration" value={input.registration} onChange={(n) => onChange("registration", n)} disabled={disabled} />
        <NumField label="Comprehensive insurance" value={input.comprehensiveInsurance} onChange={(n) => onChange("comprehensiveInsurance", n)} disabled={disabled} />
        <NumField label="CTPL" value={input.ctpl} onChange={(n) => onChange("ctpl", n)} disabled={disabled} />
        <NumField label="Other dealer charges" value={input.otherFees} onChange={(n) => onChange("otherFees", n)} disabled={disabled} />
      </FeesGroup>

      <PromoNotes value={input.promoNotes} onChange={(v) => onChange("promoNotes", v)} disabled={disabled} />
    </OptionShell>
  );
}
