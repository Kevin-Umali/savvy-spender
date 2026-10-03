/** Providers quote foreign units per PHP. Consumers invert once for PHP per unit. */
const ISO_CODES = new Set(
  (Intl as typeof Intl & { supportedValuesOf(key: string): string[] }).supportedValuesOf("currency")
);

export function normalizeRates(raw: unknown): Record<string, number> | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const rates: Record<string, number> = {};
  for (const [key, value] of Object.entries(raw)) {
    const code = key.toUpperCase();
    if (code !== "PHP" && ISO_CODES.has(code) && typeof value === "number" && Number.isFinite(value) && value > 0) {
      rates[code] = value;
    }
  }
  return rates.USD ? rates : null;
}

export function normalizeTimestamp(raw: unknown): string | null {
  if (typeof raw !== "string" || !raw.trim()) return null;
  const time = Date.parse(raw);
  if (!Number.isFinite(time) || time > Date.now() + 86400000 || time < Date.now() - 10 * 86400000) return null;
  return new Date(time).toISOString();
}
