"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SectionLabel } from "./form-controls";

export function TableShell({
  title,
  caption,
  children,
}: {
  title: string;
  caption?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <SectionLabel>{title}</SectionLabel>
        {caption && (
          <CardTitle className="font-display font-light text-lg tracking-tight">{caption}</CardTitle>
        )}
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto -mx-6 px-6">{children}</div>
      </CardContent>
    </Card>
  );
}

export const HeaderRow: React.FC<{ cols: string[] }> = ({ cols }) => (
  <tr className="border-b">
    {cols.map((c, i) => (
      <th
        key={c}
        className={cn(
          "font-mono-label text-[10px] uppercase tracking-[0.18em] text-muted-foreground opacity-60 py-2 px-3",
          i === 0 ? "text-left" : "text-right"
        )}
      >
        {c}
      </th>
    ))}
  </tr>
);

export const Td: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => <td className={cn("py-2 px-3 text-sm", className)}>{children}</td>;

export const TdNum: React.FC<{
  children: React.ReactNode;
  strong?: boolean;
  className?: string;
}> = ({ children, strong, className }) => (
  <td className={cn("py-2 px-3 text-right tabular-nums text-sm", strong && "font-semibold", className)}>
    {children}
  </td>
);

export const Row: React.FC<{ label: string; value: string; sub?: string }> = ({
  label,
  value,
  sub,
}) => (
  <tr>
    <td className="py-2 px-3 text-[12px] text-muted-foreground">{label}</td>
    <td className="py-2 px-3 text-right">
      <div className="text-sm font-medium">{value}</div>
      {sub && <div className="text-[11px] text-muted-foreground tabular-nums">{sub}</div>}
    </td>
  </tr>
);
