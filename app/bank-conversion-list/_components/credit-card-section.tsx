import Link from "next/link";
import {
  Body,
  DataTable,
  DocSection,
  Divider,
  SectionLabel,
  SectionTitle,
  SourceNote,
} from "./section-primitives";

export function CreditCardSection() {
  return (
    <>
      <DocSection>
        <SectionLabel>Credit Card · checked October 3, 2026</SectionLabel>
        <SectionTitle>Balance Conversion and Credit-to-Cash</SectionTitle>
        <Body>
          These convert a card balance or available credit into installments.
          The offer’s add-on rate and term are quote-specific; do not assume a
          published example is available to every cardholder.
        </Body>
        <DataTable
          headers={[
            "Issuer / product",
            "Published processing fee",
            "Rate and term",
          ]}
          rows={[
            [
              "BPI Balance Conversion / Credit-to-Cash / Balance Transfer",
              "₱500 up to ₱50,000; ₱700 above ₱50,000 (effective September 17, 2026)",
              "Offer-specific; published add-on up to 1% monthly",
            ],
            [
              "Metrobank Balance Conversion",
              "₱500 per approved installment",
              "Use actual offer",
            ],
            [
              "Metrobank Cash2Go / Balance Transfer",
              "₱350 per approved installment",
              "Use actual offer",
            ],
            [
              "BDO and other issuers",
              "Check current schedule; fees may have changed",
              "Use actual offer and eligible product",
            ],
          ]}
        />
        <SourceNote>
          Official sources:{" "}
          <a
            href="https://www.bpi.com.ph/personal/cards/credit-cards/rates-and-fees"
            className="underline"
          >
            BPI fees
          </a>
          ;{" "}
          <a
            href="https://www.metrobank.com.ph/articles/credit-card-rates-and-fees"
            className="underline"
          >
            Metrobank fees
          </a>
          ;{" "}
          <a
            href="https://www.bdo.com.ph/personal/cards/credit-cards/fees-and-charges-update"
            className="underline"
          >
            BDO fee updates
          </a>
          .
        </SourceNote>
        <Link
          href="/calculator?type=balance-conversion"
          className="text-xs underline"
        >
          Compare a balance-conversion quote →
        </Link>
        <Body>
          <Link href="/calculator?type=credit-to-cash" className="underline">
            Compare credit-to-cash →
          </Link>
        </Body>
      </DocSection>
      <Divider />
      <DocSection>
        <SectionLabel>Credit Card · merchant-specific</SectionLabel>
        <SectionTitle>0% Installment Programs</SectionTitle>
        <Body>
          A 0% interest offer can still cost more than the cash price. Confirm
          the merchant’s total price, eligible card, term, minimum purchase, and
          any fees. Enter the actual merchant total in the installment
          calculator to compare it with bank conversion.
        </Body>
      </DocSection>
    </>
  );
}
