import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import { siteConfig } from "@/lib/site-config";
import { whatsappLink } from "@/lib/utils";
import CTAButton from "@/components/ui/CTAButton";
import { getWebsiteContent } from "@/lib/data/website-content-store";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Koggala Lake Boat Safari & Kayak Adventure with Malish.",
};

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const { general } = await getWebsiteContent();
  const socials = [
    { label: "Facebook", href: general.facebook },
    { label: "Instagram", href: general.instagram },
    { label: "Tripadvisor", href: general.tripadvisor },
  ].filter((social) => social.href);
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Get in Touch"
        subtitle="Questions about a tour, group sizes or timing? We're happy to help."
      />
      <section className="py-14 sm:py-20">
        <div className="container-premium grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <ContactCard label="Phone" value={general.contactPhone} href={`tel:${general.contactPhone.replace(/\s/g, "")}`} />
          <ContactCard
            label="WhatsApp"
            value={general.whatsappNumber}
            href={whatsappLink(general.whatsappNumber, "Hi! I have a question about your Koggala Lake tours.")}
          />
          <ContactCard label="Email" value={general.email} href={`mailto:${general.email}`} />
          <ContactCard label="Meeting Point" value={general.meetingPoint} href={siteConfig.mapsLink} />
        </div>

        <div className="container-premium mt-14">
          <h2 className="font-display text-xl font-medium text-sand-50">Follow Us</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {socials.map((s) => (
              <CTAButton key={s.label} href={s.href} variant="secondary">
                {s.label}
              </CTAButton>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function ContactCard({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="card-lift rounded-xl2 glass-panel p-6 hover:border-teal-500/30"
    >
      <p className="text-xs uppercase tracking-wide text-sand-200/50">{label}</p>
      <p className="mt-2 font-display text-lg font-medium text-sand-50 break-words">
        {value}
      </p>
    </a>
  );
}
