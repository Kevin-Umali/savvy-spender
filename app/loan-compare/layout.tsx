import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbLd, buildToolMetadata } from "@/app/_lib/seo";

export const metadata: Metadata = buildToolMetadata({
  title: "Car Financing Comparison",
  description:
    "Compare car loan options side by side — bank auto loans, in-house dealer financing, and credit-to-cash — with monthly amortization, total cost of ownership, and a priority-based recommendation.",
  path: "/loan-compare",
  keywords: [
    "car loan calculator philippines",
    "auto loan amortization philippines",
    "car financing comparison philippines",
    "in-house vs bank car financing",
    "monthly amortization car loan",
    "car loan interest rate philippines",
  ],
});

export default function LoanCompareLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Car Financing Comparison", path: "/loan-compare" },
        ])}
      />
      {children}
    </>
  );
}
