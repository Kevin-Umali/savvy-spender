import { Body, Divider, DocSection, Formula, Note, SectionLabel, SectionTitle } from "./doc-primitives";

export function RentVsBuySection() {
  return (
    <>
      <DocSection>
        <SectionLabel>Rent vs. Buy a Home</SectionLabel>
        <SectionTitle>The Invest-the-Difference Model</SectionTitle>
        <Body>
          Comparing a monthly mortgage to monthly rent is misleading — it ignores the down payment
          you tie up, the equity you build, and the returns you forgo by not investing that cash.
          This tool runs a year-by-year wealth simulation where both paths start with the same money.
          The buyer sinks it into the down payment and closing costs; the renter keeps it invested.
          Each year, whichever path costs less invests the surplus, so the two are compared on equal
          footing.
        </Body>
        <Formula>
          <div>Buy net worth = property value − loan balance − selling costs + invested surplus</div>
          <div>Rent net worth = invested cash (down payment + closing) + invested surplus</div>
          <div>Break-even year = first year Buy net worth ≥ Rent net worth</div>
        </Formula>
      </DocSection>

      <Divider />

      <DocSection>
        <SectionLabel>Rent vs. Buy a Home</SectionLabel>
        <SectionTitle>Costs of Owning</SectionTitle>
        <Body>
          The mortgage is a standard amortising annuity. On top of it, ownership carries recurring
          costs the simulation escalates each year:
        </Body>
        <Formula>
          <div>Monthly mortgage = P·i / (1 − (1 + i)⁻ⁿ), i = annual rate / 12</div>
          <div>Amilyar (RPT) = property value × assessment level (20%) × (RPT 2% + SEF 1%)</div>
          <div>Association dues = dues/sqm × floor area × 12, growing with inflation</div>
          <div>Closing costs ≈ 5% = DST 1.5% + transfer ~0.75% + registration ~0.5% + professional</div>
          <div>Selling costs ≈ 9.5% = CGT 6% + broker ~3% + notarial (if you assume a sale)</div>
        </Formula>
        <Body>
          Defaults are anchored to May 2026 Philippine figures: bank fixed mortgage ~6.75% (Pag-IBIG
          presets at 3% / ~6.25% are one click away), condo appreciation ~4%, association dues ₱100 /
          sqm, and a 7% investment return — the floor set by Pag-IBIG MP2&apos;s tax-free 7.12%.
        </Body>
      </DocSection>

      <Divider />

      <DocSection>
        <SectionLabel>Rent vs. Buy a Home</SectionLabel>
        <SectionTitle>Beyond a Single Answer</SectionTitle>
        <Body>
          A single break-even year is false precision when appreciation and returns are uncertain. So
          the tool adds three decision layers on top of the base simulation:
        </Body>
        <Formula>
          <div>P(buying wins) — ~2,000 Monte-Carlo runs sampling appreciation, return, rent growth</div>
          <div>Goal-seek — the exact appreciation / return / rent that flips the verdict (bisection)</div>
          <div>Sensitivity — how far net worth swings when each input shifts ±20%</div>
        </Formula>
        <Note>
          All figures can be switched to today&apos;s pesos (inflation-adjusted), and any scenario is
          shareable via a link that encodes every input — no account needed.
        </Note>
      </DocSection>
    </>
  );
}
