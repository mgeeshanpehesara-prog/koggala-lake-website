import SectionHeading from "@/components/ui/SectionHeading";
import CTAButton from "@/components/ui/CTAButton";
import ReviewCard from "@/components/reviews/ReviewCard";
import StarRating from "@/components/ui/StarRating";
import PlatformLogo from "@/components/home/PlatformLogo";
import ReviewPlatformLinks from "@/components/home/ReviewPlatformLinks";
import { getFeaturedReviews } from "@/lib/data/reviews-store";
import { getWebsiteContent } from "@/lib/data/website-content-store";
import { getPlatformLinks, getReviewPlatforms } from "@/lib/data/review-platforms";

function PlatformMark({ platform }: { platform: ReturnType<typeof getReviewPlatforms>[number] }) {
  return <PlatformLogo name={platform.name} mark={platform.mark} uploadedUrl={platform.settings.logoUrl} fallbackUrl={platform.fallbackLogoUrl} />;
}

export default async function ReviewsSection() {
  const [reviews, content] = await Promise.all([getFeaturedReviews(), getWebsiteContent()]);
  const settings = content.reviews;
  const platforms = getReviewPlatforms(settings);
  const calculatedTotal = platforms.reduce((total, platform) => total + Math.max(0, platform.settings.reviewCount || 0), 0);
  const totalReviews = settings.totalReviewsOverride ?? calculatedTotal;
  const hasPlatformRating = (platform: (typeof platforms)[number]) => platform.settings.rating > 0 && platform.settings.reviewCount > 0;
  return (
    <section className="bg-navy-900/40 py-20 sm:py-28">
      <div className="container-premium">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading eyebrow="Reviews" title={settings.heading} subtitle={settings.subtitle} />
          <CTAButton href="/reviews" variant="ghost" className="hidden sm:inline-flex">
            Read All Reviews &rarr;
          </CTAButton>
        </div>

        <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {platforms.map((platform) => (
            <article key={platform.key} className="review-platform-card group flex min-h-[180px] flex-col rounded-xl2 border border-white/10 bg-navy-800/50 p-5 transition duration-300 hover:-translate-y-1 hover:border-teal-400/40 hover:bg-navy-800/80">
              <div className="flex items-center gap-4">
                <PlatformMark platform={platform} />
                <div><h3 className="font-display text-lg font-medium text-sand-50">{platform.name}</h3>{hasPlatformRating(platform) && <StarRating rating={platform.settings.rating} className="mt-1" />}</div>
              </div>
              <div className="mt-3 min-h-[2.5rem] text-sm text-sand-200/65">{hasPlatformRating(platform) ? <p>{platform.settings.reviewCount.toLocaleString()} reviews from travelers</p> : <p className="text-sand-200/45">Reviews coming soon</p>}</div>
              <ReviewPlatformLinks platformName={platform.name} links={getPlatformLinks(platform)} action={platform.action} />
            </article>
          ))}
        </div>

        <div className="mt-7 flex flex-col items-center justify-center gap-3 rounded-xl2 border border-teal-400/20 bg-navy-800/45 px-6 py-7 text-center shadow-soft sm:flex-row sm:gap-6 sm:px-8 sm:text-left">
          <div className="flex gap-0.5 text-gold-400" aria-label="Five star social proof"><span aria-hidden="true">★</span><span aria-hidden="true">★</span><span aria-hidden="true">★</span><span aria-hidden="true">★</span><span aria-hidden="true">★</span></div>
          <div><p className="font-display text-2xl font-semibold text-sand-50">{totalReviews.toLocaleString()}+ Happy Traveler Reviews</p><p className="mt-1 text-sm text-sand-200/60">Across Google, GetYourGuide &amp; Tripadvisor</p></div>
        </div>

        {reviews.length > 0 && <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">{reviews.slice(0, 3).map((review) => <ReviewCard key={review.id} review={review} />)}</div>}

        <div className="mt-8 sm:hidden">
          <CTAButton href="/reviews" variant="secondary" className="w-full">
            Read All Reviews &rarr;
          </CTAButton>
        </div>
      </div>
    </section>
  );
}
