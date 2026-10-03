const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
// Compile only requested TypeScript modules; no build artifacts or extra runner dependency.
require.extensions['.ts'] = (module, file) => module._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText.replaceAll('\"@/lib/fx/normalize\"', JSON.stringify(require('node:path').resolve(__dirname, '../lib/fx/normalize.ts'))), file);
const { DEFAULTS, computeBid, validateInput, offerForBudget, monthlyPayment } = require('../app/pagibig-bid/_lib/compute.ts');
const { normalizeRates, normalizeTimestamp } = require('../lib/fx/normalize.ts');
const close = (actual, expected, tolerance = 0.005) => assert.ok(Math.abs(actual - expected) < tolerance, `${actual} should be ${expected}`);

test('saved project example: discount is applied to offer, not minimum; down payment uses net', () => {
  const result = computeBid(DEFAULTS);
  close(result.saved, 719999.997);
  close(result.net, 1679999.993);
  close(result.down, 167999.9993);
  close(result.principal, 1511999.9937);
  close(result.monthly, 9309.644032);
  close(result.minimumNet, 838880);
  close(result.extraNet, 841119.993);
  close(result.totalOutlay, 3519471.850696);
});

test('cash, zero-interest short term, fixed down payment, and full discount have distinct behavior', () => {
  const input = { ...DEFAULTS, bid: 1000000, minimum: 800000 };
  const cash = computeBid({ ...input, mode: 'cash' });
  assert.equal(cash.net, 700000); assert.equal(cash.down, 700000);
  assert.equal(cash.monthly, 0); assert.equal(cash.totalOutlay, 700000);
  const short = computeBid({ ...input, mode: 'short', downMode: 'amount', downAmount: 200000 });
  assert.equal(short.net, 800000); assert.equal(short.monthly, 50000);
  assert.equal(short.totalOutlay, 800000); assert.equal(short.interest, 0);
  const free = computeBid({ ...input, longDiscount: 100 });
  assert.equal(free.principal, 0); assert.equal(free.monthly, 0);
  close(monthlyPayment(120000, 12, 12), 10661.854641);
});

test('budget check solves offer with percentage or fixed down payment and marks invalid inputs', () => {
  const input = { ...DEFAULTS, mode: 'short', shortDiscount: 20, months: 12, monthlyBudget: 50000, downPercent: 10 };
  close(offerForBudget(input).offer, 833333.333333);
  close(offerForBudget(input).down, 66666.666667);
  const fixed = offerForBudget({ ...input, downMode: 'amount', downAmount: 200000 });
  assert.equal(fixed.offer, 1000000); assert.equal(fixed.down, 200000);
  for (const overrides of [{ bid: -1 }, { years: 0 }, { years: 31 }, { months: 2.5 }, { annualRate: Infinity }, { downPercent: 101 }, { mode: 'bogus' }, { downMode: 'amount', downAmount: 999999999 }]) {
    assert.ok(validateInput({ ...DEFAULTS, ...overrides }));
    assert.throws(() => computeBid({ ...DEFAULTS, ...overrides }), RangeError);
  }
  assert.equal(offerForBudget({ ...input, downPercent: 100 }), null);
});

test('lowercase fallback rates become ISO codes without PHP, crypto, or invalid values', () => {
  assert.deepEqual(normalizeRates({ php: 1, usd: 0.02, eur: 0.017, btc: 0.0000001, doge: 1, jpy: 0, gbp: -1, sgd: Infinity, cad: '0.03' }), { USD: 0.02, EUR: 0.017 });
  assert.equal(1 / normalizeRates({ usd: 0.02 }).USD, 50);
  assert.equal(normalizeRates({ usd: 0 }), null);
  assert.equal(normalizeRates(null), null);
  assert.equal(normalizeTimestamp('not a date'), null);
  assert.equal(normalizeTimestamp('2020-01-01'), null);
  const now = new Date().toISOString();
  assert.equal(normalizeTimestamp(now), now);
});

const { GET } = require('../app/api/fx-rates/route.ts');
test('FX endpoint rejects wrong-base/invalid providers and recovers through both fallback contracts', async (t) => {
  const original = global.fetch;
  t.after(() => { global.fetch = original; });
  const timestamp = new Date().toISOString();
  for (const scenario of [
    { first: { result: 'success', base_code: 'USD', rates: { USD: 1 }, time_last_update_utc: timestamp }, second: { base: 'PHP', date: timestamp, rates: { USD: 0.02, EUR: 0.017 } }, expected: 'frankfurter', calls: 2 },
    { first: { result: 'success', base_code: 'PHP', rates: { USD: 0 }, time_last_update_utc: timestamp }, second: { base: 'PHP', date: '2020-01-01', rates: { USD: 0.02 } }, expected: 'fawazahmed0', calls: 3 },
  ]) {
    let calls = 0;
    global.fetch = async (_url, options) => {
      assert.ok(options.signal);
      const payload = [scenario.first, scenario.second, { date: timestamp, php: { php: 1, usd: 0.02, eur: 0.017, btc: 0.0000001 } }][calls++];
      return new Response(JSON.stringify(payload), { status: 200 });
    };
    const response = await GET();
    assert.equal(response.status, 200);
    const data = await response.json();
    assert.equal(data.base, 'PHP'); assert.equal(data.source, scenario.expected);
    assert.equal(data.rates.USD, 0.02); assert.equal(data.rates.PHP, undefined);
    assert.deepEqual(data.currencies.map((c) => c.code), ['EUR', 'USD']);
    assert.equal(calls, scenario.calls);
  }
  global.fetch = async () => { throw new Error('upstream offline'); };
  const unavailable = await GET();
  assert.equal(unavailable.status, 503);
  assert.equal(unavailable.headers.get('Cache-Control'), 'no-store');
});
