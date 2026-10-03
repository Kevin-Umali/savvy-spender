import { createParser, parseAsString, type ParserBuilder } from "nuqs/server";

export type PrimitiveState<T> = { [K in keyof T]: number | boolean | string };
export type NumberBounds<T> = Partial<
  Record<keyof T, readonly [number, number]>
>;

// Reject partial numbers, Infinity and blanks instead of silently coercing them.
export const parseAsFiniteNumber = createParser({
  parse: (value) =>
    value.trim() !== "" && Number.isFinite(Number(value))
      ? Number(value)
      : null,
  serialize: String,
});

// Existing shared links encoded booleans as 1/0.
export const parseAsLegacyBoolean = createParser({
  parse: (value) =>
    value === "1" || value === "true"
      ? true
      : value === "0" || value === "false"
        ? false
        : null,
  serialize: (value: boolean) => (value ? "1" : "0"),
});

export function createToolParsers<T extends PrimitiveState<T>>(
  defaults: T,
  bounds?: NumberBounds<T>,
) {
  return Object.fromEntries(
    Object.entries(defaults).map(([key, value]) => [
      key,
      typeof value === "number"
        ? createParser({
            parse: (raw) => {
              const parsed = parseAsFiniteNumber.parse(raw);
              const range = bounds?.[key as keyof T] ?? [-1e12, 1e12];
              return parsed !== null && parsed >= range[0] && parsed <= range[1]
                ? parsed
                : null;
            },
            serialize: String,
          }).withDefault(value)
        : typeof value === "boolean"
          ? parseAsLegacyBoolean.withDefault(value)
          : parseAsString.withDefault(value as string),
    ]),
  ) as unknown as {
    [K in keyof T]: ParserBuilder<T[K]> & { defaultValue: T[K] };
  };
}
