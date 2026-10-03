"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyLinkButton } from "@/app/_components/copy-link-button";

interface Props {
  onReset: () => void;
}

/** Copy a shareable link encoding the exact scenario, or reset to defaults. */
export const ShareBar: React.FC<Props> = ({ onReset }) => {
  return (
    <div className="flex items-center gap-2">
      <CopyLinkButton />
      <Button
        variant="ghost"
        size="sm"
        onClick={onReset}
        className="gap-1.5 text-muted-foreground"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Reset
      </Button>
    </div>
  );
};
