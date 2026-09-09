import CTAButton from "@/components/ui/CTAButton";
import SafeImage from "@/components/ui/SafeImage";
import { getWebsiteContent } from "@/lib/data/website-content-store";

export default async function AboutSection() {
  const { home } = await getWebsiteContent();
  return (
    <section className="py-20 sm:py-28">
      <div className="container-premium grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl3 order-2 lg:order-1">
          <SafeImage
            src={home.aboutImage}
            alt="Malish guiding a boat safari on Koggala Lake"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div className="order-1 lg:order-2">
          <p className="eyebrow mb-3">About Us</p>
          <h2 className="section-heading">{home.aboutTitle}</h2>
          <p className="section-subheading">
            {home.aboutDescription}
          </p>
          <div className="mt-8">
            <CTAButton href="/about" variant="secondary">
              Learn More &rarr;
            </CTAButton>
          </div>
        </div>
      </div>
    </section>
  );
}
