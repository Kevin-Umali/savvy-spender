"use client";

import Image from "next/image";
import Link from "next/link";
import {
  GitHubLogoIcon,
  MoonIcon,
  SunIcon,
  HamburgerMenuIcon,
  GlobeIcon,
  ReaderIcon,
  ListBulletIcon,
  InputIcon,
} from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);

  const { theme, setTheme } = useTheme();

  const toggleColorMode = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <nav className="flex w-full items-center justify-between p-4 shadow-sm">
      <Link href="/">
        <Image src="/android-chrome-512x512.png" alt="Logo" width={50} height={50} />
      </Link>

      {/* Middle navigation links hidden on mobile */}
      <div className="hidden md:flex-grow md:flex md:items-center md:justify-center space-x-4">
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
          href="https://github.com/Kevin-Umali/savvy-spender"
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

        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button aria-label="Open menu" className="p-2">
                <HamburgerMenuIcon className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
                <SheetDescription>
                  This action cannot be undone. This will permanently delete your account and remove your data from our
                  servers.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-3 py-3">
                <Button variant="ghost" className="justify-start" onClick={() => setOpen(!open)}>
                  <InputIcon className="mr-2 h-4 w-4" />
                  <Link href="/">Calculator</Link>
                </Button>
                <Button variant="ghost" className="justify-start" onClick={() => setOpen(!open)}>
                  <ReaderIcon className="mr-2 h-4 w-4" />
                  <Link href="/docs">Documentation</Link>
                </Button>
                <Button variant="ghost" className="justify-start" onClick={() => setOpen(!open)}>
                  <ListBulletIcon className="mr-2 h-4 w-4" />
                  <Link href="/bank-conversion-list">Bank Conversion List</Link>
                </Button>
                <Button variant="ghost" className="justify-start" onClick={() => setOpen(!open)}>
                  <GlobeIcon className="mr-2 h-4 w-4" />
                  <Link
                    href="https://apply.cc-pl.unionbankph.com/PLCC/StartApplication?media=4892822405&scode=DCMMEMRCE1&utm_source=DCMMEMRCE1&utm_medium=MGM&utm_campaign=DCMMEMRCE1"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Union Bank Referral Link
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
