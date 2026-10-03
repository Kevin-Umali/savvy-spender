import Link from "next/link";
import {
  Body,
  DataTable,
  DocSection,
  Divider,
  SectionLabel,
  SectionTitle,
} from "./section-primitives";

export function SecuredLoansSection() {
  return (
    <>
      <DocSection>
        <SectionLabel>Loans · quote-dependent</SectionLabel>
        <SectionTitle>Car Loans (Auto Financing)</SectionTitle>
        <Body>
          Interest methods and collateral charges vary by lender and offer. Do
          not assume every auto loan uses the same flat rate or a universal
          mortgage-fee percentage.
        </Body>
        <DataTable
          headers={["Compare", "Include in the quote"]}
          rows={[
            [
              "Purchase price",
              "Cash discounts, reservation credit, accessories, and dealer charges",
            ],
            [
              "Financing",
              "Principal, down payment, term, rate method, quoted monthly, and payment timing",
            ],
            [
              "Other costs",
              "Mortgage/security charges, insurance, registration, and recurring fees",
            ],
            [
              "Included or waived fees",
              "Avoid counting a fee twice when already included in a quoted amount",
            ],
          ]}
        />
        <Link href="/loan-compare" className="text-xs underline">
          Compare complete financing offers →
        </Link>
      </DocSection>
      <Divider />
      <DocSection>
        <SectionLabel>Loans · fixing and repricing matter</SectionLabel>
        <SectionTitle>Housing Loans (Private Banks)</SectionTitle>
        <Body>
          Obtain a dated offer showing the interest rate, fixed-rate period,
          repricing method, term, fees, insurance, and required down payment. A
          promotional rate is not necessarily fixed for the full loan term.
        </Body>
        <Body>
          Rent vs. Buy holds your chosen mortgage rate constant to explore
          scenarios. Run several plausible rates; it does not forecast future
          repricing or establish loan eligibility.
        </Body>
        <Link href="/rent-vs-buy" className="text-xs underline">
          Explore constant-rate rent-versus-buy scenarios →
        </Link>
      </DocSection>
    </>
  );
}
