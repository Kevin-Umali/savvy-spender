import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbLd, buildToolMetadata } from "@/app/_lib/seo";

export const metadata: Metadata = buildToolMetadata({
  title: "Card FX Comparison",
  description:
    "Compare verified Philippine card-specific foreign transaction fees with issuer sources. Estimate peso costs using a reference FX rate; actual conversion rates and promo eligibility vary.",
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

export default function FxCompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
