"use client";

import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToolHeader } from "@/app/_components/tool-header";
import { CopyLinkButton } from "@/app/_components/copy-link-button";
import { useQueryState } from "@/lib/use-query-state";
import { NumberField } from "./_components/number-field";
import { CODES, DEFAULTS, MODES, computeBid, offerForBudget, monthlyPayment, netPrice, peso, validateInput } from "./_lib/compute";
import type { BidInput } from "./_lib/compute";

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return <Card><CardHeader className="pb-3"><CardTitle className="font-display font-light text-xl">{title}</CardTitle></CardHeader><CardContent className="space-y-4">{children}</CardContent></Card>;
}
function Metric({ label, value, main = false }: { label: string; value: string; main?: boolean }) {
  return <div className={main ? "border bg-muted/30 rounded p-4" : "flex justify-between items-start gap-4 text-sm"}>
    <span className="text-muted-foreground">{label}</span>
    <strong className={main ? "block mt-1 font-display text-3xl tabular-nums font-light" : "text-right tabular-nums font-medium"}>{value}</strong>
  </div>;
}

function BidCalculator() {
  const [input, patch, reset] = useQueryState(DEFAULTS, CODES);
  const error = validateInput(input);
  const result = error ? null : computeBid(input);
  const budget = offerForBudget(input);
  const money = (value: number | undefined) => value === undefined ? "—" : peso(value);
  const field = (key: keyof BidInput, label: string, max?: number, tip?: string) => <NumberField label={label} value={input[key] as number} onChange={(value) => patch({ [key]: value })} max={max} tip={tip} />;
  const selected = MODES.find((m) => m.value === input.mode);

  return <>
    <div className="flex flex-wrap justify-end gap-3 mb-5"><Button variant="outline" size="sm" onClick={reset}>Reset example</Button><CopyLinkButton /></div>
    <p className="text-xs text-muted-foreground border rounded p-3 mb-5 leading-relaxed">
      Starts with your saved example. Discounts and rates are editable assumptions, not an official Pag-IBIG quote. Enter the terms for your property and sale batch. This tool does not determine eligibility or submit a bid.
    </p>
    {error && <p role="alert" className="border border-destructive text-destructive rounded p-3 mb-5 text-sm">{error}</p>}
    <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] gap-6 items-start">
      <section className="space-y-5 min-w-0">
        <Panel title="Your bid">
          <div className="grid sm:grid-cols-2 gap-4">
            {field("minimum", "Minimum gross selling price (₱)", 1e12)}
            {field("bid", "Offer price (₱)", 1e12, "The discount applies to your offer price. The minimum is only used for comparison.")}
          </div>
          {result && <p role="status" className={`text-xs rounded border p-3 ${result.premium < 0 ? "border-destructive text-destructive" : "text-muted-foreground"}`}>
            Your offer is {peso(Math.abs(result.premium))} ({Math.abs(result.premiumPercent).toFixed(2)}%) {result.premium >= 0 ? "above" : "below"} the minimum.
            {result.premium < 0 && " An offer below the minimum may not be accepted."}
          </p>}
        </Panel>
        <Panel title="Payment scenarios">
          <p className="text-xs text-muted-foreground">Select a plan to update the summary. Set each discount to match the property’s terms.</p>
          <div className="space-y-3">
            {MODES.map((mode) => <div key={mode.value} className={`border rounded p-3 grid sm:grid-cols-[1fr_120px_1fr] gap-3 items-center ${input.mode === mode.value ? "bg-accent/40 border-foreground/40" : ""}`}>
              <label className="flex gap-2 items-center text-sm cursor-pointer"><input type="radio" name="payment-mode" checked={input.mode === mode.value} onChange={() => patch({ mode: mode.value })} className="accent-current" />{mode.label}</label>
              {field(mode.discountKey, `${mode.label} discount (%)`, 100)}
              <div className="sm:text-right text-sm tabular-nums"><span className="block text-xs text-muted-foreground">Net price</span>{result ? peso(netPrice(input.bid, input[mode.discountKey])) : "—"}</div>
            </div>)}
          </div>
        </Panel>
        <Panel title="Discount comparisons">
          <div className="grid sm:grid-cols-2 gap-4 items-end">
            {field("customDiscount", "Custom discount (%)", 100)}
            <Metric label="Custom net price" value={result ? peso(netPrice(input.bid, input.customDiscount)) : "—"} />
          </div>
          <details><summary className="text-xs cursor-pointer py-2">Compare discounts from 15% to 30%</summary>
            <div className="overflow-x-auto"><table className="w-full text-xs tabular-nums"><caption className="sr-only">Discounts applied to the offer price</caption><thead><tr className="text-muted-foreground border-b"><th className="text-left py-2">Discount</th><th className="text-right py-2">You save</th><th className="text-right py-2">Net price</th></tr></thead><tbody>
              {Array.from({ length: 16 }, (_, i) => i + 15).map((discount) => <tr key={discount} className="border-b last:border-0"><th scope="row" className="text-left py-2 font-normal">{discount}%</th><td className="text-right">{result ? peso(input.bid * discount / 100) : "—"}</td><td className="text-right font-medium">{result ? peso(netPrice(input.bid, discount)) : "—"}</td></tr>)}
            </tbody></table></div>
          </details>
        </Panel>
      </section>
      <aside className="space-y-5 min-w-0">
        <Panel title={`Selected ${selected?.label.toLowerCase() ?? "payment"} plan`}>
          <Metric label="Offer price" value={result ? peso(input.bid) : "—"} />
          <Metric label={`Discount${result ? ` (${result.discount}%)` : ""}`} value={money(result?.saved)} />
          <Metric label="Net selling price" value={money(result?.net)} main />
          {input.mode !== "cash" ? <>
            <div className="grid sm:grid-cols-2 gap-4">
              {input.mode === "long" ? field("annualRate", "Annual interest rate (%)", 100) : field("shortRate", "Short-term annual interest (%)", 100, "0% assumes equal installments with no interest. Change this if your terms charge interest.")}
              <div className="space-y-1.5"><label id="duration-label" className="text-xs">Term ({input.mode === "long" ? "years" : "months"})</label>
                <Select value={String(input.mode === "long" ? input.years : input.months)} onValueChange={(value) => patch(input.mode === "long" ? { years: Number(value) } : { months: Number(value) })}>
                  <SelectTrigger aria-labelledby="duration-label"><SelectValue /></SelectTrigger><SelectContent>
                    {Array.from({ length: input.mode === "long" ? 30 : 12 }, (_, i) => i + 1).map((n) => <SelectItem key={n} value={String(n)}>{n} {input.mode === "long" ? (n === 1 ? "year" : "years") : (n === 1 ? "month" : "months")}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <fieldset className="space-y-3"><legend className="text-xs mb-2">Enter down payment by</legend>
              <div className="flex gap-5 text-xs">{["percent", "amount"].map((mode) => <label key={mode} className="flex gap-2 items-center cursor-pointer"><input type="radio" name="down-mode" checked={input.downMode === mode} onChange={() => patch(mode === "amount" ? { downMode: mode, downAmount: result?.down ?? 0 } : { downMode: mode, downPercent: result?.net ? result.down / result.net * 100 : 0 })} />{mode === "percent" ? "Percentage" : "Peso amount"}</label>)}</div>
              {input.downMode === "percent" ? field("downPercent", "Down payment (%)", 100) : field("downAmount", "Down payment (₱)", result?.net)}
              <p className="text-xs text-muted-foreground">{result ? `${peso(result.down)} · ${result.net ? (result.down / result.net * 100).toFixed(2) : "0.00"}% of net price` : "—"}</p>
            </fieldset>
            <div className="border-t pt-4 space-y-3">
              <Metric label="Amount financed" value={money(result?.principal)} />
              <Metric label="Estimated monthly payment" value={money(result?.monthly)} main />
              <Metric label="Total installment payments" value={money(result?.totalPayments)} />
              <Metric label="Estimated interest paid" value={money(result?.interest)} />
              <Metric label="Down payment + installments" value={money(result?.totalOutlay)} />
            </div>
          </> : <Metric label="Estimated cash payment" value={money(result?.net)} />}
          {result && <div className="space-y-2 border-t pt-4">
            <p className="text-xs text-muted-foreground">Where your total payment goes</p>
            <div className="flex h-3 overflow-hidden rounded" aria-hidden="true">
              <span className="bg-emerald-600" style={{ width: `${result.totalOutlay ? result.down / result.totalOutlay * 100 : 0}%` }} />
              <span className="bg-sky-600" style={{ width: `${result.totalOutlay ? result.principal / result.totalOutlay * 100 : 0}%` }} />
              <span className="bg-amber-600" style={{ width: `${result.totalOutlay ? result.interest / result.totalOutlay * 100 : 0}%` }} />
            </div>
            <div className="grid gap-1 text-xs">
              <span>Upfront: {peso(result.down)}</span><span>Loan principal: {peso(result.principal)}</span><span>Interest: {peso(result.interest)}</span>
            </div>
          </div>}
          <p className="text-xs text-muted-foreground leading-relaxed">Estimates exclude insurance, taxes, fees, penalties, and other charges. Financing assumes a fixed rate for the full term; repricing can change your payments. Term choices do not confirm eligibility.</p>
        </Panel>
        {input.mode !== "cash" && <Panel title="Check your monthly budget">
          {field("monthlyBudget", "Monthly payment budget (₱)", undefined, "Optional. This budget covers installments only. You still need the upfront payment and excluded charges.")}
          {result && input.monthlyBudget > 0 && <p className="text-xs text-muted-foreground">The selected plan is {result.monthly <= input.monthlyBudget ? "within" : "over"} your budget by {peso(Math.abs(input.monthlyBudget - result.monthly))} per month.</p>}
          {budget ? <><Metric label="Offer at this monthly budget" value={peso(budget.offer)} /><Metric label="Upfront payment for that offer" value={peso(budget.down)} /><p className="text-xs text-muted-foreground">Uses your discount, rate, term, and down payment method. {budget.offer < input.minimum ? "This budget supports an offer below the minimum." : "This is a planning estimate, not loan approval."}</p></> : <p className="text-xs text-muted-foreground">Enter a monthly budget to see the offer it supports. A 100% discount or down payment does not give a meaningful installment-based bid limit.</p>}
        </Panel>}
        <Panel title="Bid comparison">
          <Metric label="Minimum price" value={result ? peso(input.minimum) : "—"} />
          <Metric label="Offer premium" value={money(result?.premium)} />
          <Metric label="Minimum after selected discount" value={money(result?.minimumNet)} />
          <Metric label="Extra net cost vs. minimum" value={money(result?.extraNet)} />
        </Panel>
        {input.mode === "long" && <Panel title="Compare loan terms">
          <div className="overflow-x-auto"><table className="w-full text-xs tabular-nums"><caption className="sr-only">Monthly and total loan payments at the selected interest rate and down payment</caption><thead><tr className="border-b text-muted-foreground"><th className="text-left py-2">Years</th><th className="text-right">Monthly</th><th className="text-right">Total payments</th></tr></thead><tbody>
            {Array.from(new Set([5, 10, 15, 20, 25, 30, input.years])).sort((a, b) => a - b).map((years) => {
              const payment = result ? monthlyPayment(result.principal, input.annualRate, years * 12) : undefined;
              return <tr key={years} className={`border-b last:border-0 ${years === input.years ? "bg-accent/40" : ""}`}><th scope="row" className="text-left font-normal py-2"><button type="button" onClick={() => patch({ years })} className="underline" aria-label={`Use ${years} year term`}>{years}</button></th><td className="text-right">{money(payment)}</td><td className="text-right">{money(payment === undefined ? undefined : payment * years * 12)}</td></tr>;
            })}
          </tbody></table></div>
        </Panel>}
        <p className="text-xs text-muted-foreground"><a href="/docs#pagibig-bid" className="underline">How the calculations work</a> · <a href="https://www.pagibigfund.gov.ph/acquiredassets.html" className="underline" target="_blank" rel="noreferrer">Pag-IBIG acquired assets</a></p>
      </aside>
    </div>
  </>;
}
export default function PagibigBidPage() {
  return <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8"><ToolHeader title="Pag-IBIG Bid & Financing" description="Plan your offer, compare discounts, and estimate payments for an acquired property." /><Suspense fallback={<p className="text-sm py-10 text-muted-foreground">Loading calculator…</p>}><BidCalculator /></Suspense></main>;
}
