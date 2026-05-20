import {
  Body,
  Divider,
  DocSection,
  Formula,
  Note,
  SectionLabel,
  SectionTitle,
  SubTitle,
} from "./doc-primitives";

export function CarFinancingSection() {
  return (
    <>
      <DocSection>
        <SectionLabel>Car Financing Comparison</SectionLabel>
        <SectionTitle>Three Ways to Finance a Car</SectionTitle>
        <Body>
          The Car Financing Comparison tool puts three options side by side: a Bank Auto Loan, a
          Credit-to-Cash / Personal Loan used to buy the car as cash, and Dealer In-House
          Financing. You enter the figures each lender quotes you, and the tool lines them up so
          the real cost is obvious.
        </Body>
        <Formula>
          <div>Discounted Price = Original Price − Dealer Discount (if it applies)</div>
          <div>Total Monthly Payments = Monthly Amortization × Term</div>
          <div>Total Cost = Down Payment + Total Monthly Payments + Total Fees</div>
          <div>Financing Cost Above Price = Total Cost − Discounted Price</div>
        </Formula>
        <Body>
          Monthly amortization for the bank and in-house options is whatever the lender quotes you
          — there is no single formula, since quotes come from rate tables. Enter the quoted
          figure directly.
        </Body>
      </DocSection>

      <Divider />

      <DocSection>
        <SectionLabel>Car Financing Comparison</SectionLabel>
        <SectionTitle>Dealer Discount &amp; Double-Counting</SectionTitle>
        <Body>
          Dealer discounts often apply to some financing channels but not others — a cash-style
          credit-to-cash purchase may get a bigger discount than a bank loan, for example. The
          &quot;Discount applies to&quot; selector controls which options have the discount netted
          from their price, so a freebie is never subtracted twice.
        </Body>
        <Body>
          Fees are entered as plain numbers. If a fee is waived as a promo, enter 0 — it simply
          drops out of the total. If it is charged, enter the amount. Each option also has a
          free-form notes field for promo eligibility rules (e.g. &quot;free chattel mortgage only
          on the 60-month term&quot;).
        </Body>
      </DocSection>

      <Divider />

      <DocSection>
        <SectionLabel>Car Financing Comparison</SectionLabel>
        <SectionTitle>OMA vs Arrears</SectionTitle>
        <Body>
          The payment type determines whether the first monthly amortization is collected at
          signing.
        </Body>
        <Formula>
          <div>OMA — first month is paid upfront, so it joins the initial cash-out</div>
          <div>Arrears — first month is billed after release / next cycle</div>
        </Formula>
        <Body>
          OMA raises the upfront cash but does not change the lifecycle total — it only shifts the
          timing of one payment. Upfront cash for the bank and in-house options is therefore Down
          Payment + OMA (if any) + Total Fees.
        </Body>
      </DocSection>

      <Divider />

      <DocSection>
        <SectionLabel>Car Financing Comparison</SectionLabel>
        <SectionTitle>Bank Auto Loan</SectionTitle>
        <Body>
          A secured loan from a bank, using the vehicle as collateral. Usually the cheapest option
          overall, but it requires a credit check, comprehensive insurance, and a chattel mortgage
          registered with the LTO.
        </Body>
        <SubTitle>Fees you may enter</SubTitle>
        <Body>
          Chattel mortgage, bank fees, documentary stamp tax, notarial fee, LTO encumbrance,
          registration, comprehensive insurance, CTPL, and any other fees. The loan amount should
          normally equal the discounted price minus the down payment — the tool flags a warning if
          it does not, which usually means a discount has been applied inconsistently.
        </Body>
      </DocSection>

      <Divider />

      <DocSection>
        <SectionLabel>Car Financing Comparison</SectionLabel>
        <SectionTitle>Credit-to-Cash / Personal Loan</SectionTitle>
        <Body>
          You borrow cash — from a credit card limit or a personal loan — and pay the dealer in
          full. From the dealer&apos;s side it is a cash sale, so there is no chattel mortgage.
        </Body>
        <Formula>
          <div>Total Interest = Loanable Amount × Monthly Add-On Rate × Term</div>
          <div>Total Repayment = Loanable Amount + Total Interest</div>
          <div>Monthly Payment = Total Repayment / Term</div>
          <div>Cash Portion = Discounted Price − Loanable Amount</div>
        </Formula>
        <Body>
          If your bank quotes a fixed monthly payment, enter it as the override — it is used
          instead of the add-on formula and labelled &quot;bank-quoted monthly&quot;. The add-on
          rate is not the same as the effective rate; enter the EIRPA separately to compare true
          borrowing cost across products.
        </Body>
        <Note>
          When the loanable amount is lower than the car&apos;s price, you must pay the difference
          (the cash portion) upfront — so credit-to-cash can mean a lower monthly payment but a
          higher cash requirement at signing.
        </Note>
      </DocSection>

      <Divider />

      <DocSection>
        <SectionLabel>Car Financing Comparison</SectionLabel>
        <SectionTitle>In-House Financing</SectionTitle>
        <Body>
          Direct financing from the car dealer. No bank credit check, so it is the easiest to get
          approved — but it is treated separately because its discounts, fees, and monthly
          amortization can differ from a bank loan, and it is often the most expensive over the
          full term.
        </Body>
        <Body>
          It is computed the same way as the bank auto loan: down payment, quoted monthly
          amortization, payment type, and free-form fees (chattel mortgage, processing,
          documentation, registration, insurance, CTPL, other dealer charges).
        </Body>
      </DocSection>

      <Divider />

      <DocSection>
        <SectionLabel>Car Financing Comparison</SectionLabel>
        <SectionTitle>Results &amp; Recommendation</SectionTitle>
        <Body>
          Results are shown as five tables: Key Assumptions, Upfront Cash, Monthly Payment, Total
          Cost, and a Recommendation Summary. The recommendation highlights the lowest monthly
          payment, lowest upfront cash, lowest total cost, and the simplest process.
        </Body>
        <Body>
          You can also pick a priority — lowest total cost, lowest monthly, lowest upfront, no
          chattel mortgage, fastest approval, or ownership flexibility — and the tool names the
          best option for that priority with a short rationale.
        </Body>
      </DocSection>
    </>
  );
}
