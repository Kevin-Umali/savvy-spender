import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Savvy Spender - Documentation",
  description:
    "How each calculator works — inputs, formulas, and what the results mean. Covers the Installment Calculator, Card FX Comparison, and Loan Comparison tools.",
  keywords: [
    "Payment Calculator Documentation",
    "Installment Calculator Documentation",
    "Card FX Comparison Documentation",
    "Loan Comparison Documentation",
    "Balance Conversion Calculator",
    "Credit-to-Cash Calculator",
    "Financial Calculations Philippines",
  ],
  metadataBase: new URL("https://www.savvyspender.info/"),
  applicationName: "Savvy Spender",
  openGraph: {
    type: "website",
    url: "https://www.savvyspender.info/docs",
    title: "Savvy Spender - Documentation",
    description:
      "How each calculator works — inputs, formulas, and what the results mean.",
  },
  twitter: {
    site: "https://www.savvyspender.info/",
    title: "Savvy Spender - Documentation",
    description:
      "How each calculator works — inputs, formulas, and what the results mean.",
  },
  referrer: "no-referrer-when-downgrade",
  formatDetection: { telephone: false },
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-muted-foreground opacity-60 mb-3">
      {children}
    </p>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display italic font-light text-xl tracking-tight mb-3">
      {children}
    </h2>
  );
}

function SubTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-foreground mt-6 mb-2">
      {children}
    </h3>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted-foreground leading-relaxed mb-3">{children}</p>;
}

function Formula({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-xs leading-relaxed border-l-2 border-border pl-4 my-3 text-muted-foreground space-y-0.5">
      {children}
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs text-muted-foreground border border-border rounded px-3 py-2 my-3 leading-relaxed">
      {children}
    </p>
  );
}

function DocSection({ children }: { children: React.ReactNode }) {
  return <div className="space-y-1 pb-10">{children}</div>;
}

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <div className="mb-10">
        <p className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-muted-foreground opacity-60 mb-3">
          Reference
        </p>
        <h1 className="font-display italic font-light text-3xl sm:text-4xl tracking-tight">
          Documentation
        </h1>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          How each calculator works — inputs, formulas, and what the results mean.
        </p>
      </div>
      <div className="h-px bg-border opacity-50 mb-10" />

      {/* ── Installment Calculator ─────────────────────────────────── */}
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

      <div className="h-px bg-border opacity-30 mb-10" />

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

      <div className="h-px bg-border opacity-30 mb-10" />

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

      <div className="h-px bg-border opacity-30 mb-10" />

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

      <div className="h-px bg-border opacity-50 mb-10" />

      {/* ── Card FX Comparison ────────────────────────────────────── */}
      <DocSection>
        <SectionLabel>Card FX Comparison</SectionLabel>
        <SectionTitle>How Foreign Transaction Markups Work</SectionTitle>
        <Body>
          When you pay in a foreign currency, your card issuer converts the amount to PHP using a
          rate marked up above the interbank (wholesale) rate. The all-in cost combines two
          charges: a bank-imposed forex conversion fee and a network cross-border assessment fee
          added by Visa or Mastercard.
        </Body>
        <Formula>
          <div>PHP Cost = Foreign Amount × PHP-per-unit × (1 + fxMarkup / 100)</div>
        </Formula>
        <Body>
          Visa adds ~1% and Mastercard ~0.2–1% as their network assessment. Most banks bundle
          these into a single quoted markup. Cards advertised as &quot;0% forex&quot; waive the
          bank fee — the network assessment may still apply.
        </Body>
      </DocSection>

      <div className="h-px bg-border opacity-30 mb-10" />

      <DocSection>
        <SectionLabel>Card FX Comparison</SectionLabel>
        <SectionTitle>Live Reference Rate</SectionTitle>
        <Body>
          The base PHP-per-unit rate is fetched live from open exchange rate APIs. Three sources
          are tried in order, and the first successful response is used:
        </Body>
        <Formula>
          <div>1. open.er-api.com — returns time_last_update_utc</div>
          <div>2. api.frankfurter.app — returns date</div>
          <div>3. cdn.jsdelivr.net/@fawazahmed0/currency-api — returns date</div>
        </Formula>
        <Body>
          Rates are cached server-side for 1 hour (Next.js revalidation). The sidebar shows
          which source responded and when the rate was last updated. This is a reference rate —
          your actual billing rate may differ slightly from what your bank applies.
        </Body>
      </DocSection>

      <div className="h-px bg-border opacity-50 mb-10" />

      {/* ── Loan Comparison ───────────────────────────────────────── */}
      <DocSection>
        <SectionLabel>Loan Comparison</SectionLabel>
        <SectionTitle>Three Financing Options</SectionTitle>
        <Body>
          The Loan Comparison tool puts three ways to finance a vehicle or asset side by side:
          In-House Financing, Bank Auto Loan, and Credit-to-Cash. All three use the add-on
          (flat-rate) interest method.
        </Body>
        <Formula>
          <div>Loan Amount = Asset Price − Down Payment</div>
          <div>Total Interest = Loan × Monthly Rate × Term Months</div>
          <div>Monthly Payment = (Loan + Total Interest + Fees) / Term Months</div>
        </Formula>
        <Body>
          The effective interest rate (EIR) is computed via Newton-Raphson to find the internal
          rate of return that equates all cash flows to the loan amount received.
        </Body>
      </DocSection>

      <div className="h-px bg-border opacity-30 mb-10" />

      <DocSection>
        <SectionLabel>Loan Comparison</SectionLabel>
        <SectionTitle>In-House Financing</SectionTitle>
        <Body>
          Direct financing from a car dealer or real estate developer. No bank credit check is
          required, making it accessible to buyers who don&apos;t qualify for bank loans. The
          tradeoff is a significantly higher monthly rate (typically 1.5%–2.5% flat per month).
        </Body>
        <Body>
          A down payment is required (typically 20–40%). The chattel mortgage is usually handled
          by the dealer and bundled into the price rather than charged as a separate fee.
        </Body>
      </DocSection>

      <div className="h-px bg-border opacity-30 mb-10" />

      <DocSection>
        <SectionLabel>Loan Comparison</SectionLabel>
        <SectionTitle>Bank Auto Loan</SectionTitle>
        <Body>
          Secured loan from a bank, using the vehicle as collateral. Offers the lowest monthly
          rate among the three options (typically 0.47%–0.98% flat per month), but requires a
          credit check, comprehensive car insurance, and a chattel mortgage registered with the
          LTO.
        </Body>
        <SubTitle>Additional Fees</SubTitle>
        <Formula>
          <div>Chattel Mortgage: registered with LTO, typically ~1–2% of loan amount</div>
          <div>Processing Fee: typically ₱2,000–₱3,500 depending on bank</div>
          <div>Total Cost = Down Payment + Loan + Total Interest + All Fees</div>
        </Formula>
      </DocSection>

      <div className="h-px bg-border opacity-30 mb-10" />

      <DocSection>
        <SectionLabel>Loan Comparison</SectionLabel>
        <SectionTitle>Credit-to-Cash for Vehicle Purchase</SectionTitle>
        <Body>
          Uses available credit card limit as the funding source instead of a traditional loan.
          No down payment, no collateral, and no asset ownership transfer is involved — you
          simply borrow against your existing credit line.
        </Body>
        <Body>
          The BSP caps the monthly add-on rate at 1.00% for credit card installment programs.
          Maximum amount is limited by your available credit limit, which may be less than the
          full vehicle price.
        </Body>
        <Note>
          Because there is no down payment, the full asset price becomes the loan amount — which
          means total interest paid is higher than the bank loan option despite a similar stated
          rate.
        </Note>
      </DocSection>

      <div className="h-px bg-border opacity-50 mb-10" />

      <p className="text-xs text-muted-foreground leading-relaxed">
        All calculations are for reference purposes only. Rates, fees, and regulatory requirements
        change over time. Always verify details directly with the relevant bank or financial
        institution before making any financial decision.
      </p>
    </div>
  );
}
