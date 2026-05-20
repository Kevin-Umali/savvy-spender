import {
  Body,
  DataTable,
  DocSection,
  Divider,
  SectionLabel,
  SectionTitle,
  SourceNote,
} from "./section-primitives";

export function GovernmentSection() {
  return (
    <>
      <DocSection>
        <SectionLabel>Government</SectionLabel>
        <SectionTitle>SSS Salary Loans</SectionTitle>
        <Body>
          For SSS members with at least 36 months of posted contributions. Interest is charged
          using the add-on (flat) method on the original loan principal.
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

      <Divider />

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
    </>
  );
}
