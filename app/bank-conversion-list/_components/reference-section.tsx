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

      <Divider />

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
        <Body>Source: BSP Circular No. 1098 (2020), updated by Circular No. 1165 (2023).</Body>
      </DocSection>
    </>
  );
}
