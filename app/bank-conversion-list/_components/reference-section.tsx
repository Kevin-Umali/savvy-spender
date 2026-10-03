import {
  Body,
  DataTable,
  DocSection,
  Divider,
  SectionLabel,
  SectionTitle,
} from "./section-primitives";

export function ReferenceSection() {
  return (
    <>
      <DocSection>
        <SectionLabel>Reference</SectionLabel>
        <SectionTitle>Philippine Loan Rate Overview</SectionTitle>
        <Body>
          A quick comparison of typical rates and interest methods across major
          product types.
        </Body>
        <DataTable
          headers={[
            "Product Type",
            "Interest Method",
            "Rate source",
            "Effective cost",
          ]}
          rows={[
            [
              "Credit card revolving",
              "Average daily balance / issuer terms",
              "Issuer schedule",
              "Depends on billing and payments",
            ],
            [
              "CC balance conversion",
              "Usually add-on (flat)",
              "Actual offer",
              "Solve cash flows including fees",
            ],
            [
              "Personal / car loan",
              "Offer-specific",
              "Actual offer",
              "Do not annualize add-on simply ×12",
            ],
            [
              "SSS salary loan",
              "Diminishing balance",
              "8% / 10% p.a.; see current terms",
              "Includes service fee and deductions",
            ],
            [
              "Housing loan",
              "Declining balance",
              "Program and fixing-period specific",
              "Nominal rate is not compounded annual cost",
            ],
          ]}
        />
      </DocSection>

      <Divider />

      <DocSection>
        <SectionLabel>Regulatory</SectionLabel>
        <SectionTitle>BSP Rate Caps</SectionTitle>
        <DataTable
          headers={["Regulation", "Limit"]}
          rows={[
            ["Credit card revolving interest", "3% per month / 36% per annum"],
            [
              "Credit-card installment add-on rate",
              "1% per month maximum (not a blanket cap on all loans)",
            ],
            ["Cash advance processing fee", "₱200 per transaction maximum"],
          ]}
        />
        <Body>
          Source: BSP Circular No. 1098 (2020), updated by Circular No. 1165
          (2023).
        </Body>
      </DocSection>
    </>
  );
}
