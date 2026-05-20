import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Tool } from "../_lib/tools";

export function ToolCard({ tool, delay }: { tool: Tool; delay: number }) {
  const Icon = tool.icon;
  const isLive = tool.status === "live";

  const inner = (
    <div
      className={[
        "h-full rounded-sm border p-5 transition-colors relative",
        isLive
          ? "border-border hover:border-foreground/40 group-hover:bg-accent/30"
          : "border-dashed border-border opacity-60",
      ].join(" ")}
    >
      <div className="flex items-start justify-between mb-4">
        <Icon
          className={[
            "h-5 w-5 transition-opacity",
            isLive ? "text-foreground/70 group-hover:text-foreground" : "text-muted-foreground/50",
          ].join(" ")}
        />
        {isLive ? (
          <span className="font-mono-label text-[9px] uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
            ● Live
          </span>
        ) : (
          <span className="font-mono-label text-[9px] uppercase tracking-[0.18em] text-muted-foreground/70">
            {tool.eta}
          </span>
        )}
      </div>
      <h3 className="font-display font-light text-xl tracking-tight leading-tight">{tool.title}</h3>
      <p className="mt-2 text-[12px] text-muted-foreground leading-relaxed">{tool.desc}</p>
      {isLive && (
        <div className="mt-4 flex items-center justify-between">
          <span className="font-mono-label text-[10px] uppercase tracking-[0.15em] text-muted-foreground opacity-60">
            {tool.meta}
          </span>
          <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </div>
      )}
    </div>
  );

  const className = "group block h-full landing-reveal";
  const style = { animationDelay: `${100 + delay}ms` };

  if (isLive) {
    return (
      <Link href={tool.href} className={className} style={style}>
        {inner}
      </Link>
    );
  }
  return (
    <div className={className} style={style} aria-disabled="true">
      {inner}
    </div>
  );
}

export function SectionRule() {
  return (
    <div className="container mx-auto px-4" aria-hidden="true">
      <div className="h-px bg-border opacity-50" />
    </div>
  );
}
