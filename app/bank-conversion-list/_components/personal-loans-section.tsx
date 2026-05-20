import {
  Body,
  DataTable,
  DocSection,
  SectionLabel,
  SectionTitle,
  SourceNote,
} from "./section-primitives";

export function PersonalLoansSection() {
  return (
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
      <SourceNote>
        Sources: Bank-published rate tables and BSP Circular No. 1098. As of 2026.
      </SourceNote>
    </DocSection>
  );
}
