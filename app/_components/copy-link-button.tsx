"use client";

import { Link2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useQueryStates } from "nuqs";
import { useShareUrl } from "@/components/share-state-provider";

/** Copies the current URL (which encodes the tool's state) to the clipboard. */
export const CopyLinkButton: React.FC<{ disabled?: boolean }> = ({
  disabled = false,
}) => {
  const [, flush] = useQueryStates({});
  const snapshotUrl = useShareUrl();
  const copy = async () => {
    try {
      // Await pending URL updates before copying a just-edited scenario.
      await flush({});
      const url = snapshotUrl();
      await navigator.clipboard.writeText(url);
      if (url.length > 8000)
        toast.warning(
          "Long link copied. Some messaging apps may truncate it; check the full link before sending.",
        );
      toast.success("Link copied", {
        description:
          "Restores these inputs. Live rates and provider terms may change.",
      });
    } catch {
      toast.error("Couldn't copy — your browser blocked clipboard access.");
    }
  };
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={copy}
      disabled={disabled}
      className="gap-1.5"
    >
      <Link2 className="h-3.5 w-3.5" />
      Copy link
    </Button>
  );
};
