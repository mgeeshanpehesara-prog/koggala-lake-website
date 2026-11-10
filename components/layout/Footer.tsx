/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import CurrencySelector from "@/components/ui/CurrencySelector";
import SocialIcon from "@/components/ui/SocialIcon";
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
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-and-conditions", label: "Terms & Conditions" },
  { href: "/return-policy", label: "Cancellation & Refund Policy" },
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
