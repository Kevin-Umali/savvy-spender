"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FINANCING_META, PAYMENT_TYPE_OPTIONS } from "../_lib/options";
import type { BankInput } from "../_lib/types";
import { FeesGroup, FieldLabel, NumField, TermPicker, TextField } from "./form-controls";
import { OptionShell } from "./option-shell";
import { PromoNotes } from "./promo-notes";

export function BankSection({
  input,
  onChange,
  disabled,
}: {
  input: BankInput;
  onChange: <K extends keyof BankInput>(field: K, value: BankInput[K]) => void;
  disabled?: boolean;
}) {
  return (
    <OptionShell meta={FINANCING_META.bank}>
      <TextField
        label="Bank name"
        value={input.bankName}
        onChange={(v) => onChange("bankName", v)}
        placeholder="e.g. BPI, BDO"
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
          tip="Balance financed. Normally equals discounted price minus down payment."
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
        tip="Bank's quoted monthly payment. Use the OMA value if payment type is OMA, arrears value otherwise."
      />
      <div>
        <FieldLabel tip="OMA collects month 1 at signing. Arrears bills month 1 after release.">
          Payment type
        </FieldLabel>
        <Select
          value={input.paymentType}
          onValueChange={(v) => onChange("paymentType", v as BankInput["paymentType"])}
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
        <NumField label="Bank fees" value={input.bankFees} onChange={(n) => onChange("bankFees", n)} disabled={disabled} />
        <NumField label="Documentary stamp tax" value={input.docStampTax} onChange={(n) => onChange("docStampTax", n)} disabled={disabled} />
        <NumField label="Notarial fee" value={input.notarial} onChange={(n) => onChange("notarial", n)} disabled={disabled} />
        <NumField label="LTO encumbrance" value={input.ltoEncumbrance} onChange={(n) => onChange("ltoEncumbrance", n)} disabled={disabled} />
        <NumField label="Registration" value={input.registration} onChange={(n) => onChange("registration", n)} disabled={disabled} />
        <NumField label="Comprehensive insurance" value={input.comprehensiveInsurance} onChange={(n) => onChange("comprehensiveInsurance", n)} disabled={disabled} />
        <NumField label="CTPL" value={input.ctpl} onChange={(n) => onChange("ctpl", n)} disabled={disabled} />
        <NumField label="Other fees" value={input.otherFees} onChange={(n) => onChange("otherFees", n)} disabled={disabled} />
      </FeesGroup>

      <PromoNotes value={input.promoNotes} onChange={(v) => onChange("promoNotes", v)} disabled={disabled} />
    </OptionShell>
  );
}
