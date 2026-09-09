/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import CurrencySelector from "@/components/ui/CurrencySelector";
import { getWebsiteContent } from "@/lib/data/website-content-store";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/experiences", label: "Experiences" },
  { href: "/gallery", label: "Gallery" },
  { href: "/reviews", label: "Reviews" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

const experienceLinks = [
  { href: "/experiences/boat-safari", label: "Boat Safari" },
  { href: "/experiences/kayak", label: "Kayak Adventure" },
  { href: "/experiences/self-guided-kayak-rental", label: "Kayak Rental" },
];

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/cancellation", label: "Cancellation Policy" },
];

export default async function Footer() {
  const content = await getWebsiteContent();
  const { general } = content;
  const socialLinks = content.socialLinks.filter((link) => link.url);
  return (
    <footer className="bg-navy-fade border-t border-white/5">
      <div className="container-premium py-16 grid grid-cols-2 gap-10 lg:grid-cols-5">
        <div className="col-span-2">
          <p className="font-display text-xl font-semibold text-sand-50">
            Koggala Lake
          </p>
          <p className="text-xs uppercase tracking-[0.14em] text-teal-400 mt-1">
            Boat Safari &amp; Kayak Adventure with Malish
          </p>
          <p className="mt-4 text-sm text-sand-200/60 max-w-xs">
            {general.footerText}
          </p>
          <div className="mt-6 flex gap-3">
            {socialLinks.map((s) => (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name || s.platform}
                className="flex h-10 w-10 items-center justify-center rounded-full glass-panel text-sand-100 hover:text-teal-400 hover:-translate-y-0.5 transition-all duration-200"
              >
                {s.imageUrl ? <img src={s.imageUrl} alt="" className="h-4 w-4 object-contain" /> : <SocialIcon label={s.platform} />}
              </a>
            ))}
          </div>
        </div>

        <FooterColumn title="Quick Links" links={quickLinks} />
        <FooterColumn title="Experiences" links={experienceLinks} />

        <div>
          <p className="text-sm font-semibold text-sand-50 mb-4">Contact</p>
          <ul className="space-y-2 text-sm text-sand-200/70">
            <li>{general.contactPhone}</li>
            <li>
              <a
                  href={`https://wa.me/${general.whatsappNumber.replace(/[^\d]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-teal-400"
              >
                WhatsApp
              </a>
            </li>
            <li className="break-all">
              <a href={`mailto:${general.email}`} className="hover:text-teal-400">
                {general.email}
              </a>
            </li>
          </ul>
          <div className="mt-6">
            <CurrencySelector />
          </div>
        </div>
      </div>

      <div className="container-premium border-t border-white/5 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-sand-200/50">
          &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
        <div className="flex gap-5">
          {legalLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-xs text-sand-200/50 hover:text-teal-400"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-sand-50 mb-4">{title}</p>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-sm text-sand-200/70 hover:text-teal-400">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({ label }: { label: string }) {
  if (label === "Facebook") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
        <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V8c0-.9.25-1.5 1.55-1.5H16.7V3.7C16.2 3.6 15.1 3.5 13.8 3.5c-2.6 0-4.4 1.6-4.4 4.5v2H6.7v3.1h2.7v8h4.1z" />
      </svg>
    );
  }
  if (label === "Instagram") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.6">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (label === "WhatsApp") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.6">
        <path d="M5.5 18.5 4 21l3-.9A8.5 8.5 0 1 0 5.5 18.5Z" />
        <path d="M8.5 9.2c.2-.5.4-.5.7-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.2.1.4-.1.6l-.5.6c.5 1 1.3 1.7 2.3 2.2l.7-.6c.2-.2.4-.2.6-.1l1.5.7c.3.1.4.3.4.5-.1.7-.7 1.3-1.4 1.4-1.1.2-2.8-.6-4.2-1.9-1.4-1.3-2.1-3-1.7-4.9Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.6">
      <circle cx="12" cy="12" r="9" />
      <circle cx="8.5" cy="13" r="2.2" />
      <circle cx="15.5" cy="13" r="2.2" />
      <path d="M8.5 10.8V9.5M15.5 10.8V9.5" />
    </svg>
  );
}
