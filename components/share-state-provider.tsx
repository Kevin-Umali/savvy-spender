"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
} from "react";
import { createSerializer, type ParserMap, type UrlKeys } from "nuqs/server";
import type { Values } from "nuqs";

type Snapshot = (params: URLSearchParams) => URLSearchParams;
const ShareContext = createContext<{
  register: (id: string, snapshot: Snapshot) => () => void;
  snapshotUrl: () => string;
} | null>(null);

/** Snapshot defaults too: a shared link must survive future default changes. */
export function ShareStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const snapshots = useRef(new Map<string, Snapshot>());
  const register = useCallback((id: string, snapshot: Snapshot) => {
    snapshots.current.set(id, snapshot);
    return () => {
      snapshots.current.delete(id);
    };
  }, []);
  const snapshotUrl = useCallback(() => {
    const url = new URL(window.location.href);
    let params = url.searchParams;
    snapshots.current.forEach((snapshot) => {
      params = snapshot(params);
    });
    url.search = params.toString();
    return url.href;
  }, []);
  const value = useMemo(
    () => ({ register, snapshotUrl }),
    [register, snapshotUrl],
  );
  return (
    <ShareContext.Provider value={value}>{children}</ShareContext.Provider>
  );
}

export function useShareSnapshot<T extends ParserMap>(
  parsers: T,
  values: Values<T>,
  urlKeys?: UrlKeys<T>,
) {
  const context = useContext(ShareContext);
  const id = useId();
  const snapshot = useCallback(
    (params: URLSearchParams) => {
      const serialize = createSerializer(parsers, {
        urlKeys,
        clearOnDefault: false,
      });
      return new URLSearchParams(
        serialize(params, values as Parameters<typeof serialize>[1]),
      );
    },
    [parsers, values, urlKeys],
  );
  useEffect(() => context?.register(id, snapshot), [context, id, snapshot]);
}

export function useShareUrl() {
  const context = useContext(ShareContext);
  if (!context)
    throw new Error("ShareStateProvider is required for tool links.");
  return context.snapshotUrl;
}
