"use client";

import { Link2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { encodeInput } from "../_lib/url-state";
import type { RentVsBuyInput } from "../_lib/types";

interface Props {
  input: RentVsBuyInput;
  onReset: () => void;
}

/** Copy a shareable link encoding the exact scenario, or reset to defaults. */
export const ShareBar: React.FC<Props> = ({ input, onReset }) => {
  const copyLink = async () => {
    const query = encodeInput(input);
    const url = `${window.location.origin}${window.location.pathname}${query ? `?${query}` : ""}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Shareable link copied", {
        description: "Anyone who opens it sees this exact scenario.",
      });
    } catch {
      toast.error("Couldn't copy — your browser blocked clipboard access.");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={copyLink} className="gap-1.5">
        <Link2 className="h-3.5 w-3.5" />
        Copy link
      </Button>
      <Button variant="ghost" size="sm" onClick={onReset} className="gap-1.5 text-muted-foreground">
        <RotateCcw className="h-3.5 w-3.5" />
        Reset
      </Button>
    </div>
  );
};
