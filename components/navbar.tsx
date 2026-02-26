"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun, Menu, Calculator, Wrench, BookOpen, Building2, Github } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

const NAV_LINKS = [
  { href: "/calculator", label: "Calculator", icon: Calculator },
  { href: "/tools", label: "Tools", icon: Wrench },
  { href: "/docs", label: "Docs", icon: BookOpen },
  { href: "/bank-conversion-list", label: "Banks", icon: Building2 },
];

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  const toggleColorMode = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/android-chrome-512x512.png" alt="Savvy Spender" width={28} height={28} />
          <span className="font-display italic font-light text-lg hidden sm:inline">Savvy Spender</span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "font-mono-label text-[10px] uppercase tracking-[0.15em] px-3 py-2 rounded-sm transition-colors",
                isActive(link.href)
                  ? "text-foreground"
                  : "text-muted-foreground opacity-60 hover:opacity-100"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <Link
            href="https://github.com/Kevin-Umali/savvy-spender"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub repository"
          >
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Github className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            onClick={toggleColorMode}
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>

          {/* Mobile menu */}
          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Open menu">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle className="font-display italic font-light text-xl">Navigate</SheetTitle>
                  <SheetDescription>
                    Calculators, tools, and documentation.
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-1 py-4">
                  {NAV_LINKS.map((link) => (
                    <Button
                      key={link.href}
                      variant="ghost"
                      className={cn(
                        "justify-start font-mono-label text-[11px] uppercase tracking-[0.1em]",
                        isActive(link.href) && "text-foreground bg-accent"
                      )}
                      onClick={() => setOpen(false)}
                      asChild
                    >
                      <Link href={link.href}>
                        <link.icon className="mr-2 h-3.5 w-3.5" />
                        {link.label}
                      </Link>
                    </Button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
