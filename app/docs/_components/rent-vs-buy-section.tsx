import {
  Body,
  Divider,
  DocSection,
  Formula,
  Note,
  SectionLabel,
  SectionTitle,
} from "./doc-primitives";

export const RentVsBuySection: React.FC = () => {
  return (
    <>
      <DocSection>
        <SectionLabel>Rent vs. Buy a Home</SectionLabel>
        <SectionTitle>The Invest-the-Difference Model</SectionTitle>
        <Body>
          Comparing a monthly mortgage to monthly rent is misleading — it
          ignores the down payment you tie up, the equity you build, and the
          returns you forgo by not investing that cash. This tool runs a
          year-by-year wealth simulation where both paths start with the same
          money. The buyer sinks it into the down payment and closing costs; the
          renter keeps it invested. Each year, whichever path costs less invests
          the surplus, so the two are compared on equal footing.
        </Body>
        <Formula>
          <div>
            Buy net worth = property value − loan balance − selling costs +
            invested surplus
          </div>
          <div>
            Rent net worth = invested cash (down payment + closing) + invested
            surplus
          </div>
          <div>Break-even year = first year Buy net worth ≥ Rent net worth</div>
        </Formula>
      </DocSection>

      <Divider />

      <DocSection>
        <SectionLabel>Rent vs. Buy a Home</SectionLabel>
        <SectionTitle>Costs of Owning</SectionTitle>
        <Body>
          The mortgage is a standard amortising annuity. On top of it, ownership
          carries recurring costs the simulation escalates each year:
        </Body>
        <Formula>
          <div>
            Monthly mortgage = P·i / (1 − (1 + i)⁻ⁿ), i = annual rate / 12
          </div>
          <div>
            Illustrative RPT + SEF = model property value × your assessment
            level × (RPT + SEF rates)
          </div>
          <div>
            Association dues = dues/sqm × floor area × 12, growing with
            inflation
          </div>
          <div>
            Closing costs = purchase price × your editable total cost assumption
          </div>
          <div>
            Selling costs = model property value × your editable sale-cost
            assumption
          </div>
        </Formula>
        <Body>
          Defaults are illustrative assumptions, not current market offers. The
          mortgage rate stays constant for the full term; future repricing is
          not modeled. The 7% investment return is not guaranteed: MP2 dividends
          are flexible and declared after net income is determined, not a fixed
          minimum. See{" "}
          <a
            href="https://elibrary.judiciary.gov.ph/thebookshelf/showdocs/10/91167"
            className="underline"
          >
            Pag-IBIG Circular 407
          </a>
          . Use the property’s actual tax assessment: residential land and
          building assessment rules differ, and taxes may use a different base
          than the purchase price.
        </Body>
      </DocSection>

      <Divider />

      <DocSection>
        <SectionLabel>Rent vs. Buy a Home</SectionLabel>
        <SectionTitle>Beyond a Single Answer</SectionTitle>
        <Body>
          A single break-even year is false precision when appreciation and
          returns are uncertain. So the tool adds three decision layers on top
          of the base simulation:
        </Body>
        <Formula>
          <div>
            Share of model runs where buying wins — ~2,000 illustrative samples,
            not a calibrated forecast
          </div>
          <div>
            Goal-seek — the exact appreciation / return / rent that flips the
            verdict (bisection)
          </div>
          <div>
            Sensitivity — how far net worth swings when each input shifts ±20%
          </div>
        </Formula>
        <Note>
          All figures can be switched to today&apos;s pesos
          (inflation-adjusted), and any scenario is shareable via a link that
          encodes every input — no account needed.
        </Note>
      </DocSection>
    </>
  );
};
