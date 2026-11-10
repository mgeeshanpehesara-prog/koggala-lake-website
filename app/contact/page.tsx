import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import { siteConfig } from "@/lib/site-config";
import { whatsappLink } from "@/lib/utils";
import { getWebsiteContent } from "@/lib/data/website-content-store";
import SocialIcon from "@/components/ui/SocialIcon";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Koggala Lake Boat Safari & Kayak Adventure with Malish.",
};

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const content = await getWebsiteContent();
  const { general } = content;
  const socials = content.socialLinks.filter((social) =>
    ["Facebook", "Instagram", "TikTok"].includes(social.platform) && social.url
  );
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
            {socials.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name || social.platform}
                className="group inline-flex items-center gap-2 rounded-full glass-panel px-6 py-3 text-sm font-semibold tracking-wide text-sand-50 transition-all duration-200 hover:bg-white/10 hover:-translate-y-0.5"
              >
                <SocialIcon label={social.platform} />
                {social.platform}
              </a>
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
