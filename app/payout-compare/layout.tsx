import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbLd, buildToolMetadata } from "@/app/_lib/seo";

export const metadata: Metadata = buildToolMetadata({
  title: "Freelancer Payout Comparison",
  description:
    "See which app nets a Filipino freelancer the most pesos — Wise, Payoneer, PayPal, GCash, banks, and crypto — after receiving fees, FX markup, and cash-out fees on a live mid-market rate.",
  path: "/payout-compare",
  keywords: [
    "wise vs payoneer philippines",
    "cheapest way to receive money from abroad philippines",
    "freelancer payment philippines",
    "payoneer fees philippines",
    "get paid in usd philippines",
    "wise vs paypal philippines",
  ],
});

export default function PayoutCompareLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Freelancer Payout Comparison", path: "/payout-compare" },
        ])}
      />
      {children}
    </>
  );
}
