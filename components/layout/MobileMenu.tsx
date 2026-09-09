"use client";

import Link from "next/link";
import { useEffect } from "react";
import { siteConfig } from "@/lib/site-config";
import CurrencySelector from "@/components/ui/CurrencySelector";
import CTAButton from "@/components/ui/CTAButton";
import { whatsappLink } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  links: { href: string; label: string }[];
}

export default function MobileMenu({ open, onClose, links }: MobileMenuProps) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[60] lg:hidden transition-all duration-300 ease-premium",
        open ? "pointer-events-auto" : "pointer-events-none"
      )}
      aria-hidden={!open}
    >
      <div
        className={cn(
          "absolute inset-0 bg-navy-950/70 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />
      <div
        className={cn(
          "absolute right-0 top-0 h-full w-[85%] max-w-sm bg-navy-900 border-l border-white/10 shadow-lift transition-transform duration-300 ease-premium flex flex-col",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-6 h-20 border-b border-white/10">
          <span className="font-display text-lg font-semibold text-sand-50">
            Menu
          </span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-sand-50 hover:bg-white/10"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col gap-1 px-4 py-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="rounded-xl2 px-3 py-3.5 text-base font-medium text-sand-100 hover:bg-white/10"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto px-6 py-6 border-t border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-sand-200/70">Currency</span>
            <CurrencySelector />
          </div>
          <CTAButton href="/experiences" size="lg" className="w-full" onClick={onClose}>
            Book Now
          </CTAButton>
          <a
            href={whatsappLink(siteConfig.whatsapp, "Hi! I'd like to know more about your Koggala Lake tours.")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-full border border-teal-500/40 px-6 py-3 text-sm font-semibold text-teal-400"
          >
            WhatsApp Us
          </a>
        </div>
      </div>
    </div>
  );
}
