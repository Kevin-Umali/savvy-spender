"use client";

import { Button } from "@/components/ui/button";

export function SampleCallout({ onLoad }: { onLoad: () => void }) {
  return (
    <div className="rounded-md border border-dashed border-foreground/20 bg-muted/30 px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="space-y-1">
        <p className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-muted-foreground opacity-70">
          First time here?
        </p>
        <p className="text-sm">
          Not sure where to start? Load the{" "}
          <span className="font-medium">Toyota Yaris Cross 2026</span> sample to see how the
          comparison works.
        </p>
      </div>
      <Button
        onClick={onLoad}
        size="sm"
        className="font-mono-label text-[10px] uppercase tracking-[0.15em] shrink-0"
      >
        Try sample data
      </Button>
    </div>
  );
}
