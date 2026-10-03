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
node --test tests/calculations.test.cjs
npx tsc --noEmit
npm run build
```

The focused tests cover bid discounts, financing, budget estimates, validation, and FX provider fallback contracts. They use the existing TypeScript dependency and Node's test runner.

## Pag-IBIG bid planning

`/pagibig-bid` adapts the project's saved `pagibig_bid_discount_calculator_v2.html` and retains the original calculator's 25- and 30-year comparisons. It compares discounts applied to the offer, payment modes, down payments, financing terms, and the minimum selling price. All assumptions can be shared through the URL.

Starting discounts and interest are from the saved example, not an official schedule. The optional budget calculation covers monthly installments and shows the required upfront amount separately. It does not establish loan eligibility or required income. See `/docs#pagibig-bid` for formulas and exclusions.

## FX rates

`/api/fx-rates` tries ExchangeRate-API, Frankfurter v1, then the currency-api CDN with a timeout for each provider. It validates the PHP base, timestamp, and positive rates; normalizes lowercase ISO currency codes; and excludes PHP and non-currency assets. Both the card FX and payout tools use the same client hook with error handling and retry.
