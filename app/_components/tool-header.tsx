import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface ToolHeaderProps {
  title: string;
  description: React.ReactNode;
}

/** Standard tool page header: an "← All tools" breadcrumb, the h1, and intro. */
export const ToolHeader: React.FC<ToolHeaderProps> = ({ title, description }) => (
  <div className="mb-8 max-w-3xl">
    <Link
      href="/"
      className="inline-flex items-center gap-1 font-mono-label text-[10px] uppercase tracking-[0.2em] text-muted-foreground opacity-60 hover:opacity-100 transition-opacity mb-3"
    >
      <ArrowLeft className="h-3 w-3" />
      All tools
    </Link>
    <h1 className="font-display font-extralight text-3xl sm:text-4xl lg:text-5xl tracking-[-0.03em]">
      {title}
    </h1>
    <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">{description}</p>
  </div>
);
