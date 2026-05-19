import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Savvy Spender - Bank Calculator Documentation",
  description:
    "Philippine financial products reference: credit card installment programs, personal loans, SSS salary loans, Pag-IBIG housing loans, and auto financing rates.",
  keywords: [
    "Payment Calculator Documentation",
    "Calculating Payments",
    "Payment Calculation Explained",
    "Payment Comparison Documentation",
    "Financial Calculations",
    "Balance Conversion Calculator Documentation",
    "Balance Conversion Documentation",
    "Credit-to-Cash Calculator Documentation",
    "Credit-to-Cash Documentation",
    "Loan Calculator Documentation",
    "Loan Documentation",
  ],
  metadataBase: new URL("https://www.savvyspender.info/"),
  applicationName: "Savvy Spender Bank Calculator",
  openGraph: {
    type: "website",
    url: "https://www.savvyspender.info/",
    title: "Savvy Spender - Bank Calculator Documentation",
    description:
      "Philippine financial products reference: credit card installment programs, personal loans, SSS salary loans, Pag-IBIG housing loans, and auto financing rates.",
  },
  twitter: {
    site: "https://www.savvyspender.info/",
    title: "Savvy Spender - Bank Calculator Documentation",
    description:
      "Philippine financial products reference: credit card installment programs, personal loans, SSS salary loans, Pag-IBIG housing loans, and auto financing rates.",
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

function Body({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted-foreground leading-relaxed mb-3">{children}</p>;
}

function DataTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: (string | React.ReactNode)[][];
}) {
  return (
    <div className="border border-border rounded overflow-x-auto my-4">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            {headers.map((h) => (
              <th
                key={h}
                className="text-left px-3 py-2 font-mono-label text-[10px] uppercase tracking-[0.1em] whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-2 text-muted-foreground align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DocSection({ children }: { children: React.ReactNode }) {
  return <div className="space-y-1 pb-10">{children}</div>;
}

function SourceNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] text-muted-foreground/60 mt-1 leading-relaxed">{children}</p>
  );
}

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="mb-10">
        <p className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-muted-foreground opacity-60 mb-3">
          Reference
        </p>
        <h1 className="font-display italic font-light text-3xl sm:text-4xl tracking-tight">
          Financial Products List
        </h1>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          Philippine bank and government financial products — rates, terms, and fees for reference.
          Always verify directly with the institution before making decisions.
        </p>
      </div>
      <div className="h-px bg-border opacity-50 mb-10" />

      {/* Credit Card Installment */}
      <DocSection>
        <SectionLabel>Credit Card</SectionLabel>
        <SectionTitle>Balance Conversion Programs</SectionTitle>
        <Body>
          Converts existing credit card purchases or outstanding balances into fixed monthly
          installments using the add-on (flat) interest method.
        </Body>
        <DataTable
          headers={["Bank", "Product", "Standard Rate", "Terms", "Processing Fee"]}
          rows={[
            ["BPI", "Balance Conversion", "0.99%/month", "6–60 months", "₱300 (≤₱50K) / ₱500 (>₱50K)"],
            ["BDO", "Balance Convert", "~0.88%/month", "Up to 60 months", "₱350"],
            ["Metrobank", "Balance Conversion", "Up to 1.00%/month", "3–60 months", "₱500"],
            ["Security Bank", "BalCon", "Personalized", "3–24 months", "Varies"],
            ["UnionBank", "EasyConvert", "Personalized", "Varies", "Varies"],
            ["HSBC", "Card Balance Conversion", "Up to 1.00%/month", "Up to 24 months", "Varies"],
            ["RCBC", "UNLI Installment", "Up to 1%/month", "Varies", "Varies"],
            ["Eastwest Bank", "Convert-to-Installment (CTI)", "—", "Varies", "—"],
            ["Maybank", "EzyConvert", "—", "Varies", "—"],
            ["PNB", "Transaction Conversion", "—", "Varies", "—"],
          ]}
        />
        <Body>
          Promo rates (as low as 0.49%) are typically invite-only or limited-time.
        </Body>
        <SourceNote>Sources: BSP Circular No. 1098 (2020), No. 1165 (2023), and bank-published fee schedules. As of 2026.</SourceNote>
      </DocSection>

      <div className="h-px bg-border opacity-30 mb-10" />

      <DocSection>
        <SectionLabel>Credit Card</SectionLabel>
        <SectionTitle>Credit-to-Cash Programs</SectionTitle>
        <Body>
          Converts available (unused) credit limit into cash deposited to your bank account.
        </Body>
        <DataTable
          headers={["Bank", "Product", "Standard Rate", "Terms", "Min Amount"]}
          rows={[
            ["BPI", "Credit-to-Cash", "0.99%/month", "6–60 months", "₱3,000"],
            ["Metrobank", "Cash2Go", "Up to 1%/month", "3–60 months", "Varies"],
            ["BDO", "Cash It Easy / Avail Cash Now", "Personalized", "Up to 36 months", "₱10,000"],
            ["Security Bank", "Ready Cash", "Personalized", "3–24 months", "₱10,000"],
            ["RCBC", "YourCash", "Up to 1%/month", "Varies", "₱20,000"],
          ]}
        />
        <Body>Processing fees typically range from ₱250–₱500 per availment.</Body>
        <SourceNote>Sources: Bank-published fee schedules and cardholder agreements. As of 2026.</SourceNote>
      </DocSection>

      <div className="h-px bg-border opacity-30 mb-10" />

      <DocSection>
        <SectionLabel>Credit Card</SectionLabel>
        <SectionTitle>0% Installment Programs</SectionTitle>
        <Body>
          Buy from partner merchants at 0% interest — the merchant subsidizes the cost. The total
          price may be marked up compared to the cash price.
        </Body>
        <DataTable
          headers={["Bank", "Program", "Max Terms", "Min Purchase"]}
          rows={[
            ["BPI", "Real 0% SIP / FlexipayZero", "36 months", "₱3,000"],
            ["BDO", "0% Installment", "24 months", "Varies"],
            ["Metrobank", "0% Installment", "36 months", "Varies"],
            ["HSBC", "Card Instalment Plan (HIP)", "36 months", "Varies"],
            ["RCBC", "Easyterms / Unli 0%", "36 months", "No min (Unli 0%)"],
            ["Security Bank", "ChargeLight", "24 months", "₱5,000"],
            ["EastWest", "0% Installment", "24 months", "₱3,000"],
            ["PNB", "ZAPP", "24 months", "Varies"],
          ]}
        />
        <SourceNote>Sources: Bank-published fee schedules and merchant partner programs. As of 2026.</SourceNote>
      </DocSection>

      <div className="h-px bg-border opacity-50 mb-10" />

      {/* Personal Loans */}
      <DocSection>
        <SectionLabel>Loans</SectionLabel>
        <SectionTitle>Personal Loans (Unsecured)</SectionTitle>
        <Body>
          Standalone bank loans, separate from credit cards. Subject to Documentary Stamp Tax (DST)
          on loan amounts above ₱250,000 (~0.75% of the loan face value, deducted from proceeds).
        </Body>
        <DataTable
          headers={["Bank", "Monthly Rate", "Approx. EIR (p.a.)", "Terms", "Processing Fee", "Max Loan"]}
          rows={[
            ["BDO", "1.39%–1.79%", "18%–24%", "6–36 months", "₱1,300", "₱3M"],
            ["BPI", "~1.20%", "25%–29%", "12–36 months", "₱1,500", "₱3M"],
            ["Metrobank", "~1.25%", "30%–33%", "12–36 months", "₱1,500", "₱2M"],
            ["UnionBank", "Personalized", "Varies", "Varies", "Varies", "₱2M"],
            ["Security Bank", "Personalized", "Varies", "12–36 months", "Varies", "₱2M"],
            ["Tonik", "~1.79%–3.46%", "Varies", "6–24 months", "None", "₱250K"],
          ]}
        />
        <SourceNote>Sources: Bank-published rate tables and BSP Circular No. 1098. As of 2026.</SourceNote>
      </DocSection>

      <div className="h-px bg-border opacity-50 mb-10" />

      {/* SSS */}
      <DocSection>
        <SectionLabel>Government</SectionLabel>
        <SectionTitle>SSS Salary Loans</SectionTitle>
        <Body>
          For SSS members with at least 36 months of posted contributions. Interest is charged using
          the add-on (flat) method on the original loan principal.
        </Body>
        <DataTable
          headers={["Detail", "Rate / Terms"]}
          rows={[
            ["Interest Rate", "10% per annum (flat / add-on)"],
            ["Standard Term", "24 months"],
            ["One-Month Loan", "1× AMSC, 12 months"],
            ["Two-Month Loan", "2× AMSC, 24 months"],
            ["Max Loan", "Up to 2× Average Monthly Salary Credit (AMSC)"],
            ["Application", "Via SSS branch, My.SSS portal, or accredited agents"],
          ]}
        />
        <Body>
          Effective interest rate is higher than the stated 10% p.a. because interest is computed
          on the full original principal, not on the declining balance.
        </Body>
        <SourceNote>Source: SSS.gov.ph official rate schedule. As of 2026.</SourceNote>
      </DocSection>

      <div className="h-px bg-border opacity-30 mb-10" />

      {/* Pag-IBIG */}
      <DocSection>
        <SectionLabel>Government</SectionLabel>
        <SectionTitle>Pag-IBIG (HDMF) Housing Loans</SectionTitle>
        <Body>
          Pag-IBIG housing loans use declining balance amortization — monthly interest decreases as
          the principal is paid down over time.
        </Body>
        <DataTable
          headers={["Loan Amount", "Interest Rate"]}
          rows={[
            ["≤ ₱750,000", "3.00% for first 5 years, 5.375% thereafter"],
            ["₱750K–₱6M", "6.375% fixed for full term"],
          ]}
        />
        <DataTable
          headers={["Additional Cost", "Approximate Rate"]}
          rows={[
            ["MRI (Mortgage Redemption Insurance)", "~0.25% of loan / 12 per month"],
            ["Fire Insurance", "~0.10% of loan / 12 per month"],
          ]}
        />
        <DataTable
          headers={["Detail", "Info"]}
          rows={[
            ["Max Loan", "₱6 million"],
            ["Max Term", "30 years"],
            ["Eligible Members", "Active with ≥ 24 monthly contributions"],
            ["Amortization Formula", "PMT = P × [r(1+r)^n] / [(1+r)^n − 1] (declining balance)"],
          ]}
        />
        <SourceNote>Source: HDMF (Pag-IBIG Fund) official rate table. As of 2026.</SourceNote>
      </DocSection>

      <div className="h-px bg-border opacity-50 mb-10" />

      {/* Car Loans */}
      <DocSection>
        <SectionLabel>Loans</SectionLabel>
        <SectionTitle>Car Loans (Auto Financing)</SectionTitle>
        <Body>
          Philippine auto loans use add-on (flat) interest. All bank-financed vehicles require a
          chattel mortgage registered with the LTO — typically 1–2% of the loan amount added to
          total cost.
        </Body>
        <DataTable
          headers={["Bank", "Monthly Rate", "Down Payment", "Terms", "Chattel Mortgage"]}
          rows={[
            ["BDO", "0.5%–1.2% flat", "20–30%", "12–60 months", "~1.5% of loan"],
            ["BPI", "0.5%–1.2% flat", "20–30%", "12–60 months", "~1.5% of loan"],
            ["Metrobank", "0.5%–1.2% flat", "20–30%", "12–60 months", "~1.5% of loan"],
            ["Security Bank", "Personalized", "20–30%", "12–60 months", "~1.5% of loan"],
            ["UnionBank", "Personalized", "20–30%", "12–60 months", "~1.5% of loan"],
            ["In-house (dealers)", "1.5%–2.5% flat", "20–40%", "12–60 months", "Included"],
          ]}
        />
        <SourceNote>Sources: Bank-published rates and dealer financing disclosures. As of 2026.</SourceNote>
      </DocSection>

      <div className="h-px bg-border opacity-30 mb-10" />

      {/* Housing Loans */}
      <DocSection>
        <SectionLabel>Loans</SectionLabel>
        <SectionTitle>Housing Loans (Private Banks)</SectionTitle>
        <Body>
          Private bank housing loans supplement Pag-IBIG. They use declining balance amortization.
          Rates are typically fixed for 1–5 years, then repriced.
        </Body>
        <DataTable
          headers={["Bank", "Typical Rate", "Max Term", "Max Loan"]}
          rows={[
            ["BDO", "5.5%–7.5% p.a.", "20 years", "₱20M"],
            ["BPI", "5.5%–7.5% p.a.", "20 years", "₱25M"],
            ["Metrobank", "5.5%–7.5% p.a.", "20 years", "₱25M"],
            ["Security Bank", "5.75%–7.75% p.a.", "20 years", "Varies"],
          ]}
        />
        <SourceNote>Sources: Bank-published mortgage rate tables. As of 2026.</SourceNote>
      </DocSection>

      <div className="h-px bg-border opacity-50 mb-10" />

      {/* Rate Reference */}
      <DocSection>
        <SectionLabel>Reference</SectionLabel>
        <SectionTitle>Philippine Loan Rate Overview</SectionTitle>
        <Body>
          A quick comparison of typical rates and interest methods across major product types.
        </Body>
        <DataTable
          headers={["Product Type", "Interest Method", "Typical Rate", "Approx. EIR"]}
          rows={[
            ["Credit card revolving", "Declining balance", "2%/month", "24–36% p.a."],
            ["CC balance conversion", "Add-on (flat)", "0.49%–1.00%/month", "10%–23% p.a."],
            ["Personal loan (bank)", "Add-on (flat)", "1.20%–1.79%/month", "25%–33% p.a."],
            ["SSS salary loan", "Add-on (flat)", "10% p.a. stated", "~18% effective"],
            ["Car loan (bank)", "Add-on (flat)", "0.5%–1.2%/month", "11%–27% p.a."],
            ["Pag-IBIG housing", "Declining balance", "3%–6.375% p.a.", "= stated rate"],
            ["Private bank housing", "Declining balance", "5.5%–7.75% p.a.", "= stated rate"],
          ]}
        />
      </DocSection>

      <div className="h-px bg-border opacity-30 mb-10" />

      <DocSection>
        <SectionLabel>Regulatory</SectionLabel>
        <SectionTitle>BSP Rate Caps</SectionTitle>
        <DataTable
          headers={["Regulation", "Limit"]}
          rows={[
            ["Credit card revolving interest", "3% per month / 36% per annum"],
            ["Installment loan add-on rate", "1% per month maximum"],
            ["Cash advance processing fee", "₱200 per transaction maximum"],
          ]}
        />
        <Body>
          Source: BSP Circular No. 1098 (2020), updated by Circular No. 1165 (2023).
        </Body>
      </DocSection>

      <div className="h-px bg-border opacity-50 mb-10" />

      <p className="text-xs text-muted-foreground leading-relaxed">
        Rates, fees, and terms shown are based on publicly available information and are subject to
        change. Promo rates are often invitation-only or limited-time. Always verify directly with
        the bank or institution before making any financial decision.
      </p>
    </div>
  );
}
