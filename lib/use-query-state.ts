"use client";

import { useCallback, useMemo } from "react";
import { useQueryStates } from "nuqs";
import {
  createToolParsers,
  type NumberBounds,
  type PrimitiveState,
} from "./query-parsers";
import { useShareSnapshot } from "@/components/share-state-provider";

/** Typed, route-local inputs backed by nuqs. Existing short keys are preserved.
 * Render inside Suspense; unrelated query keys and browser navigation stay intact. */
export function useQueryState<T extends PrimitiveState<T>>(
  defaults: T,
  codes: Record<keyof T, string>,
  bounds?: NumberBounds<T>,
): [T, (patch: Partial<T>) => void, () => void] {
  const parsers = useMemo(
    () => createToolParsers(defaults, bounds),
    [defaults, bounds],
  );
  const [state, setState] = useQueryStates(parsers, {
    urlKeys: codes,
    history: "replace",
    shallow: true,
    scroll: false,
  });
  useShareSnapshot(parsers, state, codes);
  const patch = useCallback(
    (p: Partial<T>) => {
      void setState(p as Parameters<typeof setState>[0]);
    },
    [setState],
  );
  const reset = useCallback(() => {
    void setState(null);
  }, [setState]);
  return [state as T, patch, reset];
}
