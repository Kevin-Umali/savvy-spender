import { JsonLd } from "@/components/json-ld";
import { breadcrumbLd, buildToolMetadata } from "@/app/_lib/seo";
export const metadata = buildToolMetadata({
  title: "Pag-IBIG Bid & Financing Calculator",
  description: "Compare Pag-IBIG acquired-property bid discounts, cash and installment scenarios, down payments, and estimated monthly loan payments.",
  path: "/pagibig-bid",
  keywords: ["Pag-IBIG bid calculator", "acquired assets calculator", "bid discount calculator", "Pag-IBIG financing estimate"],
});
export default function PagibigBidLayout({ children }: { children: React.ReactNode }) {
  return <><JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Pag-IBIG Bid & Financing", path: "/pagibig-bid" }])} />{children}</>;
}
