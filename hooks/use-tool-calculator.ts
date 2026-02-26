"use client";

import { useReducer, useCallback } from "react";

type ToolName =
  | "affordability"
  | "loan-comparison"
  | "early-payoff"
  | "rate-converter"
  | "break-even"
  | "in-house-loan"
  | "salary"
  | "tax"
  | "debt-planner"
  | "savings-goal"
  | "sss-loan"
  | "pagibig-loan"
  | "credit-card-payoff"
  | "car-loan"
  | "remittance"
  | "investment"
  | "retirement"
  | "emergency-fund";

interface State<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

type Action<T> =
  | { type: "LOADING" }
  | { type: "SUCCESS"; payload: T }
  | { type: "ERROR"; payload: string }
  | { type: "RESET" };

function createReducer<T>() {
  return function reducer(state: State<T>, action: Action<T>): State<T> {
    switch (action.type) {
      case "LOADING":
        return { ...state, isLoading: true, error: null };
      case "SUCCESS":
        return { data: action.payload, isLoading: false, error: null };
      case "ERROR":
        return { data: null, isLoading: false, error: action.payload };
      case "RESET":
        return { data: null, isLoading: false, error: null };
    }
  };
}

export function useToolCalculator<T>(tool: ToolName) {
  const reducer = createReducer<T>();
  const [state, dispatch] = useReducer(reducer, {
    data: null,
    isLoading: false,
    error: null,
  });

  const calculate = useCallback(
    async (params: Record<string, unknown>) => {
      dispatch({ type: "LOADING" });
      try {
        const res = await fetch("/api/tools", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tool, params }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || `Request failed (${res.status})`);
        }

        const data = (await res.json()) as T;
        dispatch({ type: "SUCCESS", payload: data });
        return data;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Calculation failed";
        dispatch({ type: "ERROR", payload: message });
        return null;
      }
    },
    [tool]
  );

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  return { ...state, calculate, reset };
}
