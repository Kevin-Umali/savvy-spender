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
        <SectionLabel>Government · checked October 3, 2026</SectionLabel>
        <SectionTitle>SSS Salary Loans</SectionTitle>
        <Body>
          Salary loans use diminishing-balance interest, not flat add-on
          interest. “One-month” and “two-month” refer to the loan amount, not
          the repayment term.
        </Body>
        <DataTable
          headers={["Detail", "Current published terms"]}
          rows={[
            [
              "Interest",
              "8% p.a. for initial loans and qualifying renewals; 10% for renewals with salary-loan penalty condonation within the past five years",
            ],
            [
              "Repayment",
              "24 equal monthly amortizations for both amount tiers",
            ],
            [
              "One-month amount tier",
              "36 posted monthly contributions, including six in the last 12 months",
            ],
            [
              "Two-month amount tier",
              "72 posted monthly contributions, including six in the last 12 months",
            ],
            [
              "Service fee",
              "1% of approved amount; advance prorated interest also deducted",
            ],
          ]}
        />
        <Body>
          Other eligibility rules apply. The installment calculator models flat
          add-on loans and must not be used as an SSS loan quote.
        </Body>
        <SourceNote>
          <a
            href="https://www.sss.gov.ph/salary-loan/"
            className="underline"
            target="_blank"
            rel="noreferrer"
          >
            SSS official salary-loan terms
          </a>
        </SourceNote>
      </DocSection>
      <Divider />
      <DocSection>
        <SectionLabel>Government · program-specific</SectionLabel>
        <SectionTitle>Pag-IBIG Housing Loans</SectionTitle>
        <Body>
          Rates depend on the program, fixing period, property, and applicant. A
          30-year repayment term does not mean the introductory rate is fixed
          for 30 years.
        </Body>
        <DataTable
          headers={["Item", "What to confirm"]}
          rows={[
            [
              "Maximum loan",
              "Expanded to up to ₱10 million in 2026, subject to eligibility, valuation, and capacity to pay",
            ],
            [
              "Repayment term",
              "Up to 30 years, subject to age and other eligibility rules",
            ],
            [
              "2026 promotions",
              "Government announcements describe 4.5% / 5.75% offers for qualifying tiers; verify the current program and fixing period",
            ],
            [
              "After rate fixing",
              "Use the applicable repricing terms; a constant-rate simulation is only a scenario",
            ],
            [
              "Insurance and charges",
              "Obtain MRI, fire insurance, valuation, and other charges from the actual quote",
            ],
            [
              "Acquired assets",
              "Discount, down payment, and interest depend on the specific sale batch and payment mode",
            ],
          ]}
        />
        <SourceNote>
          Sources:{" "}
          <a
            href="https://www.pna.gov.ph/articles/1275989"
            className="underline"
          >
            May 2026 loan-limit announcement
          </a>
          ;{" "}
          <a
            href="https://www.pna.gov.ph/articles/1278932"
            className="underline"
          >
            July 2026 promotional-rate announcement
          </a>
          . Consult{" "}
          <a href="https://www.pagibigfund.gov.ph/" className="underline">
            Pag-IBIG
          </a>{" "}
          for actual eligibility and terms. Announcements are not an individual
          loan quote.
        </SourceNote>
      </DocSection>
    </>
  );
}
