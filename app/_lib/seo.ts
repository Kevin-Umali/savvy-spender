import type { Metadata } from "next";

/** Canonical site origin (matches the root metadataBase). */
export const SITE_URL = "https://www.savvyspender.info";

interface ToolMetaInput {
  title: string;
  description: string;
  path: string; // e.g. "/calculator"
  keywords: string[];
}

/**
 * Per-tool Metadata. The root layout supplies the "%s | Savvy Spender" title
 * template, so `title` here is the bare tool name; canonical + social tags are
 * filled from the path. Images are intentionally omitted (no OG art yet).
 */
export function buildToolMetadata({ title, description, path, keywords }: ToolMetaInput): Metadata {
  const url = `${SITE_URL}${path}`;
  const social = `${title} | Savvy Spender`;
  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: { type: "website", url, title: social, description },
    twitter: { card: "summary", site: SITE_URL, title: social, description },
  };
}

/** Schema.org WebApplication — the whole free finance toolkit. */
export function webApplicationLd(): object {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Savvy Spender",
    url: SITE_URL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    description:
      "Free, open-source Philippine financial tools — compare installment plans, credit-card forex, car financing, freelancer payouts, and rent vs. buy.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "PHP" },
  };
}

/** Schema.org FAQPage from question/answer pairs (rich-snippet eligible). */
export function faqPageLd(items: { q: string; a: string }[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

/** Schema.org BreadcrumbList: Home › <tool>. */
export function breadcrumbLd(items: { name: string; path: string }[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}
