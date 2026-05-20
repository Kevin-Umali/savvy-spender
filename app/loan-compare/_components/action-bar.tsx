"use client";

import { Button } from "@/components/ui/button";
import { UpdateIcon } from "@radix-ui/react-icons";

export function ActionBar({
  isLoading,
  onCompare,
  onLoadSample,
  onClear,
}: {
  isLoading: boolean;
  onCompare: () => void;
  onLoadSample: () => void;
  onClear: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        onClick={onCompare}
        disabled={isLoading}
        className="font-mono-label text-[11px] uppercase tracking-[0.15em]"
      >
        {isLoading ? (
          <>
            <UpdateIcon className="mr-2 h-3.5 w-3.5 animate-spin" />
            Calculating
          </>
        ) : (
          "Compare options"
        )}
      </Button>
      <Button
        variant="outline"
        onClick={onLoadSample}
        disabled={isLoading}
        className="font-mono-label text-[11px] uppercase tracking-[0.15em]"
      >
        Load sample data
      </Button>
      <Button
        variant="outline"
        onClick={onClear}
        disabled={isLoading}
        className="font-mono-label text-[11px] uppercase tracking-[0.15em]"
      >
        Clear all
      </Button>
    </div>
  );
}
