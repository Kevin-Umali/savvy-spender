import type { Metadata } from "next";
import { cleanMarkdown } from "@/lib/client";
import ReactMarkdown from "react-markdown";
import { BANK_CONVERSION_LIST_MD } from "@/constant/_bank-conversion-list-data";

export const metadata: Metadata = {
  title: "Savvy Spender - Bank Calculator Documentation",
  description:
    "Learn how payment calculations work with Savvy Spender's Balance Conversion, Credit-to-Cash or Loan Calculator Documentation. Understand the details behind calculating payments and comparing options.",
  keywords: [
    "Payment Calculator Documentation",
    "Calculating Payments",
    "Payment Calculation Explained",
    "Payment Comparison Documentation",
    "Financial Calculations",
    "Balance Conversion Calculator Documentation",
    "Balance Conversion Documentation",
    "Credit-to-Cash Calculator Documentation",
    "Credit-to-Cash Documentation",
    "Loan Calculator Documentation",
    "Loan Documentation",
  ],
  metadataBase: new URL("https://www.savvyspender.info/"),
  applicationName: "Savvy Spender Bank Calculator",
  openGraph: {
    type: "website",
    url: "https://www.savvyspender.info/",
    title: "Savvy Spender - Bank Calculator Documentation",
    description:
      "Learn how payment calculations work with Savvy Spender's Balance Conversion, Credit-to-Cash or Loan Calculator Documentation. Understand the details behind calculating payments and comparing options.",
  },
  twitter: {
    site: "https://www.savvyspender.info/",
    title: "Savvy Spender - Bank Calculator Documentation",
    description:
      "Learn how payment calculations work with Savvy Spender's Balance Conversion, Credit-to-Cash or Loan Calculator Documentation. Understand the details behind calculating payments and comparing options.",
  },
  referrer: "no-referrer-when-downgrade",
  formatDetection: {
    telephone: false,
  },
};

export default function Page() {
  return (
    <div className="container mx-auto p-5 sm:p-10">
      <div className="mb-10 text-center">
        <h1 className="mb-3 text-lg sm:text-xl lg:text-2xl">
          &ldquo;Savvy Spender&rdquo; Bank Transaction Conversion List
        </h1>
      </div>
      <div className="prose dark:prose-invert max-w-none">
        <ReactMarkdown>{cleanMarkdown(BANK_CONVERSION_LIST_MD)}</ReactMarkdown>
      </div>
    </div>
  );
}
