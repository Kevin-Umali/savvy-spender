import type { Metadata } from "next";
import { cleanMarkdown } from "@/lib";
import ReactMarkdown from "react-markdown";
import { GUIDE_MD } from "@/constant/_guide-data";

export const metadata: Metadata = {
  title: "Savvy Spender - Payment Calculator Documentation",
  description:
    "Learn how payment calculations work with Savvy Spender's Payment Calculator Documentation. Understand the details behind calculating payments and comparing options.",
  keywords: [
    "Payment Calculator Documentation",
    "Calculating Payments",
    "Payment Calculation Explained",
    "Payment Comparison Documentation",
    "Financial Calculations",
  ],
  metadataBase: new URL("https://www.savvyspendercalculator.com/"),
  applicationName: "Savvy Spender Calculator",
  openGraph: {
    type: "website",
    url: "https://www.savvyspendercalculator.com/",
    title: "Savvy Spender - Payment Calculator Documentation",
    description:
      "Learn how payment calculations work with Savvy Spender's Payment Calculator Documentation. Understand the details behind calculating payments and comparing options.",
  },
  twitter: {
    site: "https://www.savvyspendercalculator.com/",
    title: "Savvy Spender - Payment Calculator Documentation",
    description:
      "Learn how payment calculations work with Savvy Spender's Payment Calculator Documentation. Understand the details behind calculating payments and comparing options.",
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
        <h1 className="mb-3 text-lg sm:text-xl lg:text-2xl">&ldquo;Savvy Spender&rdquo; Documentation</h1>
      </div>
      <div className="prose dark:prose-invert max-w-none">
        <ReactMarkdown>{cleanMarkdown(GUIDE_MD)}</ReactMarkdown>
      </div>
    </div>
  );
}
