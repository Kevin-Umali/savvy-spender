import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ShareStateProvider } from "@/components/share-state-provider";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Savvy Spender - Philippine Financial Calculator",
    template: "%s | Savvy Spender",
  },
  description:
    "Free, open-source financial tools for Filipinos. Compare installments, car financing, card FX fees, payout estimates, rent versus buy, and Pag-IBIG property bids.",
  keywords: [
    "Philippine Financial Calculator",
    "Installment Calculator",
    "Salary Calculator Philippines",
    "Loan Calculator PH",
    "Tax Calculator TRAIN Law",
    "Balance Conversion Calculator",
    "Credit-to-Cash Calculator",
    "SSS Loan Calculator",
    "Pag-IBIG Loan Calculator",
    "Investment Calculator",
    "Retirement Calculator",
    "Debt Planner",
  ],
  metadataBase: new URL("https://www.savvyspender.info/"),
  applicationName: "Savvy Spender",
  openGraph: {
    type: "website",
    url: "https://www.savvyspender.info/",
    title: "Savvy Spender - Philippine Financial Calculator",
    description:
      "Free, open-source financial tools for Filipinos. Compare installments, financing, card FX fees, payout estimates, housing scenarios, and property bids.",
  },
  twitter: {
    site: "https://www.savvyspender.info/",
    title: "Savvy Spender - Philippine Financial Calculator",
    description:
      "Free, open-source financial tools for Filipinos. Compare installments, financing, card FX fees, payout estimates, housing scenarios, and property bids.",
  },
  referrer: "no-referrer-when-downgrade",
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn("min-h-screen bg-background font-sans antialiased")}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <TooltipProvider delayDuration={200}>
            <Navbar />
            <NuqsAdapter>
              <ShareStateProvider>{children}</ShareStateProvider>
            </NuqsAdapter>
            <Footer />
            <Toaster position="top-center" richColors />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
