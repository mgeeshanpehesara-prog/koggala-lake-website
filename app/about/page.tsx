import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import WhatsAppCTA from "@/components/home/WhatsAppCTA";
import SafeImage from "@/components/ui/SafeImage";
import { getWebsiteContent } from "@/lib/data/website-content-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Koggala Lake Boat Safari & Kayak Adventure with Malish.",
};

export default async function AboutPage() {
  const { about } = await getWebsiteContent();
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title={about.title}
      />
      <section className="py-14 sm:py-20">
        <div className="container-premium grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl3">
            <SafeImage
              src={about.images[0] || "https://picsum.photos/seed/koggala-about-full/1000/800"}
              alt="Boat safari on Koggala Lake"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="space-y-4 text-sm leading-relaxed text-sand-200/80">
            {about.sections.map((section) => <p key={section}>{section}</p>)}
          </div>
        </div>
      </section>
      <WhyChooseUs />
      <WhatsAppCTA />
    </>
  );
}
