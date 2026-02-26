import type { Metadata } from "next";
import { cleanMarkdown } from "@/lib/client";
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
    <div className="container mx-auto px-4 py-10">
      <div className="mb-10">
        <h1 className="font-display italic font-light text-3xl sm:text-4xl tracking-tight">Documentation</h1>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          How the calculations work.
        </p>
      </div>
      <div className="h-px bg-border opacity-50 mb-10" />
      <div className="prose dark:prose-invert max-w-none">
        <ReactMarkdown>{cleanMarkdown(GUIDE_MD)}</ReactMarkdown>
      </div>
    </div>
  );
}
