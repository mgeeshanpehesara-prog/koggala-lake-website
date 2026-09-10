import CTAButton from "@/components/ui/CTAButton";
import SafeImage from "@/components/ui/SafeImage";
import { getWebsiteContent } from "@/lib/data/website-content-store";

export default async function Hero() {
  const { home } = await getWebsiteContent();
  return (
    <section className="relative flex min-h-[72vh] items-end overflow-hidden sm:min-h-[92vh]">
      <SafeImage
        src={home.heroImage}
        alt="Sunset over Koggala Lake with a private boat safari"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-hero-gradient" />

      <div className="container-premium relative z-10 pb-10 pt-28 sm:pb-28 sm:pt-40">
        <div className="max-w-2xl animate-fade-in-up">
          <span className="glass-panel inline-flex items-center rounded-full px-3 py-1 text-xs sm:px-4 sm:py-1.5 sm:text-sm font-semibold uppercase tracking-wide text-teal-300">
            {home.heroBadge}
          </span>

          <h1 className="mt-4 font-display text-3xl sm:mt-6 sm:text-5xl lg:text-6xl font-medium leading-[1.08] text-sand-50">
            {home.heroTitle}
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 sm:mt-5 sm:text-lg sm:leading-normal text-sand-100/80">
            {home.heroSubtitle}
          </p>

          <div className="mt-6 grid grid-cols-2 items-center gap-3 sm:mt-9 sm:flex sm:flex-wrap sm:gap-4">
            <CTAButton href="/experiences" size="lg" className="h-12 min-w-0 px-3 py-3 text-xs sm:h-auto sm:px-8 sm:py-4 sm:text-base">
              {home.primaryButtonText}
              <svg viewBox="0 0 16 16" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8">
                <path d="M2 8h11M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </CTAButton>
            <CTAButton href="/gallery" variant="secondary" size="lg" className="h-12 min-w-0 px-3 py-3 text-xs sm:h-auto sm:px-8 sm:py-4 sm:text-base">
              <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current">
                <path d="M6 4.5v11l9-5.5-9-5.5z" />
              </svg>
              {home.secondaryButtonText}
            </CTAButton>
          </div>
        </div>
      </div>
    </section>
  );
}
