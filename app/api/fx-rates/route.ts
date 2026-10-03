import { NextResponse } from "next/server";

import type { FxRatesResponse } from "@/lib/fx/types";
import { normalizeRates, normalizeTimestamp } from "@/lib/fx/normalize";

// The route must retry providers after an outage rather than cache a static 503.
export const dynamic = "force-dynamic";

// ISO 4217 currency names (subset — most commonly traded)
const CURRENCY_NAMES: Record<string, string> = {
  USD: "US Dollar", EUR: "Euro", GBP: "British Pound", JPY: "Japanese Yen",
  SGD: "Singapore Dollar", AUD: "Australian Dollar", HKD: "Hong Kong Dollar",
  CAD: "Canadian Dollar", CHF: "Swiss Franc", CNY: "Chinese Yuan",
  KRW: "South Korean Won", NZD: "New Zealand Dollar", MYR: "Malaysian Ringgit",
  THB: "Thai Baht", IDR: "Indonesian Rupiah", TWD: "New Taiwan Dollar",
  INR: "Indian Rupee", AED: "UAE Dirham", SAR: "Saudi Riyal", QAR: "Qatari Riyal",
  KWD: "Kuwaiti Dinar", BHD: "Bahraini Dinar", OMR: "Omani Rial",
  DKK: "Danish Krone", SEK: "Swedish Krona", NOK: "Norwegian Krone",
  PLN: "Polish Zloty", CZK: "Czech Koruna", HUF: "Hungarian Forint",
  ZAR: "South African Rand", BRL: "Brazilian Real", MXN: "Mexican Peso",
  ARS: "Argentine Peso", CLP: "Chilean Peso", COP: "Colombian Peso",
  PEN: "Peruvian Sol", VND: "Vietnamese Dong", PKR: "Pakistani Rupee",
  BDT: "Bangladeshi Taka", LKR: "Sri Lankan Rupee", NPR: "Nepalese Rupee",
  MMK: "Myanmar Kyat", KHR: "Cambodian Riel", PHP: "Philippine Peso",
};

type ApiDef = {
  name: string;
  url: string;
  normalize: (data: unknown) => { rates: Record<string, number>; timestamp: string } | null;
};

const APIS: ApiDef[] = [
  {
    name: "open.er-api",
    url: "https://open.er-api.com/v6/latest/PHP",
    normalize: (data) => {
      const d = data as { result?: string; base_code?: string; rates?: Record<string, number>; time_last_update_utc?: string };
      if (d.result !== "success" || d.base_code !== "PHP" || !d.rates) return null;
      return { rates: d.rates, timestamp: d.time_last_update_utc ?? "" };
    },
  },
  {
    name: "frankfurter",
    url: "https://api.frankfurter.dev/v1/latest?base=PHP",
    normalize: (data) => {
      const d = data as { base?: string; rates?: Record<string, number>; date?: string };
      if (d.base !== "PHP" || !d.rates) return null;
      return { rates: d.rates, timestamp: d.date ?? "" };
    },
  },
  {
    name: "fawazahmed0",
    url: "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/php.json",
    normalize: (data) => {
      const d = data as { date?: string; php?: Record<string, number> };
      if (!d.php) return null;
      // Rates are from PHP, same convention as others
      return { rates: d.php, timestamp: d.date ?? "" };
    },
  },
];

async function tryFetchRates(): Promise<{ rates: Record<string, number>; timestamp: string; source: string } | null> {
  for (const api of APIS) {
    try {
      const res = await fetch(api.url, {
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(5000),
        headers: { "Accept": "application/json" },
      });
      if (!res.ok) continue;
      const data = await res.json();
      if (!data || typeof data !== "object" || Array.isArray(data)) continue;
      const normalized = api.normalize(data);
      if (!normalized) continue;
      const rates = normalizeRates(normalized.rates);
      const timestamp = normalizeTimestamp(normalized.timestamp);
      if (!rates || !timestamp) continue;
      return { rates, timestamp, source: api.name };
    } catch {
      continue;
    }
  }
  return null;
}

export async function GET() {
  const result = await tryFetchRates();

  if (!result) {
    return NextResponse.json(
      { error: "All FX rate sources are unavailable. Please try again later." },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }

  const rates = result.rates;

  // Build sorted currency list with known names
  const currencies = Object.keys(rates)
    .sort()
    .map((code) => ({ code, name: CURRENCY_NAMES[code] ?? code }));

  const response: FxRatesResponse = {
    rates,
    base: "PHP",
    timestamp: result.timestamp,
    source: result.source,
    currencies,
  };

  return NextResponse.json(response, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
    },
  });
}
