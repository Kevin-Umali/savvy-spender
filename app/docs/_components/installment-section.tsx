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
          Philippine banks charge interest on the original principal for the entire term — not on
          the declining balance. This is the add-on or flat-rate method used across credit card
          installment programs and most unsecured loans.
        </Body>
        <Formula>
          <div>Monthly Interest = Principal × Monthly Rate</div>
          <div>Total Interest = Principal × Monthly Rate × Months</div>
          <div>Monthly Payment = (Principal + Total Interest) / Months</div>
        </Formula>
        <Body>
          The effective interest rate (EIR) is roughly 1.8×–2.0× higher than the stated add-on
          rate. BSP caps the monthly add-on rate for credit card installments at 1.00% per month
          (Circular No. 1098, updated by No. 1165).
        </Body>
      </DocSection>

      <Divider />

      <DocSection>
        <SectionLabel>Installment Calculator</SectionLabel>
        <SectionTitle>Balance Conversion</SectionTitle>
        <Body>
          Converts existing credit card purchases or outstanding balances into fixed monthly
          installments using the add-on interest method. You choose a term and the bank applies a
          flat rate to your balance.
        </Body>
        <SubTitle>Inputs</SubTitle>
        <Body>
          Cash price, monthly add-on rate (%), term, optional 0% installment amount, optional
          processing fee, optional monthly budget.
        </Body>
        <SubTitle>Outputs</SubTitle>
        <Body>
          Monthly payment, total interest, factor rate, effective interest rate (EIR), and a
          side-by-side comparison against any 0% merchant plan you enter. If you provide a 0%
          amount, the calculator uses binary search to find the optimal bank principal where the
          bank&apos;s total stays just under the merchant&apos;s total.
        </Body>
      </DocSection>

      <Divider />

      <DocSection>
        <SectionLabel>Installment Calculator</SectionLabel>
        <SectionTitle>Credit-to-Cash</SectionTitle>
        <Body>
          Converts available (unused) credit limit into cash deposited to your account. Known as
          Cash2Go (Metrobank), Ready Cash (Security Bank), YourCash (RCBC), or CashLite depending
          on the bank. The math is identical to Balance Conversion — only the context differs.
        </Body>
        <SubTitle>Inputs</SubTitle>
        <Body>
          Cash amount needed, monthly add-on rate (%), term, optional processing fee, optional
          monthly budget.
        </Body>
        <SubTitle>Outputs</SubTitle>
        <Body>
          Monthly payment, total interest, factor rate, and effective interest rate (EIR).
        </Body>
        <Body>
          Typical rates: 0.49%–1.00% monthly add-on. Terms up to 60 months. Processing fee
          ₱250–₱500 per availment.
        </Body>
      </DocSection>

      <Divider />

      <DocSection>
        <SectionLabel>Installment Calculator</SectionLabel>
        <SectionTitle>Personal Loan</SectionTitle>
        <Body>
          Standalone unsecured bank loans, separate from credit cards. The key difference is
          Documentary Stamp Tax (DST) on loan amounts above ₱250,000.
        </Body>
        <SubTitle>Documentary Stamp Tax</SubTitle>
        <Formula>
          <div>DST Rate = ₱1.50 per ₱200 of loan face value (~0.75%)</div>
          <div>Exemption: Loans ≤ ₱250,000 for personal use</div>
          <div>Net Proceeds = Loan − DST − Origination Fee</div>
        </Formula>
        <Note>
          You borrow ₱500K but receive less — and still pay interest on the full ₱500K.
        </Note>
      </DocSection>
    </>
  );
}
