import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbLd, buildToolMetadata } from "@/app/_lib/seo";

export const metadata: Metadata = buildToolMetadata({
  title: "Card FX Comparison",
  description:
    "Find the Philippine credit card with the lowest foreign transaction fee. Compare forex markups across 30+ cards and simulate the peso cost of any foreign or online purchase on live rates.",
  path: "/fx-compare",
  keywords: [
    "no foreign transaction fee credit card philippines",
    "credit card forex markup philippines",
    "best card for online shopping abroad",
    "0% forex credit card philippines",
    "visa mastercard foreign transaction fee",
    "card fx comparison",
  ],
});

export default function FxCompareLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Card FX Comparison", path: "/fx-compare" },
        ])}
      />
      {children}
    </>
  );
}
