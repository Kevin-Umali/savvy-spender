import type { Metadata } from "next";
import { CreditCardSection } from "./_components/credit-card-section";
import { GovernmentSection } from "./_components/government-section";
import { PersonalLoansSection } from "./_components/personal-loans-section";
import { ReferenceSection } from "./_components/reference-section";
import { SecuredLoansSection } from "./_components/secured-loans-section";
import { Divider } from "./_components/section-primitives";

export const metadata: Metadata = {
  title: "Savvy Spender - Bank Calculator Documentation",
  description:
    "Philippine financial products reference: credit card installment programs, personal loans, SSS salary loans, Pag-IBIG housing loans, and auto financing rates.",
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
      "Philippine financial products reference: credit card installment programs, personal loans, SSS salary loans, Pag-IBIG housing loans, and auto financing rates.",
  },
  twitter: {
    site: "https://www.savvyspender.info/",
    title: "Savvy Spender - Bank Calculator Documentation",
    description:
      "Philippine financial products reference: credit card installment programs, personal loans, SSS salary loans, Pag-IBIG housing loans, and auto financing rates.",
  },
  referrer: "no-referrer-when-downgrade",
  formatDetection: { telephone: false },
};

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="mb-10">
        <p className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-muted-foreground opacity-60 mb-3">
          Reference
        </p>
        <h1 className="font-display font-extralight text-3xl sm:text-4xl tracking-[-0.03em]">
          Financial Products List
        </h1>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          Philippine bank and government financial products — rates, terms, and fees for reference.
          Always verify directly with the institution before making decisions.
        </p>
      </div>
      <Divider strong />

      <CreditCardSection />
      <Divider strong />

      <PersonalLoansSection />
      <Divider strong />

      <GovernmentSection />
      <Divider strong />

      <SecuredLoansSection />
      <Divider strong />

      <ReferenceSection />
      <Divider strong />

      <p className="text-xs text-muted-foreground leading-relaxed">
        Rates, fees, and terms shown are based on publicly available information and are subject to
        change. Promo rates are often invitation-only or limited-time. Always verify directly with
        the bank or institution before making any financial decision.
      </p>
    </div>
  );
}
