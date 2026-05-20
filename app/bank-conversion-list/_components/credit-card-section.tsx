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
        <SectionLabel>Credit Card</SectionLabel>
        <SectionTitle>Balance Conversion Programs</SectionTitle>
        <Body>
          Converts existing credit card purchases or outstanding balances into fixed monthly
          installments using the add-on (flat) interest method.
        </Body>
        <DataTable
          headers={["Bank", "Product", "Standard Rate", "Terms", "Processing Fee"]}
          rows={[
            ["BPI", "Balance Conversion", "0.99%/month", "6–60 months", "₱300 (≤₱50K) / ₱500 (>₱50K)"],
            ["BDO", "Balance Convert", "~0.88%/month", "Up to 60 months", "₱350"],
            ["Metrobank", "Balance Conversion", "Up to 1.00%/month", "3–60 months", "₱500"],
            ["Security Bank", "BalCon", "Personalized", "3–24 months", "Varies"],
            ["UnionBank", "EasyConvert", "Personalized", "Varies", "Varies"],
            ["HSBC", "Card Balance Conversion", "Up to 1.00%/month", "Up to 24 months", "Varies"],
            ["RCBC", "UNLI Installment", "Up to 1%/month", "Varies", "Varies"],
            ["Eastwest Bank", "Convert-to-Installment (CTI)", "—", "Varies", "—"],
            ["Maybank", "EzyConvert", "—", "Varies", "—"],
            ["PNB", "Transaction Conversion", "—", "Varies", "—"],
          ]}
        />
        <Body>Promo rates (as low as 0.49%) are typically invite-only or limited-time.</Body>
        <SourceNote>
          Sources: BSP Circular No. 1098 (2020), No. 1165 (2023), and bank-published fee schedules.
          As of 2026.
        </SourceNote>
      </DocSection>

      <Divider />

      <DocSection>
        <SectionLabel>Credit Card</SectionLabel>
        <SectionTitle>Credit-to-Cash Programs</SectionTitle>
        <Body>
          Converts available (unused) credit limit into cash deposited to your bank account.
        </Body>
        <DataTable
          headers={["Bank", "Product", "Standard Rate", "Terms", "Min Amount"]}
          rows={[
            ["BPI", "Credit-to-Cash", "0.99%/month", "6–60 months", "₱3,000"],
            ["Metrobank", "Cash2Go", "Up to 1%/month", "3–60 months", "Varies"],
            ["BDO", "Cash It Easy / Avail Cash Now", "Personalized", "Up to 36 months", "₱10,000"],
            ["Security Bank", "Ready Cash", "Personalized", "3–24 months", "₱10,000"],
            ["RCBC", "YourCash", "Up to 1%/month", "Varies", "₱20,000"],
          ]}
        />
        <Body>Processing fees typically range from ₱250–₱500 per availment.</Body>
        <SourceNote>
          Sources: Bank-published fee schedules and cardholder agreements. As of 2026.
        </SourceNote>
      </DocSection>

      <Divider />

      <DocSection>
        <SectionLabel>Credit Card</SectionLabel>
        <SectionTitle>0% Installment Programs</SectionTitle>
        <Body>
          Buy from partner merchants at 0% interest — the merchant subsidizes the cost. The total
          price may be marked up compared to the cash price.
        </Body>
        <DataTable
          headers={["Bank", "Program", "Max Terms", "Min Purchase"]}
          rows={[
            ["BPI", "Real 0% SIP / FlexipayZero", "36 months", "₱3,000"],
            ["BDO", "0% Installment", "24 months", "Varies"],
            ["Metrobank", "0% Installment", "36 months", "Varies"],
            ["HSBC", "Card Instalment Plan (HIP)", "36 months", "Varies"],
            ["RCBC", "Easyterms / Unli 0%", "36 months", "No min (Unli 0%)"],
            ["Security Bank", "ChargeLight", "24 months", "₱5,000"],
            ["EastWest", "0% Installment", "24 months", "₱3,000"],
            ["PNB", "ZAPP", "24 months", "Varies"],
          ]}
        />
        <SourceNote>
          Sources: Bank-published fee schedules and merchant partner programs. As of 2026.
        </SourceNote>
      </DocSection>
    </>
  );
}
