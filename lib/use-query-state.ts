"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Primitive = number | boolean | string;

/** Serialize state into a query string, omitting values equal to the defaults. */
export function encodeState<T extends Record<string, Primitive>>(
  state: T,
  defaults: T,
  codes: Record<keyof T, string>
): string {
  const params = new URLSearchParams();
  (Object.keys(codes) as (keyof T)[]).forEach((key) => {
    const value = state[key];
    if (value === defaults[key]) return;
    params.set(codes[key], typeof value === "boolean" ? (value ? "1" : "0") : String(value));
  });
  return params.toString();
}

/** Rebuild typed state from a query string, coercing by the default's type. */
export function decodeState<T extends Record<string, Primitive>>(
  params: URLSearchParams,
  defaults: T,
  codes: Record<keyof T, string>
): T {
  const out: T = { ...defaults };
  (Object.keys(codes) as (keyof T)[]).forEach((key) => {
    const raw = params.get(codes[key]);
    if (raw === null) return;
    const def = defaults[key];
    if (typeof def === "number") {
      if (raw.trim() === "") return; // empty string would coerce to 0
      const n = Number(raw);
      if (Number.isFinite(n)) out[key] = n as T[keyof T];
    } else if (typeof def === "boolean") {
      out[key] = (raw === "1") as T[keyof T];
    } else {
      out[key] = raw as T[keyof T];
    }
  });
  return out;
}

/**
 * Typed state that round-trips through the URL query string, so any scenario is
 * shareable / reloadable with no backend. `codes` maps each field to a short
 * query key; `defaults` defines both the initial state and the value types.
 * Must be used inside a <Suspense> boundary (uses useSearchParams).
 */
export function useQueryState<T extends Record<string, Primitive>>(
  defaults: T,
  codes: Record<keyof T, string>
): [T, (patch: Partial<T>) => void, () => void] {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, setState] = useState<T>(() => decodeState(searchParams, defaults, codes));

  useEffect(() => {
    // Merge managed keys onto the existing query so unrelated params (utm_*, etc.)
    // are preserved rather than stripped on mount.
    const params = new URLSearchParams(searchParams.toString());
    (Object.keys(codes) as (keyof T)[]).forEach((key) => {
      const value = state[key];
      const code = codes[key];
      if (value === defaults[key]) params.delete(code);
      else params.set(code, typeof value === "boolean" ? (value ? "1" : "0") : String(value));
    });
    const query = params.toString();
    router.replace(query ? `?${query}` : window.location.pathname, { scroll: false });
    // defaults & codes are module-level constants; only `state` drives updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const patch = useCallback((p: Partial<T>) => setState((prev) => ({ ...prev, ...p })), []);
  const reset = useCallback(() => setState({ ...defaults }), [defaults]);

  return [state, patch, reset];
}
