import { Body, DocSection, Formula, Note, SectionLabel, SectionTitle } from "./doc-primitives";
export function PagibigBidSection() {
  return <section id="pagibig-bid" className="scroll-mt-24"><DocSection>
    <SectionLabel>Pag-IBIG Bid &amp; Financing</SectionLabel>
    <SectionTitle>Bid discounts and payment estimates</SectionTitle>
    <Body>The discount is applied to the offer price. The minimum gross selling price is a comparison baseline. A discount does not make an offer below the minimum acceptable.</Body>
    <Formula><div>Discount amount = Offer price × Discount / 100</div><div>Net selling price = Offer price − Discount amount</div><div>Amount financed = Net selling price − Down payment</div><div>Monthly payment = P × r / (1 − (1 + r)^(−n))</div><div>P = Amount financed; r = Annual interest / 1200; n = Months</div><div>At 0% interest: Monthly payment = P / n</div><div>Total outlay = Down payment + Monthly payment × n</div></Formula>
    <Body>Cash shows the net price payable. Short-term uses the selected number of months and editable annual interest rate (the example starts at 0%). Long-term uses the selected years and annual rate. Down payment can be entered as a percentage of net price or as a peso amount. Compare 15–30% discounts, a custom discount, and loan terms including 25 and 30 years.</Body>
    <Note>The saved bid example supplies the starting values: minimum ₱1,198,400, offer ₱2,399,999.99, discounts 30% / 20% / 30%, annual long-term interest 6.25%, and 10% down. These are illustrative inputs, not a published discount schedule or current lending offer. Verify your property’s terms with Pag-IBIG. Insurance, taxes, fees, penalties, eligibility, income requirements, and rate repricing are outside this estimate.</Note>
    <Body>The optional monthly budget estimates an offer supported by your selected term, interest, discount, and down payment method. The required upfront amount is shown separately. This does not estimate required income or approval. Use Copy link to save or share all assumptions. Reset example restores the starting values. An amount above the net price or an invalid percentage displays an error instead of silently changing your input.</Body>
  </DocSection></section>;
}
