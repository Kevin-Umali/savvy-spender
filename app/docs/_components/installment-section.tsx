import {
  Body,
  Divider,
  DocSection,
  Formula,
  Note,
  SectionLabel,
  SectionTitle,
  SubTitle,
} from "./doc-primitives";

export function InstallmentSection() {
  return (
    <>
      <DocSection>
        <SectionLabel>Installment Calculator</SectionLabel>
        <SectionTitle>How Add-On Interest Works</SectionTitle>
        <Body>
          This tool models flat add-on interest charged on the original
          principal. It is not suitable for declining-balance loans such as SSS
          salary loans. Identify the interest method in the actual offer first.
        </Body>
        <Formula>
          <div>Monthly Interest = Principal × Monthly Rate</div>
          <div>Total Interest = Principal × Monthly Rate × Months</div>
          <div>Monthly Payment = (Principal + Total Interest) / Months</div>
        </Formula>
        <Body>
          Annual effective cost is computed from equal monthly cash flows, using
          principal minus upfront fees as the initial benefit, then compounding
          the monthly rate: (1 + monthly rate)^12 − 1. It is not a fixed
          multiple of an add-on rate. Some lender disclosures annualize a
          monthly rate by ×12; that convention differs from the compounded
          annual figure shown here. BSP caps the monthly add-on rate for credit
          card installments at 1.00% per month (Circular No. 1098, updated by
          No. 1165).
        </Body>
      </DocSection>

      <Divider />

      <DocSection>
        <SectionLabel>Installment Calculator</SectionLabel>
        <SectionTitle>Balance Conversion</SectionTitle>
        <Body>
          Converts existing credit card purchases or outstanding balances into
          fixed monthly installments using the add-on interest method. You
          choose a term and the bank applies a flat rate to your balance.
        </Body>
        <SubTitle>Inputs</SubTitle>
        <Body>
          Cash price, monthly add-on rate (%), term, optional 0% installment
          amount, optional processing fee, optional monthly budget.
        </Body>
        <SubTitle>Outputs</SubTitle>
        <Body>
          Monthly payment, total interest, factor rate, effective interest rate
          (EIR), and a side-by-side comparison against any 0% merchant plan you
          enter. If you provide a 0% amount, the calculator uses binary search
          to find the optimal bank principal where the bank&apos;s total stays
          just under the merchant&apos;s total.
        </Body>
      </DocSection>

      <Divider />

      <DocSection>
        <SectionLabel>Installment Calculator</SectionLabel>
        <SectionTitle>Credit-to-Cash</SectionTitle>
        <Body>
          Converts available (unused) credit limit into cash deposited to your
          account. Known as Cash2Go (Metrobank), Ready Cash (Security Bank),
          YourCash (RCBC), or CashLite depending on the bank. The math is
          identical to Balance Conversion — only the context differs.
        </Body>
        <SubTitle>Inputs</SubTitle>
        <Body>
          Cash amount needed, monthly add-on rate (%), term, optional processing
          fee, optional monthly budget.
        </Body>
        <SubTitle>Outputs</SubTitle>
        <Body>
          Monthly payment, total interest, factor rate, and effective interest
          rate (EIR).
        </Body>
        <Body>
          Rates, terms, and fees depend on the actual offer. Enter all upfront
          charges; fees are assumed paid at origination or withheld from
          proceeds for effective-cost calculation.
        </Body>
      </DocSection>

      <Divider />

      <DocSection>
        <SectionLabel>Installment Calculator</SectionLabel>
        <SectionTitle>Personal Loan</SectionTitle>
        <Body>
          Standalone unsecured bank loans, separate from credit cards. The key
          difference is applicable Documentary Stamp Tax (DST), deductions, and
          eligibility for exemptions.
        </Body>
        <SubTitle>Documentary Stamp Tax</SubTitle>
        <Formula>
          <div>DST estimate = loan amount × 0.75% × min(1, months / 12)</div>
          <div>
            Actual short-term tax uses term days / 365; exemption is
            conditional, not automatic
          </div>
          <div>Net Proceeds = Loan − DST − Origination Fee</div>
        </Formula>
        <Note>
          You borrow ₱500K but receive less — and still pay interest on the full
          ₱500K.
        </Note>
      </DocSection>
    </>
  );
}
