/* eslint-disable @next/next/no-img-element */
import SectionHeading from "@/components/ui/SectionHeading";
import { getWebsiteContent } from "@/lib/data/website-content-store";

export default async function SocialMediaSection() {
  const socialLinks = (await getWebsiteContent()).socialLinks.filter((link) => link.url);

  if (!socialLinks.length) return null;

  return (
    <section className="border-t border-white/5 bg-navy-900/30 py-14 sm:py-16">
      <div className="container-premium">
        <SectionHeading eyebrow="Stay Connected" title="Follow the Lake" subtitle="Keep up with Koggala Lake adventures and local moments." />
        <div className="mt-7 flex flex-wrap gap-3">
          {socialLinks.map((social) => (
            <a
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-w-[180px] items-center gap-3 rounded-xl2 border border-white/10 bg-navy-800/50 px-4 py-3 transition duration-300 hover:-translate-y-0.5 hover:border-teal-400/35 hover:bg-navy-800/80"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-sand-100">
                {social.imageUrl ? <img src={social.imageUrl} alt="" className="h-5 w-5 object-contain" /> : <span className="text-xs font-semibold text-teal-400">{social.platform.slice(0, 2).toUpperCase()}</span>}
              </span>
              <span className="min-w-0"><span className="block truncate text-sm font-semibold text-sand-50">{social.name || social.platform}</span><span className="block text-xs text-sand-200/50">{social.platform}</span></span>
              <span className="ml-auto text-teal-400 transition-transform group-hover:translate-x-1" aria-hidden="true">&rarr;</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
