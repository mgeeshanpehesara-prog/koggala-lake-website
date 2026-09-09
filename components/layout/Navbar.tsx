"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import CurrencySelector from "@/components/ui/CurrencySelector";
import CTAButton from "@/components/ui/CTAButton";
import MobileMenu from "@/components/layout/MobileMenu";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/experiences", label: "Experiences" },
  { href: "/gallery", label: "Gallery" },
  { href: "/reviews", label: "Reviews" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-premium",
        scrolled
          ? "bg-navy-950/85 backdrop-blur-xl border-b border-white/10 shadow-soft"
          : "bg-gradient-to-b from-navy-950/70 to-transparent"
      )}
    >
      <div className="container-premium flex h-20 items-center justify-between">
        <Link href="/" className="flex flex-col leading-tight">
          <span className="font-display text-lg sm:text-xl font-semibold text-sand-50">
            Koggala Lake
          </span>
          <span className="text-[11px] sm:text-xs uppercase tracking-[0.14em] text-teal-400">
            Boat Safari &amp; Kayak Adventure <span className="text-sand-200/70">with Malish</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-sand-100/90 hover:text-teal-400 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <CurrencySelector />
          <CTAButton href="/experiences" size="md">
            Book Now
          </CTAButton>
        </div>

        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
          className="lg:hidden flex h-11 w-11 items-center justify-center rounded-full text-sand-50 hover:bg-white/10"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        links={NAV_LINKS}
      />
    </header>
  );
}
