import { Body, Divider, DocSection, Formula, SectionLabel, SectionTitle } from "./doc-primitives";

export function FxSection() {
  return (
    <>
      <DocSection>
        <SectionLabel>Card FX Comparison</SectionLabel>
        <SectionTitle>How Foreign Transaction Markups Work</SectionTitle>
        <Body>
          When you pay in a foreign currency, your card issuer converts the amount to PHP using a
          rate marked up above the interbank (wholesale) rate. The all-in cost combines two
          charges: a bank-imposed forex conversion fee and a network cross-border assessment fee
          added by Visa or Mastercard.
        </Body>
        <Formula>
          <div>PHP Cost = Foreign Amount × PHP-per-unit × (1 + fxMarkup / 100)</div>
        </Formula>
        <Body>
          Visa adds ~1% and Mastercard ~0.2–1% as their network assessment. Most banks bundle
          these into a single quoted markup. Cards advertised as &quot;0% forex&quot; waive the
          bank fee — the network assessment may still apply.
        </Body>
      </DocSection>

      <Divider />

      <DocSection>
        <SectionLabel>Card FX Comparison</SectionLabel>
        <SectionTitle>Live Reference Rate</SectionTitle>
        <Body>
          The base PHP-per-unit rate is fetched live from open exchange rate APIs. Three sources
          are tried in order, and the first successful response is used:
        </Body>
        <Formula>
          <div>1. open.er-api.com — returns time_last_update_utc</div>
          <div>2. api.frankfurter.app — returns date</div>
          <div>3. cdn.jsdelivr.net/@fawazahmed0/currency-api — returns date</div>
        </Formula>
        <Body>
          Rates are cached server-side for 1 hour (Next.js revalidation). The sidebar shows which
          source responded and when the rate was last updated. This is a reference rate — your
          actual billing rate may differ slightly from what your bank applies.
        </Body>
      </DocSection>
    </>
  );
}
