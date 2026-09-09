import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllProducts } from "@/lib/data/product-store";
import { siteConfig } from "@/lib/site-config";
import StarRating from "@/components/ui/StarRating";
import ProductImageGallery from "@/components/products/ProductImageGallery";
import BookingPanel from "@/components/products/BookingPanel";
import MobileStickyBar from "@/components/products/MobileStickyBar";
import CTAButton from "@/components/ui/CTAButton";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const items = await getAllProducts();
  return items.map((p) => ({ slug: p.slug }));
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = (await getAllProducts()).find(p => p.slug === params.slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.shortDescription,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const product = (await getAllProducts()).find(p => p.slug === params.slug);
  if (!product) notFound();

  return (
    <>
      <section className="pt-24 sm:pt-28">
        <div className="container-premium">
          <nav className="py-4 text-xs text-sand-200/50">
            <Link href="/" className="hover:text-teal-400">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/experiences" className="hover:text-teal-400">Experiences</Link>
            <span className="mx-2">/</span>
            <span className="text-sand-200/70">{product.categoryLabel}</span>
          </nav>

          <ProductImageGallery product={product} />
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container-premium grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <p className="eyebrow">{product.categoryLabel}</p>
            <h1 className="mt-2 font-display text-3xl sm:text-4xl font-medium text-sand-50">
              {product.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-sand-200/70">
              <div className="flex items-center gap-1.5">
                <StarRating rating={product.rating} />
                <span>({product.reviewCount} reviews on {product.ratingSource})</span>
              </div>
              <span aria-hidden="true">&middot;</span>
              <span>{product.duration}</span>
              <span aria-hidden="true">&middot;</span>
              <span>{product.experienceType}</span>
              {product.equipment && (
                <>
                  <span aria-hidden="true">&middot;</span>
                  <span>{product.equipment}</span>
                </>
              )}
              {product.maxPeople && (
                <>
                  <span aria-hidden="true">&middot;</span>
                  <span>Max {product.maxPeople} people</span>
                </>
              )}
            </div>

            <ul className="mt-6 flex flex-wrap gap-2">
              {product.highlights.map((h) => (
                <li
                  key={h}
                  className="rounded-full bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-sand-200/80"
                >
                  {h}
                </li>
              ))}
            </ul>

            <div className="mt-10 space-y-4 border-t border-white/10 pt-8">
              <h2 className="font-display text-xl font-medium text-sand-50">
                About This Experience
              </h2>
              {product.fullDescription.map((para, i) => (
                <p key={i} className="text-sm leading-relaxed text-sand-200/75">
                  {para}
                </p>
              ))}
            </div>

            {product.pricingTiers && (
              <div className="mt-10 border-t border-white/10 pt-8">
                <h2 className="font-display text-xl font-medium text-sand-50">
                  Group Pricing
                </h2>
                <p className="mt-2 text-sm text-sand-200/60">
                  Price per person decreases as your group grows. Full dynamic
                  pricing will be available at checkout in a future update.
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {product.pricingTiers.map((tier) => (
                    <div
                      key={tier.minPeople}
                      className="rounded-xl2 border border-white/10 bg-navy-800/50 px-3 py-2.5 text-center"
                    >
                      <p className="text-[11px] text-sand-200/50">
                        {tier.maxPeople
                          ? tier.minPeople === tier.maxPeople
                            ? `${tier.minPeople} pax`
                            : `${tier.minPeople}-${tier.maxPeople} pax`
                          : `${tier.minPeople}+ pax`}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-teal-400">
                        LKR {tier.pricePerPerson.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-10 grid grid-cols-1 gap-8 border-t border-white/10 pt-8 sm:grid-cols-2">
              <div>
                <h3 className="font-display text-lg font-medium text-sand-50">
                  What&apos;s Included
                </h3>
                <ul className="mt-3 space-y-2">
                  {product.included.map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-sand-200/75">
                      <CheckIcon /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-display text-lg font-medium text-sand-50">
                  What&apos;s Not Included
                </h3>
                <ul className="mt-3 space-y-2">
                  {product.excluded.map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-sand-200/60">
                      <CrossIcon /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-8 border-t border-white/10 pt-8 sm:grid-cols-2">
              <div>
                <h3 className="font-display text-lg font-medium text-sand-50">
                  Meeting Point
                </h3>
                <p className="mt-3 text-sm text-sand-200/75">{product.meetingPoint}</p>
                <CTAButton href={siteConfig.mapsLink} variant="ghost" className="mt-3">
                  Get Directions &rarr;
                </CTAButton>
              </div>
              <div>
                <h3 className="font-display text-lg font-medium text-sand-50">
                  Cancellation Policy
                </h3>
                <p className="mt-3 text-sm text-sand-200/75">
                  {product.cancellationPolicy}
                </p>
              </div>
            </div>

          </div>

          <div id="booking" className="pb-16 lg:pb-0">
            <BookingPanel product={product} />
          </div>
        </div>
      </section>

      <MobileStickyBar product={product} />
    </>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0 fill-none stroke-teal-400" strokeWidth="1.8">
      <path d="M4 10.5l3.5 3.5L16 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0 fill-none stroke-sand-200/40" strokeWidth="1.8">
      <path d="M6 6l8 8M14 6l-8 8" strokeLinecap="round" />
    </svg>
  );
}
