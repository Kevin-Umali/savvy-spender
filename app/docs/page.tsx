import type { Metadata } from "next";
import { CarFinancingSection } from "./_components/car-financing-section";
import { Divider } from "./_components/doc-primitives";
import { FxSection } from "./_components/fx-section";
import { InstallmentSection } from "./_components/installment-section";
import { RentVsBuySection } from "./_components/rent-vs-buy-section";

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
