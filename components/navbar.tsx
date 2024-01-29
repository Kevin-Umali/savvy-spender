"use client";

import Image from "next/image";
import Link from "next/link";
import { GitHubLogoIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

const Navbar: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const toggleColorMode = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <nav className="flex w-full items-center justify-between p-4">
      {/* Logo on the left */}
      <Link href="/">
        <Image src="/android-chrome-512x512.png" alt="Logo" width={50} height={50} />
      </Link>

      <div className="flex-grow flex items-center justify-center space-x-4">
        <Link href="/">Calculator</Link>
        <Link href="/docs">Documentation</Link>
        <Link href="/bank-conversion-list">Bank Conversion List</Link>
        <Link
          href="https://apply.cc-pl.unionbankph.com/PLCC/StartApplication?media=4892822405&scode=DCMMEMRCE1&utm_source=DCMMEMRCE1&utm_medium=MGM&utm_campaign=DCMMEMRCE1"
          rel="noopener noreferrer"
          target="_blank"
        >
          Union Bank Referral Link
        </Link>
      </div>

      <div className="flex items-center space-x-2">
        <Link
          href="https://github.com/your-username/your-repo"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub repository"
        >
          <GitHubLogoIcon className="h-6 w-6" />
        </Link>
        <Button
          variant="ghost"
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          className="rounded-md p-2"
          onClick={toggleColorMode}
        >
          {theme === "light" ? (
            <MoonIcon className="h-6 w-6" aria-hidden="true" />
          ) : (
            <SunIcon className="h-6 w-6" aria-hidden="true" />
          )}
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
