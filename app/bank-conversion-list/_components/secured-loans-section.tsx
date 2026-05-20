import {
  Body,
  DataTable,
  DocSection,
  Divider,
  SectionLabel,
  SectionTitle,
  SourceNote,
} from "./section-primitives";

export function SecuredLoansSection() {
  return (
    <>
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
        <SourceNote>
          Sources: Bank-published rates and dealer financing disclosures. As of 2026.
        </SourceNote>
      </DocSection>

      <Divider />

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
    </>
  );
}
