"use client";

import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SectionLabel } from "./form-controls";

export type ColumnAlign = "left" | "right";

interface TableShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

/** Card wrapper for a results table. Children should be a <HeaderRow/> + <tbody>. */
export const TableShell: React.FC<TableShellProps> = ({ title, subtitle, children }) => (
  <Card className="border-border">
    <CardHeader className="pb-3">
      <SectionLabel>{title}</SectionLabel>
      {subtitle && (
        <CardTitle className="font-display font-light text-sm text-muted-foreground tracking-tight">
          {subtitle}
        </CardTitle>
      )}
    </CardHeader>
    <CardContent>
      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full text-sm">{children}</table>
      </div>
    </CardContent>
  </Card>
);

interface HeaderRowProps {
  cols: string[];
  align?: ColumnAlign[];
}

export const HeaderRow: React.FC<HeaderRowProps> = ({ cols, align }) => (
  <thead>
    <tr className="border-b">
      {cols.map((col, i) => (
        <th
          key={col}
          className={cn(
            "font-mono-label text-[10px] uppercase tracking-[0.18em] text-muted-foreground opacity-60 py-2 px-3",
            (align?.[i] ?? (i === 0 ? "left" : "right")) === "right" ? "text-right" : "text-left"
          )}
        >
          {col}
        </th>
      ))}
    </tr>
  </thead>
);

interface RowProps {
  children: ReactNode;
  className?: string;
}

export const Row: React.FC<RowProps> = ({ children, className }) => (
  <tr className={cn("border-b last:border-0", className)}>{children}</tr>
);

interface CellProps {
  children?: ReactNode;
  className?: string;
}

export const Td: React.FC<CellProps> = ({ children, className }) => (
  <td className={cn("py-2 px-3 align-top", className)}>{children}</td>
);

interface NumCellProps extends CellProps {
  strong?: boolean;
}

export const TdNum: React.FC<NumCellProps> = ({ children, strong, className }) => (
  <td
    className={cn(
      "py-2 px-3 text-right tabular-nums align-top",
      strong && "font-semibold",
      className
    )}
  >
    {children}
  </td>
);
