"use client";

import { useEffect, useState } from "react";
import type { FxRatesResponse } from "@/app/api/fx-rates/route";
import type { FxRateState } from "./types";

const INITIAL: FxRateState = {
  rates: null,
  currencies: [],
  timestamp: null,
  source: null,
  error: null,
  loading: true,
};

/**
 * Fetches live mid-market FX rates (PHP base) from the shared /api/fx-rates
 * endpoint. Used by any tool that needs to convert a foreign amount to pesos.
 */
export function useFxRates(): FxRateState {
  const [state, setState] = useState<FxRateState>(INITIAL);

  useEffect(() => {
    fetch("/api/fx-rates")
      .then((r) => r.json())
      .then((data: FxRatesResponse & { error?: string }) => {
        if (data.error) {
          setState((s) => ({ ...s, error: data.error ?? "Unknown error", loading: false }));
        } else {
          setState({
            rates: data.rates,
            currencies: data.currencies,
            timestamp: data.timestamp,
            source: data.source,
            error: null,
            loading: false,
          });
        }
      })
      .catch(() => {
        setState((s) => ({ ...s, error: "Network error fetching FX rates.", loading: false }));
      });
  }, []);

  return state;
}
