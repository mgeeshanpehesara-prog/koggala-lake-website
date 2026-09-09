import PlatformLogo from "@/components/home/PlatformLogo";
import StarRating from "@/components/ui/StarRating";
import { getReviewPlatforms } from "@/lib/data/review-platforms";
import { getWebsiteContent } from "@/lib/data/website-content-store";

export default async function TrustBadges() {
  const content = await getWebsiteContent();
  const platforms = getReviewPlatforms(content.reviews);

  return (
    <section className="border-y border-white/5 bg-navy-900/60">
      <div className="container-premium grid grid-cols-1 gap-4 py-6 sm:grid-cols-3 sm:gap-6 sm:py-7">
        {platforms.map((platform) => {
          const hasRating = platform.settings.rating > 0 && platform.settings.reviewCount > 0;
          return (
            <div key={platform.key} className="flex items-center gap-3 rounded-xl2 px-2 py-1">
              <PlatformLogo name={platform.name} mark={platform.mark} uploadedUrl={platform.settings.logoUrl} fallbackUrl={platform.fallbackLogoUrl} />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-sand-50">{platform.name}</p>
                {hasRating ? <div className="flex items-center gap-2"><StarRating rating={platform.settings.rating} /><span className="text-xs text-sand-200/60">{platform.settings.reviewCount.toLocaleString()} reviews</span></div> : <p className="text-xs text-sand-200/50">Reviews coming soon</p>}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
