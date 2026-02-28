import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Savvy Spender - Payment Calculator Documentation",
  description:
    "Learn how payment calculations work with Savvy Spender's Payment Calculator Documentation. Understand the details behind calculating payments and comparing options.",
  keywords: [
    "Payment Calculator Documentation",
    "Calculating Payments",
    "Payment Calculation Explained",
    "Payment Comparison Documentation",
    "Financial Calculations",
  ],
  metadataBase: new URL("https://www.savvyspendercalculator.com/"),
  applicationName: "Savvy Spender Calculator",
  openGraph: {
    type: "website",
    url: "https://www.savvyspendercalculator.com/",
    title: "Savvy Spender - Payment Calculator Documentation",
    description:
      "Learn how payment calculations work with Savvy Spender's Payment Calculator Documentation. Understand the details behind calculating payments and comparing options.",
  },
  twitter: {
    site: "https://www.savvyspendercalculator.com/",
    title: "Savvy Spender - Payment Calculator Documentation",
    description:
      "Learn how payment calculations work with Savvy Spender's Payment Calculator Documentation. Understand the details behind calculating payments and comparing options.",
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

      {/* Installment & Credit Card */}
      <DocSection>
        <SectionLabel>Installment &amp; Credit Card</SectionLabel>
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
        <SectionLabel>Installment &amp; Credit Card</SectionLabel>
        <SectionTitle>Balance Conversion</SectionTitle>
        <Body>
          Converts existing credit card purchases into fixed monthly installments. You choose a term
          and the bank applies an add-on rate to your balance.
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
        <SectionLabel>Installment &amp; Credit Card</SectionLabel>
        <SectionTitle>Credit-to-Cash</SectionTitle>
        <Body>
          Converts available (unused) credit limit into cash deposited to your account. Known as
          Cash2Go (Metrobank), Ready Cash (Security Bank), YourCash (RCBC), or CashLite depending
          on the bank. The math is identical to Balance Conversion — only the context differs.
        </Body>
        <Body>
          Typical rates: 0.49%–1.00% monthly add-on. Terms up to 60 months. Processing fee
          ₱250–₱500 per availment.
        </Body>
      </DocSection>

      <div className="h-px bg-border opacity-30 mb-10" />

      <DocSection>
        <SectionLabel>Installment &amp; Credit Card</SectionLabel>
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

      {/* Loan Calculators */}
      <DocSection>
        <SectionLabel>Loans</SectionLabel>
        <SectionTitle>Affordability Calculator</SectionTitle>
        <Body>
          Reverses the standard loan formula: instead of computing the payment from a loan amount,
          it finds the maximum loan amount from a monthly budget.
        </Body>
        <Formula>
          <div>factor = 1 + (monthlyRate × months)</div>
          <div>maxPrincipal = (monthlyBudget × months − fee) / factor</div>
        </Formula>
        <Body>
          Results appear across multiple terms simultaneously, showing how much more or less you can
          borrow at each length.
        </Body>
      </DocSection>

      <div className="h-px bg-border opacity-30 mb-10" />

      <DocSection>
        <SectionLabel>Loans</SectionLabel>
        <SectionTitle>Loan Comparison</SectionTitle>
        <Body>
          Puts two bank loan offers side by side across the same set of terms. Compares monthly
          payment, total interest, total cost including processing fee, savings between the two, and
          winner at each term. Use this when you have competing offers and want to see the true
          difference over time.
        </Body>
      </DocSection>

      <div className="h-px bg-border opacity-30 mb-10" />

      <DocSection>
        <SectionLabel>Loans</SectionLabel>
        <SectionTitle>Early Payoff Calculator</SectionTitle>
        <Body>
          Shows the effect of adding extra monthly payments on top of your regular installment. With
          add-on interest, extra payments reduce the number of months remaining — which reduces total
          interest paid.
        </Body>
        <Formula>
          <div>newMonthly = originalMonthly + extraPayment</div>
          <div>newMonths = (principal + fee) / (newMonthly − principal × rate)</div>
          <div>interestSaved = principal × rate × (originalMonths − newMonths)</div>
        </Formula>
      </DocSection>

      <div className="h-px bg-border opacity-30 mb-10" />

      <DocSection>
        <SectionLabel>Loans</SectionLabel>
        <SectionTitle>In-House Loan Calculator</SectionTitle>
        <Body>
          For developer or dealer direct financing. Handles the distinct structure: a percentage
          down payment, a loan amount on the remainder, flat-rate monthly payments, and an optional
          balloon payment due at the end of term.
        </Body>
        <Body>
          Common for real estate developers and vehicle dealers offering their own financing, often
          with higher rates but more flexible credit requirements.
        </Body>
      </DocSection>

      <div className="h-px bg-border opacity-30 mb-10" />

      <DocSection>
        <SectionLabel>Loans</SectionLabel>
        <SectionTitle>SSS Salary Loan</SectionTitle>
        <Body>
          Computes SSS (Social Security System) salary loan amortization. The SSS charges 10% per
          annum on the original principal (add-on / flat method), standard term is 24 months.
        </Body>
        <Formula>
          <div>monthlyRate = 10% / 12</div>
          <div>totalInterest = loanAmount × monthlyRate × termMonths</div>
          <div>monthlyAmortization = (loanAmount + totalInterest) / termMonths</div>
        </Formula>
        <Body>
          The effective rate is higher than 10% p.a. because interest is calculated on the full
          principal throughout the term, not on the declining balance.
        </Body>
      </DocSection>

      <div className="h-px bg-border opacity-30 mb-10" />

      <DocSection>
        <SectionLabel>Loans</SectionLabel>
        <SectionTitle>Pag-IBIG Housing Loan</SectionTitle>
        <Body>
          Unlike most Philippine installment products, Pag-IBIG housing loans use declining balance
          amortization — you pay less interest over time as your principal is paid down.
        </Body>
        <Formula>
          <div>PMT = P × [r(1+r)^n] / [(1+r)^n − 1]</div>
          <div>where P = principal, r = monthly rate, n = total months</div>
        </Formula>
        <Body>
          Additional monthly costs include MRI (Mortgage Redemption Insurance, ~0.25% of loan
          annually) and fire insurance (~0.10% annually). Rates as of 2024: loans ≤ ₱750K start at
          3% for the first 5 years; loans above ₱750K up to ₱6M are at 6.375% fixed.
        </Body>
      </DocSection>

      <div className="h-px bg-border opacity-30 mb-10" />

      <DocSection>
        <SectionLabel>Loans</SectionLabel>
        <SectionTitle>Car Loan Calculator</SectionTitle>
        <Body>
          Philippine auto loans use add-on (flat) interest. All bank-financed vehicles require a
          chattel mortgage registered with the LTO — typically 1–2% of the loan amount added to the
          total cost.
        </Body>
        <Formula>
          <div>loan = vehiclePrice − downPayment</div>
          <div>interest = loan × rate × months</div>
          <div>monthlyPayment = (loan + interest) / months</div>
        </Formula>
        <Body>Typical down payment: 20–30% of vehicle price.</Body>
      </DocSection>

      <div className="h-px bg-border opacity-50 mb-10" />

      {/* Credit & Rates */}
      <DocSection>
        <SectionLabel>Credit &amp; Rates</SectionLabel>
        <SectionTitle>Interest Rate Converter</SectionTitle>
        <Body>
          Converts between flat (add-on) rates and effective interest rates (EIR). Philippine banks
          advertise add-on rates — the true cost is always higher.
        </Body>
        <Body>
          Typical conversions: 0.99%/month flat ≈ 21–23% EIR p.a. — 1.25%/month flat ≈ 27–29%
          EIR p.a. Outputs flat rate, total interest %, EIR monthly and annual, and factor rate.
        </Body>
      </DocSection>

      <div className="h-px bg-border opacity-30 mb-10" />

      <DocSection>
        <SectionLabel>Credit &amp; Rates</SectionLabel>
        <SectionTitle>Break-Even Analyzer</SectionTitle>
        <Body>
          Finds the term at which a bank installment plan becomes cheaper than a merchant&apos;s 0%
          plan. Merchant 0% plans typically have a marked-up total price. At shorter terms the bank
          may cost less; as months increase, accumulated interest may push the bank plan past the
          merchant price. A chart shows the exact crossover point.
        </Body>
      </DocSection>

      <div className="h-px bg-border opacity-30 mb-10" />

      <DocSection>
        <SectionLabel>Credit &amp; Rates</SectionLabel>
        <SectionTitle>Credit Card Payoff</SectionTitle>
        <Body>
          Compares minimum payments vs. a fixed higher payment for clearing an existing credit card
          balance. With minimum payments, as your balance drops your payment drops too — making it
          very slow to clear. A fixed payment stays effective throughout.
        </Body>
        <Note>
          Credit cards use declining balance interest (charged on remaining balance each month),
          unlike installment loans which use add-on / flat rates. Typical PH credit card rate:
          24–36% p.a.
        </Note>
      </DocSection>

      <div className="h-px bg-border opacity-50 mb-10" />

      {/* Income & Tax */}
      <DocSection>
        <SectionLabel>Income &amp; Tax</SectionLabel>
        <SectionTitle>Salary Calculator</SectionTitle>
        <Body>
          Computes net monthly take-home pay after all mandatory deductions under 2024 Philippine
          contribution tables and the TRAIN law.
        </Body>
        <SubTitle>Deduction order</SubTitle>
        <Formula>
          <div>1. SSS — 4.5% of MSC (max MSC ₱30,000)</div>
          <div>2. PhilHealth — 2.5% of salary (floor ₱10K, ceiling ₱100K)</div>
          <div>3. Pag-IBIG — 2% up to ₱10,000 base (max ₱200)</div>
          <div>4. Taxable Income = Gross − Total Contributions</div>
          <div>5. Withholding Tax — TRAIN law graduated brackets</div>
        </Formula>
        <SubTitle>TRAIN Law Brackets (Annual)</SubTitle>
        <div className="border border-border rounded text-xs font-mono overflow-x-auto my-3">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-3 py-2 font-mono-label text-[10px] uppercase tracking-[0.1em]">Annual Income</th>
                <th className="text-left px-3 py-2 font-mono-label text-[10px] uppercase tracking-[0.1em]">Tax</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-muted-foreground">
              <tr><td className="px-3 py-1.5">≤ ₱250,000</td><td className="px-3 py-1.5">0% (exempt)</td></tr>
              <tr><td className="px-3 py-1.5">₱250K–₱400K</td><td className="px-3 py-1.5">15% of excess over ₱250K</td></tr>
              <tr><td className="px-3 py-1.5">₱400K–₱800K</td><td className="px-3 py-1.5">₱22,500 + 20% of excess</td></tr>
              <tr><td className="px-3 py-1.5">₱800K–₱2M</td><td className="px-3 py-1.5">₱102,500 + 25% of excess</td></tr>
              <tr><td className="px-3 py-1.5">₱2M–₱8M</td><td className="px-3 py-1.5">₱402,500 + 30% of excess</td></tr>
              <tr><td className="px-3 py-1.5">Over ₱8M</td><td className="px-3 py-1.5">₱2,202,500 + 35% of excess</td></tr>
            </tbody>
          </table>
        </div>
      </DocSection>

      <div className="h-px bg-border opacity-30 mb-10" />

      <DocSection>
        <SectionLabel>Income &amp; Tax</SectionLabel>
        <SectionTitle>Tax Calculator</SectionTitle>
        <Body>
          Computes income tax for both employed and self-employed / freelancers. Freelancers can
          compare two methods: the standard graduated brackets, or the 8% flat rate on gross income
          exceeding ₱250,000. The 8% flat rate is generally better for freelancers earning under
          ~₱3M per year. The calculator compares both and recommends the lower option.
        </Body>
      </DocSection>

      <div className="h-px bg-border opacity-50 mb-10" />

      {/* Planning & Savings */}
      <DocSection>
        <SectionLabel>Planning &amp; Savings</SectionLabel>
        <SectionTitle>Debt Snowball / Avalanche Planner</SectionTitle>
        <Body>
          For managing multiple debts simultaneously. Compares two proven payoff strategies:
          Snowball (smallest balance first — quick wins keep motivation high) and Avalanche (highest
          interest rate first — saves the most money overall).
        </Body>
        <Body>
          Enter each debt&apos;s name, balance, monthly rate, and minimum payment, plus your total
          extra monthly payment capacity. Outputs: months to debt freedom, total interest paid,
          payoff order, and a month-by-month schedule.
        </Body>
      </DocSection>

      <div className="h-px bg-border opacity-30 mb-10" />

      <DocSection>
        <SectionLabel>Planning &amp; Savings</SectionLabel>
        <SectionTitle>Savings Goal Calculator</SectionTitle>
        <Body>
          Calculates the monthly deposit needed to reach a savings target, with optional compound
          interest.
        </Body>
        <Formula>
          <div>With interest: PMT = Target × r / [(1+r)^n − 1]</div>
          <div>Without interest: PMT = Target / months</div>
        </Formula>
        <Body>Shows milestones at 25%, 50%, 75%, and 100% of goal.</Body>
      </DocSection>

      <div className="h-px bg-border opacity-30 mb-10" />

      <DocSection>
        <SectionLabel>Planning &amp; Savings</SectionLabel>
        <SectionTitle>Retirement Calculator</SectionTitle>
        <Body>
          Projects whether your current savings rate will cover retirement expenses. Computes your
          projected fund (current savings + contributions + returns) against the target fund needed
          to fund monthly withdrawals throughout retirement (present value of annuity formula). If
          there is a gap, shows how much additional monthly savings would close it.
        </Body>
      </DocSection>

      <div className="h-px bg-border opacity-30 mb-10" />

      <DocSection>
        <SectionLabel>Planning &amp; Savings</SectionLabel>
        <SectionTitle>Emergency Fund Calculator</SectionTitle>
        <Body>
          Determines your target emergency fund based on monthly expenses and risk profile, then
          tracks your progress toward it.
        </Body>
        <div className="border border-border rounded text-xs font-mono overflow-x-auto my-3">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-3 py-2 font-mono-label text-[10px] uppercase tracking-[0.1em]">Situation</th>
                <th className="text-left px-3 py-2 font-mono-label text-[10px] uppercase tracking-[0.1em]">Recommended</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-muted-foreground">
              <tr><td className="px-3 py-1.5">Stable job, no dependents</td><td className="px-3 py-1.5">3 months</td></tr>
              <tr><td className="px-3 py-1.5">Average risk</td><td className="px-3 py-1.5">6 months</td></tr>
              <tr><td className="px-3 py-1.5">Self-employed / variable income</td><td className="px-3 py-1.5">9–12 months</td></tr>
            </tbody>
          </table>
        </div>
      </DocSection>

      <div className="h-px bg-border opacity-30 mb-10" />

      <DocSection>
        <SectionLabel>Planning &amp; Savings</SectionLabel>
        <SectionTitle>Remittance Calculator</SectionTitle>
        <Body>
          For OFWs sending money home. Shows the effective exchange rate — the combined impact of
          the posted exchange rate and the transfer fee, expressed as a single comparable number.
        </Body>
        <Formula>
          <div>receiveAmount = sendAmount × exchangeRate</div>
          <div>effectiveRate = receiveAmount / (sendAmount + fee)</div>
        </Formula>
        <Body>
          Use this to compare remittance services. A high exchange rate can be offset by a high fee,
          and vice versa. The effective rate captures both.
        </Body>
      </DocSection>

      <div className="h-px bg-border opacity-30 mb-10" />

      <DocSection>
        <SectionLabel>Planning &amp; Savings</SectionLabel>
        <SectionTitle>Investment Returns Calculator</SectionTitle>
        <Body>
          Projects investment growth with compound returns and regular monthly contributions.
          Applies the Philippine 20% final withholding tax on gains.
        </Body>
        <Formula>
          <div>each month: balance = balance × (1 + monthlyRate) + contribution</div>
        </Formula>
        <Body>
          Outputs: final portfolio value, total contributed, total returns, after-tax returns, and a
          year-by-year breakdown.
        </Body>
      </DocSection>

      <div className="h-px bg-border opacity-50 mb-10" />

      <p className="text-xs text-muted-foreground leading-relaxed">
        All calculations are for reference purposes only. Rates, fees, contribution tables, and
        regulatory requirements change over time. Always verify details directly with the relevant
        government agency, bank, or financial institution before making any financial decision.
      </p>
    </div>
  );
}
