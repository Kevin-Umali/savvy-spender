"use client";

import { useCallback, useEffect, useState } from "react";
import { normalizeRates, normalizeTimestamp } from "./normalize";
import type { FxRateState, FxRatesResponse } from "./types";

type State = Omit<FxRateState, "retry">;
const INITIAL: State = {
  rates: null, currencies: [], timestamp: null, source: null, error: null, loading: true,
};

export function useFxRates(): FxRateState {
  const [state, setState] = useState<State>(INITIAL);
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    let active = true;
    setState(INITIAL);
    async function load() {
      try {
        const response = await fetch("/api/fx-rates", { signal: controller.signal });
        if (!response.ok) throw new Error("FX rates are unavailable. Please retry.");
        const data: FxRatesResponse = await response.json();
        const rates = normalizeRates(data?.rates);
        const timestamp = normalizeTimestamp(data?.timestamp);
        if (data?.base !== "PHP" || !rates || !timestamp || typeof data.source !== "string") {
          throw new Error("The FX rate response is invalid. Please retry.");
        }
        const names = new Map((Array.isArray(data.currencies) ? data.currencies : [])
          .filter((c) => c && typeof c.code === "string" && typeof c.name === "string")
          .map((c) => [c.code, c.name]));
        if (active) setState({ rates, currencies: Object.keys(rates).sort().map((code) => ({ code, name: names.get(code) ?? code })), timestamp, source: data.source, error: null, loading: false });
      } catch (error) {
        if (active) setState({ ...INITIAL, loading: false, error: controller.signal.aborted
          ? "Fetching FX rates timed out. Please retry."
          : error instanceof Error ? error.message : "Could not fetch FX rates. Please retry." });
      } finally {
        clearTimeout(timeout);
      }
    }
    void load();
    return () => { active = false; clearTimeout(timeout); controller.abort(); };
  }, [attempt]);

  return { ...state, retry };
}
