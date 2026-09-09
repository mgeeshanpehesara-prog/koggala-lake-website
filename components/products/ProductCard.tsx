"use client";

import Link from "next/link";
import { Product } from "@/lib/types";
import SafeImage from "@/components/ui/SafeImage";
import { useCurrency } from "@/lib/currency/CurrencyContext";
import StarRating from "@/components/ui/StarRating";
import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export default function ProductCard({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const { displayPrice } = useCurrency();

  return (
    <Link
      href={`/experiences/${product.slug}`}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-xl3 border border-white/10 bg-navy-800/70 shadow-soft transition duration-500 ease-premium hover:-translate-y-1 hover:border-teal-500/35 hover:shadow-glow",
        className
      )}
    >
      <div className="relative h-64 w-full overflow-hidden sm:h-72">
        <SafeImage
          src={product.mainImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 380px"
          className="object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/10 to-transparent" />
        {product.badge && (
          <Badge className="absolute left-4 top-4 bg-gold-500 text-navy-950">{product.badge}</Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-teal-400">{product.categoryLabel}</p>
        <h3 className="mt-2 min-h-[3.5rem] font-display text-xl font-medium leading-tight text-sand-50 line-clamp-2 sm:text-2xl">
          {product.name}
        </h3>

        <div className="mt-3 flex items-center gap-2 text-sm text-sand-200/70">
          <StarRating rating={product.rating} />
          <span>({product.reviewCount.toLocaleString()} reviews)</span>
        </div>

        <div className="mt-4 flex min-h-[2.75rem] flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-sand-200/65">
          <span>{product.duration}</span>
          <span aria-hidden="true" className="text-teal-400">&middot;</span>
          <span>{product.experienceType}</span>
          {product.equipment && <><span aria-hidden="true" className="text-teal-400">&middot;</span><span>{product.equipment}</span></>}
        </div>

        <p className="mt-3 min-h-[2.75rem] text-sm leading-relaxed text-sand-200/65 line-clamp-2">{product.shortDescription}</p>

        <div className="mt-6 flex items-end justify-between gap-4 border-t border-white/10 pt-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sand-200/50">From</p>
            <p className="mt-1 font-display text-xl font-semibold text-teal-400">
              {displayPrice(product.priceBase.amount, product.priceBase.currency)}
              <span className="ml-1 text-xs font-sans font-normal text-sand-200/60">
                {product.priceBase.unit}
              </span>
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-teal-400/35 bg-teal-400/10 px-3 py-2 text-xs font-semibold text-teal-300 transition-all group-hover:gap-2 group-hover:bg-teal-400/20">
            Explore Experience
            <svg viewBox="0 0 16 16" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8">
              <path d="M2 8h11M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
