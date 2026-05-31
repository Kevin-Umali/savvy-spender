"use client";

import { Badge } from "@/components/ui/badge";
import type { PayoutCategory } from "../_lib/types";

const LABEL: Record<PayoutCategory, string> = {
  transfer: "Transfer",
  ewallet: "E-wallet",
  bank: "Bank / Remit",
  crypto: "Crypto",
};

export const CategoryBadge: React.FC<{ category: PayoutCategory }> = ({ category }) => (
  <Badge variant="outline" className="font-mono-label text-[9px] uppercase tracking-[0.12em]">
    {LABEL[category]}
  </Badge>
);
