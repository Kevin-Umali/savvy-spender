import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: {
    default: "Savvy Spender - Philippine Financial Calculator",
    template: "%s | Savvy Spender",
  },
  description:
    "Free, open-source financial tools for Filipinos. Compare installment plans, calculate loans, salaries, taxes, and plan your retirement with interactive charts.",
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
      "Free, open-source financial tools for Filipinos. Compare installment plans, calculate loans, salaries, taxes, and more.",
  },
  twitter: {
    site: "https://www.savvyspender.info/",
    title: "Savvy Spender - Philippine Financial Calculator",
    description:
      "Free, open-source financial tools for Filipinos. Compare installment plans, calculate loans, salaries, taxes, and more.",
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
      <body className={cn("min-h-screen bg-background font-sans antialiased")}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          {children}
          <Footer />
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
