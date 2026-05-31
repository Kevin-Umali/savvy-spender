import Link from "next/link";
import {
  Body,
  DataTable,
  Divider,
  DocSection,
  SectionLabel,
  SectionTitle,
  SourceNote,
} from "./section-primitives";

export function PersonalLoansSection() {
  return (
    <>
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
            ["RCBC", "~1.30%", "26%–30%", "12–36 months", "₱1,500", "₱1M"],
            ["PSBank", "~1.75%", "Varies", "12–36 months", "₱1,500", "₱2M"],
          ]}
        />
        <Link
          href="/calculator?type=personal-loan&rate=1.25&fee=1500&term=24"
          className="inline-block mt-1 text-[12px] font-medium text-foreground underline underline-offset-4"
        >
          Compute a personal loan in the calculator →
        </Link>
        <SourceNote>
          Sources: Bank-published rate tables and BSP Circular No. 1098. As of 2026.
        </SourceNote>
      </DocSection>

      <Divider />

      <DocSection>
        <SectionLabel>Loans</SectionLabel>
        <SectionTitle>Digital Banks &amp; E-Wallet Loans</SectionTitle>
        <Body>
          Fast, small-ticket loans from digital banks and e-wallets — minimal paperwork, instant
          disbursement. Monthly rates typically run ~1.58%–2.83% (EIR ~19%–34%). Rates are
          personalized from your in-app credit score, so treat these as indicative.
        </Body>
        <DataTable
          headers={["Lender", "Monthly Rate", "Terms", "Fee", "Max Loan"]}
          rows={[
            ["GCash GLoan", "from ~1.59%", "3–12 months", "Disbursement fee", "₱150K"],
            ["Maya (Personal Loan)", "~1.5%–3%", "Varies", "Varies", "₱250K"],
            ["Tonik", "~1.79%–3.46%", "6–24 months", "None", "₱250K"],
            ["UnionDigital", "Personalized", "Varies", "Varies", "Varies"],
            ["GoTyme / UNO / UnionBank Digital", "Personalized", "Varies", "Varies", "Varies"],
          ]}
        />
        <SourceNote>
          Sources: GCash Help Center, Maya, Tonik, and BitPinas digital-bank roundups. As of 2026.
        </SourceNote>
      </DocSection>
    </>
  );
}
