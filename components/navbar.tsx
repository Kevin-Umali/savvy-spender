"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun, Menu, Github, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { TOOLS, SECONDARY_LINKS, type LiveTool } from "@/app/_lib/tools";

const LIVE_TOOLS = TOOLS.filter((tool): tool is LiveTool => tool.status === "live");

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false); // mobile sheet
  const [toolsOpen, setToolsOpen] = useState(false); // desktop dropdown
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  // Close the desktop dropdown on outside click and on navigation.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setToolsOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);
  useEffect(() => setToolsOpen(false), [pathname]);

  const toggleColorMode = () => setTheme(theme === "light" ? "dark" : "light");
  const isActive = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/android-chrome-512x512.png" alt="Savvy Spender" width={28} height={28} />
          <span className="font-display font-light text-lg hidden sm:inline">Savvy Spender</span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-1">
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setToolsOpen((o) => !o)}
              aria-expanded={toolsOpen}
              className={cn(
                "flex items-center gap-1 font-mono-label text-[10px] uppercase tracking-[0.15em] px-3 py-2 rounded-sm transition-colors",
                LIVE_TOOLS.some((t) => isActive(t.href))
                  ? "text-foreground"
                  : "text-muted-foreground opacity-60 hover:opacity-100"
              )}
            >
              Tools
              <ChevronDown className={cn("h-3 w-3 transition-transform", toolsOpen && "rotate-180")} />
            </button>
            {toolsOpen && (
              <div className="absolute left-0 top-full mt-1 w-72 rounded-md border bg-popover p-1 shadow-md z-50">
                {LIVE_TOOLS.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    onClick={() => setToolsOpen(false)}
                    className={cn(
                      "flex items-start gap-2.5 rounded-sm px-2.5 py-2 transition-colors hover:bg-accent",
                      isActive(tool.href) && "bg-accent"
                    )}
                  >
                    <tool.icon className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                    <span className="min-w-0">
                      <span className="block text-xs font-medium">{tool.title}</span>
                      <span className="block text-[10px] text-muted-foreground truncate">{tool.meta}</span>
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
          {SECONDARY_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "font-mono-label text-[10px] uppercase tracking-[0.15em] px-3 py-2 rounded-sm transition-colors",
                isActive(link.href) ? "text-foreground" : "text-muted-foreground opacity-60 hover:opacity-100"
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
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
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
                  <SheetTitle className="font-display font-light text-xl">Navigate</SheetTitle>
                  <SheetDescription>All tools, banks, and documentation.</SheetDescription>
                </SheetHeader>
                <div className="grid gap-1 py-4">
                  <p className="px-3 pt-2 pb-1 font-mono-label text-[9px] uppercase tracking-[0.2em] text-muted-foreground opacity-60">
                    Tools
                  </p>
                  {LIVE_TOOLS.map((tool) => (
                    <Button
                      key={tool.href}
                      variant="ghost"
                      className={cn(
                        "justify-start font-mono-label text-[11px] uppercase tracking-[0.1em]",
                        isActive(tool.href) && "text-foreground bg-accent"
                      )}
                      onClick={() => setOpen(false)}
                      asChild
                    >
                      <Link href={tool.href}>
                        <tool.icon className="mr-2 h-3.5 w-3.5" />
                        {tool.title}
                      </Link>
                    </Button>
                  ))}
                  <p className="px-3 pt-3 pb-1 font-mono-label text-[9px] uppercase tracking-[0.2em] text-muted-foreground opacity-60">
                    More
                  </p>
                  {SECONDARY_LINKS.map((link) => (
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
