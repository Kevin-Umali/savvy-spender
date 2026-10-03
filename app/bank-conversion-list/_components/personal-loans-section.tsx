import Link from "next/link";
import {
  Body,
  DataTable,
  Divider,
  DocSection,
  SectionLabel,
  SectionTitle,
} from "./section-primitives";

export function PersonalLoansSection() {
  return (
    <>
      <DocSection>
        <SectionLabel>Loans · quote-dependent</SectionLabel>
        <SectionTitle>Personal Loans (Unsecured)</SectionTitle>
        <Body>
          Use the lender’s actual offer rather than a generic bank rate. A
          monthly add-on rate is not the same as a monthly effective rate;
          multiplying an add-on rate by 12 does not give the annual effective
          cost.
        </Body>
        <DataTable
          headers={["Quote field", "Why it matters"]}
          rows={[
            [
              "Interest method",
              "Flat add-on, declining-balance nominal, or effective rate must be identified",
            ],
            [
              "Amount and net proceeds",
              "Fees deducted upfront reduce the cash you actually receive",
            ],
            [
              "Term and payment",
              "Use the exact number of installments and lender's quoted payment",
            ],
            [
              "Fees and taxes",
              "Include origination fees, applicable DST, insurance, and other mandatory charges",
            ],
            [
              "DST estimate",
              "0.75%; terms below one year are prorated by actual days / 365. Exemptions are conditional, not automatic for every loan below ₱250,000",
            ],
          ]}
        />
        <Link
          href="/calculator?type=personal-loan"
          className="text-xs underline"
        >
          Compare a flat add-on personal-loan quote →
        </Link>
        <Body>
          <a
            href="https://www.lawphil.net/statutes/repacts/ra2025/ra_12214_2025.html"
            className="underline"
          >
            RA 12214, Section 21
          </a>{" "}
          supplies the current debt-instrument DST formula. The calculator’s
          month-based short-term tax estimate is not a tax assessment.
        </Body>
      </DocSection>
      <Divider />
      <DocSection>
        <SectionLabel>Loans · personalized offers</SectionLabel>
        <SectionTitle>Digital Banks &amp; E-Wallet Loans</SectionTitle>
        <Body>
          Eligibility, limits, rates, and deductions are personalized. Read the
          in-app disclosure before accepting. No generic “19%–34% EIR” range is
          reliable across products with different interest methods and fees.
        </Body>
        <Body>
          Enter the offer’s monthly add-on rate only if it explicitly uses
          add-on interest. For a quoted payment or another rate method, use the
          flexible financing comparison and itemize all charges.
        </Body>
        <Link href="/loan-compare" className="text-xs underline">
          Compare quoted payments and rate methods →
        </Link>
      </DocSection>
    </>
  );
}
