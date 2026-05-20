"use client";

import { Button } from "@/components/ui/button";

export function EmptyResults({ onLoadSample }: { onLoadSample: () => void }) {
  return (
    <div className="border border-dashed rounded-md p-10 text-center">
      <p className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-muted-foreground opacity-60 mb-3">
        No comparison yet
      </p>
      <h2 className="font-display font-light text-xl sm:text-2xl mb-2">
        Fill in the form above, or try sample data
      </h2>
      <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
        Once you&apos;ve entered the vehicle and at least one financing option, hit Compare to see
        upfront cash, monthly payments, and lifecycle cost side by side.
      </p>
      <Button
        onClick={onLoadSample}
        className="mt-5 font-mono-label text-[11px] uppercase tracking-[0.15em]"
      >
        Try sample data
      </Button>
    </div>
  );
}
