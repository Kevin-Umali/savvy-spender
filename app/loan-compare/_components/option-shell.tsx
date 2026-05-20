"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FINANCING_META, type FinancingKey } from "../_lib/options";
import { SectionLabel } from "./form-controls";

export const OptionShell: React.FC<{
  meta: (typeof FINANCING_META)[FinancingKey];
  children: React.ReactNode;
}> = ({ meta, children }) => (
  <Card className="border-border h-full">
    <CardHeader className="pb-3">
      <SectionLabel>Option</SectionLabel>
      <CardTitle className="font-display font-light text-lg tracking-tight">{meta.label}</CardTitle>
      <p className="text-[11px] text-muted-foreground leading-relaxed">{meta.tagline}</p>
    </CardHeader>
    <CardContent className="space-y-4">{children}</CardContent>
  </Card>
);
