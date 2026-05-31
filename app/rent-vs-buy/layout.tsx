import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbLd, buildToolMetadata } from "@/app/_lib/seo";

export const metadata: Metadata = buildToolMetadata({
  title: "Rent vs. Buy a Home",
  description:
    "Should you buy a condo or keep renting and invest the difference? A year-by-year wealth simulation for the Philippines — mortgage, amilyar, dues, appreciation — with the break-even year and the probability buying wins.",
  path: "/rent-vs-buy",
  keywords: [
    "rent vs buy calculator philippines",
    "should i buy a condo philippines",
    "rent or buy house philippines",
    "condo investment calculator philippines",
    "break even rent vs buy",
    "mortgage vs rent philippines",
  ],
});

export default function RentVsBuyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Rent vs. Buy a Home", path: "/rent-vs-buy" },
        ])}
      />
      {children}
    </>
  );
}
