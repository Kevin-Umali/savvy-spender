import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Toaster } from "@/components/ui/sonner";
import { Inter as FontSans } from "next/font/google";

import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";

const fontSans = FontSans({ subsets: ["latin"], variable: "--font-sans" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Savvy Spender - Bank Calculator",
  description:
    "Calculate your payment options with Savvy Spender's Balance Conversion, Credit-to-Cash or Loan Calculator. Compare full payment, installment, and 0% interest plans.",
  keywords: [
    "Payment Calculator",
    "Installment Calculator",
    "0% Interest Calculator",
    "Financial Calculator",
    "Payment Comparison",
    "Balance Conversion",
    "Balance Conversion Calculator",
    "Credit-to-Cash",
    "Credit-to-Cash Calculator",
    "Loan",
    "Loan Calculator",
  ],
  metadataBase: new URL("https://www.savvyspender.info/"),
  applicationName: "Savvy Spender Bank Calculator",
  openGraph: {
    type: "website",
    url: "https://www.savvyspender.info/",
    title: "Savvy Spender - Bank Calculator",
    description:
      "Calculate your payment options with Savvy Spender's Balance Conversion, Credit-to-Cash or Loan Calculator. Compare full payment, installment, and 0% interest plans.",
  },
  twitter: {
    site: "https://www.savvyspender.info/",
    title: "Savvy Spender - Bank Calculator",
    description:
      "Calculate your payment options with Savvy Spender's Balance Conversion, Credit-to-Cash or Loan Calculator. Compare full payment, installment, and 0% interest plans.",
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
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          {children}
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
