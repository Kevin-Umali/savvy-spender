# Savvy Spender

Philippine financial planning tools built with Next.js, React, and TypeScript.

## Development

Use Node.js 24 or newer.

```sh
npm ci
npm run dev
```

## Checks

```sh
npm test
npm run lint
npx tsc --noEmit
npm run build
```

Tests cover bid calculations, financial-input validation, percentage units, fee-aware annual effective cost, conditional payout fees, promo expiry, URL restoration, nested car quotes, default snapshots, form submission, reset, and history navigation. Tests use Node's test runner and the nuqs testing adapter with React Testing Library.

## Code conventions and sharing

Keep route-specific UI in `app/<tool>/_components` and pure calculations, schemas, and URL definitions in `app/<tool>/_lib`. Reusable UI lives in `components`, shared utilities in `lib`, and API routes reuse the same validation and computation modules as the browser. Keep metadata in server layouts and put query-state clients inside Suspense.

All six interactive tools use nuqs through the Next App Router adapter. Existing short query keys still work. Copy link snapshots all financial inputs, including default values, nested financing options, fees, notes, filters, and view preferences. Loading a link restores inputs; live FX rates, fee schedules, and promo eligibility can change. Reset clears managed keys without removing unrelated query parameters. No account or server-stored scenario is needed. Car links can be long and contain all notes; avoid private information and check that messaging apps do not truncate them.

## Accuracy policy

Verified issuer fees include official source links and a review date (October 3, 2026). Unverified card entries and unsupported generic loan-rate/EIR tables were removed rather than presented as current tariffs. RCBC promo fees have date bounds and revert to standard fees outside the promotional period.

Payout amounts are illustrative USD scenarios, not provider quotes; calculations are disabled for other currencies to avoid treating USD fixed fees as local-currency fees. Wise and Payoneer costs are corridor-specific. The PayPal-to-GCash cash-in fee is 1% from March 7, 2026. Payoneer's annual fee generally depends on receipts, not inactivity.

The installment tool accepts percentage inputs consistently (0.99 means 0.99%). Annual effective cost compounds the solved monthly cash-flow rate and includes upfront fees. Some issuer EIR disclosures use a different annualization convention. Debt-instrument DST uses 0.75%, with a clearly labeled month-based estimate for terms below one year; actual tax uses days / 365 and exemptions are conditional. Rent vs. Buy uses illustrative constant-rate assumptions and simulation shares, not guaranteed returns, current tax assessments, or calibrated probabilities.

## Pag-IBIG bid planning

`/pagibig-bid` adapts the project's saved `pagibig_bid_discount_calculator_v2.html` and retains the original calculator's 25- and 30-year comparisons. It compares discounts applied to the offer, payment modes, down payments, financing terms, and the minimum selling price. All assumptions can be shared through the URL.

Starting discounts and interest are from the saved example, not an official schedule. The optional budget calculation covers monthly installments and shows the required upfront amount separately. It does not establish loan eligibility or required income. See `/docs#pagibig-bid` for formulas and exclusions.

## FX rates

`/api/fx-rates` tries ExchangeRate-API, Frankfurter v1, then the currency-api CDN with a timeout for each provider. It validates the PHP base, timestamp, and positive rates; normalizes lowercase ISO currency codes; and excludes PHP and non-currency assets. Both the card FX and payout tools use the same client hook with error handling and retry.
