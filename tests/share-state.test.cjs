const { test, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const resolve = Module._resolveFilename;
Module._resolveFilename = function (request, ...args) {
  return resolve.call(this, request.startsWith('@/') ? path.resolve(__dirname, '..', request.slice(2)) : request, ...args);
};
for (const extension of ['.ts', '.tsx']) {
  require.extensions[extension] = (module, file) => module._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText, file);
}

const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', { url: 'https://example.test/calculator?utm_source=chat#inputs' });
for (const key of ['window', 'document', 'location', 'history', 'HTMLElement', 'Element', 'Node', 'MutationObserver', 'FileList', 'Blob']) global[key] = dom.window[key];
Object.defineProperty(global, 'navigator', { value: dom.window.navigator, configurable: true });
global.IS_REACT_ACT_ENVIRONMENT = true;
const React = require('react');
const { render, screen, fireEvent, act, cleanup, waitFor } = require('@testing-library/react');
const { NuqsTestingAdapter } = require('nuqs/adapters/testing');
const { createLoader, createSerializer } = require('nuqs/server');
const { useQueryState } = require('../lib/use-query-state.ts');
const { createToolParsers } = require('../lib/query-parsers.ts');
const { ShareStateProvider, useShareUrl } = require('../components/share-state-provider.tsx');
const { DEFAULTS, CODES } = require('../app/pagibig-bid/_lib/compute.ts');
const { DEFAULT_INPUT } = require('../app/rent-vs-buy/_lib/defaults.ts');
const { QUERY_CODES, INPUT_BOUNDS } = require('../app/rent-vs-buy/_lib/url-state.ts');
const { scenarioParser } = require('../app/loan-compare/_lib/url-state.ts');
const { SAMPLE_SCENARIO } = require('../app/loan-compare/_lib/defaults.ts');
afterEach(cleanup);

test('existing short links restore bid and rent inputs; malformed or excessive numbers safely fall back', () => {
  const bid = createLoader(createToolParsers(DEFAULTS), { urlKeys: CODES });
  const input = { ...DEFAULTS, bid: 3000000, downMode: 'amount', downAmount: 200000, monthlyBudget: 15000 };
  const encode = createSerializer(createToolParsers(DEFAULTS), { urlKeys: CODES, clearOnDefault: false });
  assert.deepEqual(bid(encode(input)), input);
  const rent = createLoader(createToolParsers(DEFAULT_INPUT, INPUT_BOUNDS), { urlKeys: QUERY_CODES });
  assert.equal(rent('?p=6500000&sl=0').price, 6500000);
  assert.equal(rent('?p=6500000&sl=0').assumeSaleAtHorizon, false);
  const invalid = rent('?hz=9999999&mr=Infinity&dp=101&rn=12oops&ir=');
  for (const field of ['horizonYears', 'mortgageRatePct', 'downPaymentPct', 'monthlyRent', 'investReturnPct']) assert.equal(invalid[field], DEFAULT_INPUT[field]);
});

test('car link restores the complete nested quote and rejects malformed or oversized options', () => {
  const input = structuredClone(SAMPLE_SCENARIO);
  input.options[0].notes = 'Example quote: & = #?';
  input.options[0].fees = [{ id: 'fee-1', name: 'Insurance', amount: 12000, timing: 'annual', includedInMonthly: false, includedInUpfront: false, waived: false, waivedAmount: 0, notes: 'Yearly' }];
  assert.deepEqual(scenarioParser.parse(scenarioParser.serialize(input)), input);
  assert.ok(scenarioParser.serialize(input).length < 4000, 'sample quote should fit in an ordinary share link');
  assert.deepEqual(scenarioParser.parse(JSON.stringify(input)), input); // plain JSON remains readable
  assert.equal(scenarioParser.parse('v1:invalid-data'), null);
  for (const raw of ['not JSON', '{}', JSON.stringify({ ...input, options: new Array(21).fill(input.options[0]) })]) assert.equal(scenarioParser.parse(raw), null);
  input.options[0].termMonths = 100000;
  assert.equal(scenarioParser.parse(JSON.stringify(input)), null);
});

test('nuqs batches edits, preserves unrelated parameters, snapshots defaults, and reset restores defaults', async () => {
  const defaults = { amount: 100, currency: 'USD', enabled: false };
  const codes = { amount: 'a', currency: 'c', enabled: 'e' };
  let exposed, copied;
  const updates = [];
  function Probe() {
    exposed = useQueryState(defaults, codes);
    const snapshot = useShareUrl();
    return React.createElement('button', { onClick: () => { copied = snapshot(); } }, 'Snapshot');
  }
  render(React.createElement(NuqsTestingAdapter, { searchParams: '?a=200&utm_source=chat', hasMemory: true, onUrlUpdate: (event) => updates.push(event) },
    React.createElement(ShareStateProvider, null, React.createElement(Probe))));
  assert.equal(exposed[0].amount, 200);
  await act(async () => { exposed[1]({ amount: 250 }); exposed[1]({ enabled: true }); });
  await waitFor(() => assert.equal(updates.at(-1).searchParams.get('a'), '250'));
  assert.equal(updates.at(-1).searchParams.get('e'), '1');
  assert.equal(updates.at(-1).searchParams.get('utm_source'), 'chat');
  fireEvent.click(screen.getByText('Snapshot'));
  const url = new URL(copied);
  assert.equal(url.searchParams.get('c'), 'USD'); // not omitted just because it is a default
  assert.equal(url.searchParams.get('a'), '250');
  assert.equal(url.hash, '#inputs');
  await act(async () => exposed[2]());
  assert.deepEqual(exposed[0], defaults);
});

test('installment form restores every financial input and submits the same percentage shown in the link', async () => {
  const Form = require('../app/calculator/_components/card-form.tsx').default;
  let submitted;
  render(React.createElement(NuqsTestingAdapter, { searchParams: '?amt=120000&rate=0.99&fee=500&term=12&budget=15000&plans=6,12', hasMemory: true },
    React.createElement(ShareStateProvider, null, React.createElement(Form, { onSubmit: (value) => { submitted = value; } }))));
  const fields = screen.getAllByRole('spinbutton');
  assert.equal(fields[0].value, '120000');
  assert.equal(fields[1].value, '0.99');
  fireEvent.click(screen.getByText('Calculate'));
  await waitFor(() => assert.ok(submitted));
  assert.equal(submitted.interestRate, 0.99);
  assert.equal(submitted.processingFee, 500);
  assert.equal(submitted.monthlyBudget, 15000);
  assert.deepEqual(submitted.customPlanList, ['6', '12']);
  fireEvent.change(fields[1], { target: { value: '0.49' } });
  fireEvent.click(screen.getByText('Calculate'));
  await waitFor(() => assert.equal(submitted.interestRate, 0.49));
});

test('history navigation restores URL inputs instead of an effect overwriting them', async () => {
  const { NuqsAdapter } = require('nuqs/adapters/react');
  const defaults = { amount: 100 };
  const codes = { amount: 'a' };
  let input;
  function Probe() { input = useQueryState(defaults, codes); return null; }
  window.history.replaceState(null, '', '?a=111');
  render(React.createElement(NuqsAdapter, null, React.createElement(ShareStateProvider, null, React.createElement(Probe))));
  assert.equal(input[0].amount, 111);
  await act(async () => { input[1]({ amount: 222 }); });
  await waitFor(() => assert.equal(window.location.search, '?a=222'));
  await act(async () => {
    window.history.replaceState(null, '', '?a=333');
    window.dispatchEvent(new window.PopStateEvent('popstate'));
  });
  assert.equal(input[0].amount, 333);
  assert.equal(window.location.search, '?a=333');
});
