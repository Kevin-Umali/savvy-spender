import type { Metadata } from "next";
import { CarFinancingSection } from "./_components/car-financing-section";
import { Divider } from "./_components/doc-primitives";
import { FxSection } from "./_components/fx-section";
import { InstallmentSection } from "./_components/installment-section";
import { RentVsBuySection } from "./_components/rent-vs-buy-section";
import { JsonLd } from "@/components/json-ld";
import { faqPageLd } from "@/app/_lib/seo";

const FAQ = [
  {
    q: "Which Philippine credit card has the lowest foreign transaction fee?",
    a: "Forex markups range from 0% on a few cards (e.g. some UnionBank and promo cards) up to ~3.5% on standard cards. The Card FX Comparison tool ranks 30+ PH cards by their all-in markup and simulates the peso cost of a purchase on live rates.",
  },
  {
    q: "Is Wise or Payoneer cheaper for Filipino freelancers?",
    a: "Wise usually converts closest to the mid-market rate (under ~1%), while Payoneer adds roughly 2% plus a possible annual inactivity fee. The Freelancer Payout Comparison computes the net pesos each option leaves after receiving, FX, and cash-out fees.",
  },
  {
    q: "What is balance conversion and credit-to-cash?",
    a: "Balance conversion turns an existing credit-card balance into fixed monthly installments at a quoted monthly rate; credit-to-cash disburses cash against your credit limit on similar terms. The Installment Calculator compares both, including the effective interest rate.",
  },
  {
    q: "Should I rent or buy a condo in the Philippines?",
    a: "It depends on appreciation, your mortgage rate, rent, and the return you'd earn investing your down payment instead. The Rent vs. Buy tool runs a year-by-year wealth simulation and shows the break-even year plus the probability buying wins.",
  },
  {
    q: "How is car loan monthly amortization computed?",
    a: "Most PH banks quote an add-on rate or an effective rate; the monthly payment is a standard annuity on the financed amount. The Car Financing Comparison converts any rate mode into a monthly payment and total cost so options compare fairly.",
  },
];

export const metadata: Metadata = {
  title: "Savvy Spender - Documentation",
  description:
    "How each calculator works — inputs, formulas, and what the results mean. Covers the Installment Calculator, Card FX Comparison, Car Financing Comparison, and Rent vs. Buy a Home tools.",
  keywords: [
    "Payment Calculator Documentation",
    "Installment Calculator Documentation",
    "Card FX Comparison Documentation",
    "Car Financing Comparison Documentation",
    "Rent vs Buy Calculator Philippines",
    "Balance Conversion Calculator",
    "Credit-to-Cash Calculator",
    "Financial Calculations Philippines",
  ],
  metadataBase: new URL("https://www.savvyspender.info/"),
  applicationName: "Savvy Spender",
  openGraph: {
    type: "website",
    url: "https://www.savvyspender.info/docs",
    title: "Savvy Spender - Documentation",
    description: "How each calculator works — inputs, formulas, and what the results mean.",
  },
  twitter: {
    site: "https://www.savvyspender.info/",
    title: "Savvy Spender - Documentation",
    description: "How each calculator works — inputs, formulas, and what the results mean.",
  },
  referrer: "no-referrer-when-downgrade",
  formatDetection: { telephone: false },
};

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <JsonLd data={faqPageLd(FAQ)} />
      <div className="mb-10">
        <p className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-muted-foreground opacity-60 mb-3">
          Reference
        </p>
        <h1 className="font-display font-extralight text-3xl sm:text-4xl tracking-[-0.03em]">
          Documentation
        </h1>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          How each calculator works — inputs, formulas, and what the results mean.
        </p>
      </div>
      <Divider strong />

      <InstallmentSection />
      <Divider strong />

      <FxSection />
      <Divider strong />

      <CarFinancingSection />
      <Divider strong />

      <RentVsBuySection />
      <Divider strong />

      <p className="text-xs text-muted-foreground leading-relaxed">
        All calculations are for reference purposes only. Rates, fees, and regulatory requirements
        change over time. Always verify details directly with the relevant bank or financial
        institution before making any financial decision.
      </p>
    </div>
  );
}
