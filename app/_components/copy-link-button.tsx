"use client";

import { Link2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

/** Copies the current URL (which encodes the tool's state) to the clipboard. */
export const CopyLinkButton: React.FC = () => {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied", { description: "Anyone who opens it sees this exact scenario." });
    } catch {
      toast.error("Couldn't copy — your browser blocked clipboard access.");
    }
  };
  return (
    <Button variant="outline" size="sm" onClick={copy} className="gap-1.5">
      <Link2 className="h-3.5 w-3.5" />
      Copy link
    </Button>
  );
};
