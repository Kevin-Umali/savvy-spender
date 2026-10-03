import {
  Body,
  Divider,
  DocSection,
  Formula,
  SectionLabel,
  SectionTitle,
} from "./doc-primitives";

export function FxSection() {
  return (
    <>
      <DocSection>
        <SectionLabel>Card FX Comparison</SectionLabel>
        <SectionTitle>How Foreign Transaction Markups Work</SectionTitle>
        <Body>
          When you pay in a foreign currency, your card issuer converts the
          amount to PHP using a network or bank conversion rate. The all-in cost
          combines two charges: a bank-imposed forex conversion fee and a
          network cross-border assessment fee added by Visa or Mastercard.
        </Body>
        <Formula>
          <div>
            PHP Cost = Foreign Amount × PHP-per-unit × (1 + fxMarkup / 100)
          </div>
        </Formula>
        <Body>
          Network assessments are product- and issuer-specific. The table
          includes verified published fees and source links; the reference API
          rate is not necessarily the issuer’s conversion rate. Cards advertised
          as &quot;0% forex&quot; waive the bank fee — the network assessment
          may still apply.
        </Body>
      </DocSection>

      <Divider />

      <DocSection>
        <SectionLabel>Card FX Comparison</SectionLabel>
        <SectionTitle>Live Reference Rate</SectionTitle>
        <Body>
          The base PHP-per-unit rate is fetched live from open exchange rate
          APIs. Three sources are tried in order, and the first successful
          response is used:
        </Body>
        <Formula>
          <div>1. open.er-api.com — returns time_last_update_utc</div>
          <div>2. api.frankfurter.dev/v1 — returns date</div>
          <div>
            3. cdn.jsdelivr.net/@fawazahmed0/currency-api — returns date
          </div>
        </Formula>
        <Body>
          Rates are cached server-side for 1 hour (Next.js revalidation). The
          sidebar shows which source responded and when the rate was last
          updated. Currency codes are normalized across providers; invalid or
          outdated responses fall through to the next source. If none responds,
          use Retry rates. This is a reference rate — your actual billing rate
          can differ materially from what your bank applies.
        </Body>
      </DocSection>
    </>
  );
}
