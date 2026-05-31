import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbLd, buildToolMetadata } from "@/app/_lib/seo";

export const metadata: Metadata = buildToolMetadata({
  title: "Installment Calculator",
  description:
    "Compare credit-card balance conversion, credit-to-cash, and personal loan installment plans across terms. See the monthly payment, effective interest rate (EIR), and full amortization schedule.",
  path: "/calculator",
  keywords: [
    "installment calculator philippines",
    "balance conversion calculator",
    "credit to cash calculator",
    "monthly amortization",
    "effective interest rate calculator",
    "credit card installment philippines",
  ],
});

export default function CalculatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Installment Calculator", path: "/calculator" },
        ])}
      />
      {children}
    </>
  );
}
