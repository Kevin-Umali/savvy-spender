"use client";

import { Copy, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  CheckField,
  NumField,
  SelectField,
  TermPicker,
  TextAreaField,
  TextField,
} from "./form-controls";
import { FeeListEditor } from "./fee-list-editor";
import {
  FINANCING_TYPE_OPTIONS,
  MONTHLY_MODE_OPTIONS,
  PAYMENT_TIMING_OPTIONS,
  VALUE_MODE_OPTIONS,
  CASH_STYLE_TYPES,
  type FinancingType,
  type MonthlyMode,
  type PaymentTiming,
  type ValueMode,
} from "../_lib/options";
import type { FeeItem, FinancingOption, InsuranceInput, RegistrationInput } from "../_lib/types";

export const OptionCard: React.FC<{
  option: FinancingOption;
  index: number;
  showDiscountToggle: boolean;
  canRemove: boolean;
  onChange: (patch: Partial<FinancingOption>) => void;
  onDuplicate: () => void;
  onRemove: () => void;
  disabled?: boolean;
}> = ({ option, index, showDiscountToggle, canRemove, onChange, onDuplicate, onRemove, disabled }) => {
  const isCashStyle = CASH_STYLE_TYPES.includes(option.type);
  const updIns = (patch: Partial<InsuranceInput>) =>
    onChange({ insurance: { ...option.insurance, ...patch } });
  const updReg = (patch: Partial<RegistrationInput>) =>
    onChange({ registration: { ...option.registration, ...patch } });

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-2">
          <div className="flex-1 space-y-2">
            <Input
              value={option.name}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder={`Option ${index + 1} name (e.g. BPI Auto Loan OMA)`}
              className="h-9 text-sm font-medium"
              disabled={disabled}
            />
            <div className="grid grid-cols-2 gap-2">
              <SelectField
                label="Financing type"
                value={option.type}
                onChange={(v: FinancingType) => onChange({ type: v })}
                options={FINANCING_TYPE_OPTIONS}
                disabled={disabled}
              />
              <TextField
                label="Provider"
                value={option.provider}
                onChange={(v) => onChange({ provider: v })}
                placeholder="BPI, Metrobank…"
                disabled={disabled}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1 pt-0.5">
            <button
              type="button"
              onClick={onDuplicate}
              disabled={disabled}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Duplicate option"
            >
              <Copy className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onRemove}
              disabled={disabled || !canRemove}
              className="text-muted-foreground hover:text-destructive disabled:opacity-30"
              aria-label="Remove option"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Loan structure */}
        <div className="grid grid-cols-2 gap-3">
          <NumField
            label="Loan amount (₱)"
            value={option.loanAmount}
            onChange={(v) => onChange({ loanAmount: v })}
            disabled={disabled}
          />
          {!isCashStyle && (
            <NumField
              label="Down payment (₱)"
              value={option.downPayment}
              onChange={(v) => onChange({ downPayment: v })}
              disabled={disabled}
            />
          )}
          <SelectField
            label="Payment timing"
            value={option.paymentTiming}
            onChange={(v: PaymentTiming) => onChange({ paymentTiming: v })}
            options={PAYMENT_TIMING_OPTIONS}
            tip="OMA adds one month's amortization to upfront cash; arrears does not."
            disabled={disabled}
          />
          <div className="col-span-2">
            <TermPicker
              value={option.termMonths}
              onChange={(v) => onChange({ termMonths: v })}
              disabled={disabled}
            />
          </div>
        </div>

        {/* Monthly payment mode + the matching rate input */}
        <div className="grid grid-cols-2 gap-3">
          <SelectField
            label="Monthly payment from"
            value={option.monthlyMode}
            onChange={(v: MonthlyMode) => onChange({ monthlyMode: v })}
            options={MONTHLY_MODE_OPTIONS}
            disabled={disabled}
          />
          {option.monthlyMode === "quoted" && (
            <NumField
              label="Quoted monthly (₱)"
              value={option.quotedMonthly}
              onChange={(v) => onChange({ quotedMonthly: v })}
              disabled={disabled}
            />
          )}
          {option.monthlyMode === "monthly_addon" && (
            <NumField
              label="Monthly add-on rate (%)"
              value={option.monthlyAddOnRate}
              onChange={(v) => onChange({ monthlyAddOnRate: v })}
              step={0.01}
              tip="e.g. 0.49 means 0.49% per month — not 49%."
              disabled={disabled}
            />
          )}
          {option.monthlyMode === "total_addon" && (
            <NumField
              label="Total add-on rate (%)"
              value={option.totalAddOnRate}
              onChange={(v) => onChange({ totalAddOnRate: v })}
              step={0.01}
              tip="The whole-term add-on, e.g. 13.19% for 36 months."
              disabled={disabled}
            />
          )}
          {option.monthlyMode === "annual_effective" && (
            <NumField
              label="Annual effective rate (%)"
              value={option.annualEffectiveRate}
              onChange={(v) => onChange({ annualEffectiveRate: v })}
              step={0.01}
              disabled={disabled}
            />
          )}
          {option.monthlyMode === "annual_nominal" && (
            <NumField
              label="Annual nominal rate (%)"
              value={option.annualNominalRate}
              onChange={(v) => onChange({ annualNominalRate: v })}
              step={0.01}
              disabled={disabled}
            />
          )}
          {option.monthlyMode === "manual_total" && (
            <NumField
              label="Total repayment (₱)"
              value={option.manualTotalRepayment}
              onChange={(v) => onChange({ manualTotalRepayment: v })}
              disabled={disabled}
            />
          )}
          {(option.monthlyMode === "monthly_addon" || option.monthlyMode === "total_addon") && (
            <NumField
              label="EIRPA (%) — reference"
              value={option.annualEffectiveRate}
              onChange={(v) => onChange({ annualEffectiveRate: v })}
              step={0.01}
              tip="Stored and displayed as the effective yearly cost. Not used to compute the monthly payment."
              disabled={disabled}
            />
          )}
        </div>

        {/* Insurance */}
        <div className="rounded-sm border border-border p-2.5 space-y-2 bg-muted/10">
          <SelectField
            label="Insurance"
            value={option.insurance.mode}
            onChange={(v: ValueMode) => updIns({ mode: v })}
            options={VALUE_MODE_OPTIONS}
            disabled={disabled}
          />
          {(option.insurance.mode === "exact" || option.insurance.mode === "estimated") && (
            <>
              <div className="grid grid-cols-3 gap-2">
                <NumField
                  label="Comprehensive"
                  value={option.insurance.comprehensive}
                  onChange={(v) => updIns({ comprehensive: v })}
                  disabled={disabled}
                />
                <NumField
                  label="CTPL"
                  value={option.insurance.ctpl}
                  onChange={(v) => updIns({ ctpl: v })}
                  disabled={disabled}
                />
                <NumField
                  label="Acts of nature"
                  value={option.insurance.actsOfNature}
                  onChange={(v) => updIns({ actsOfNature: v })}
                  disabled={disabled}
                />
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                <CheckField
                  label="Recurring yearly"
                  checked={option.insurance.recurringYearly}
                  onChange={(v) => updIns({ recurringYearly: v })}
                  disabled={disabled}
                />
                <CheckField
                  label="Required by lender"
                  checked={option.insurance.requiredByLender}
                  onChange={(v) => updIns({ requiredByLender: v })}
                  disabled={disabled}
                />
              </div>
            </>
          )}
        </div>

        {/* Registration */}
        <div className="rounded-sm border border-border p-2.5 space-y-2 bg-muted/10">
          <SelectField
            label="Registration"
            value={option.registration.mode}
            onChange={(v: ValueMode) => updReg({ mode: v })}
            options={VALUE_MODE_OPTIONS}
            disabled={disabled}
          />
          {(option.registration.mode === "exact" || option.registration.mode === "estimated") && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <NumField
                  label="LTO registration"
                  value={option.registration.ltoRegistration}
                  onChange={(v) => updReg({ ltoRegistration: v })}
                  disabled={disabled}
                />
                <NumField
                  label="Plate fee"
                  value={option.registration.plateFee}
                  onChange={(v) => updReg({ plateFee: v })}
                  disabled={disabled}
                />
                <NumField
                  label="CTPL"
                  value={option.registration.ctpl}
                  onChange={(v) => updReg({ ctpl: v })}
                  disabled={disabled}
                />
                <NumField
                  label="Other LTO charges"
                  value={option.registration.otherLto}
                  onChange={(v) => updReg({ otherLto: v })}
                  disabled={disabled}
                />
              </div>
              <CheckField
                label="Included in dealer package"
                checked={option.registration.includedInDealerPackage}
                onChange={(v) => updReg({ includedInDealerPackage: v })}
                disabled={disabled}
              />
            </>
          )}
        </div>

        {/* Fees */}
        <FeeListEditor
          fees={option.fees}
          onChange={(fees: FeeItem[]) => onChange({ fees })}
          disabled={disabled}
        />

        {/* Notes + discount opt-in */}
        {showDiscountToggle && (
          <CheckField
            label="This option receives the dealer discount"
            checked={option.receivesDiscount}
            onChange={(v) => onChange({ receivesDiscount: v })}
            disabled={disabled}
          />
        )}
        <TextAreaField
          label="Notes / promo freebies"
          value={option.notes}
          onChange={(v) => onChange({ notes: v })}
          placeholder="Free chattel mortgage, promo only for 60-month term…"
          disabled={disabled}
        />
      </CardContent>
    </Card>
  );
};
