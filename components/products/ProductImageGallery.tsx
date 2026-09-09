"use client";

import { useEffect, useMemo, useState, type TouchEvent } from "react";
import Badge from "@/components/ui/Badge";
import SafeImage from "@/components/ui/SafeImage";
import type { Product } from "@/lib/types";

const IMAGES_PER_PAGE = 5;

type ProductImageGalleryProps = {
  product: Product;
};

export default function ProductImageGallery({ product }: ProductImageGalleryProps) {
  const images = useMemo(
    () => [product.mainImage, ...product.galleryImages].filter(Boolean),
    [product.mainImage, product.galleryImages]
  );
  const [page, setPage] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const pageCount = Math.max(1, Math.ceil(images.length / IMAGES_PER_PAGE));
  const pageImages = images.slice(page * IMAGES_PER_PAGE, (page + 1) * IMAGES_PER_PAGE);
  const hasNavigation = pageCount > 1;

  useEffect(() => {
    setPage(0);
  }, [product.slug, images.length]);

  const goToPage = (nextPage: number) => {
    setPage(Math.max(0, Math.min(nextPage, pageCount - 1)));
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    setTouchStart(event.changedTouches[0]?.clientX ?? null);
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStart === null || !hasNavigation) return;
    const distance = (event.changedTouches[0]?.clientX ?? touchStart) - touchStart;
    if (Math.abs(distance) > 45) goToPage(page + (distance < 0 ? 1 : -1));
    setTouchStart(null);
  };

  return (
    <div
      className="relative"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-4 sm:gap-3 rounded-xl3 overflow-hidden">
        {pageImages.map((src, index) => {
          const imageIndex = page * IMAGES_PER_PAGE + index;
          const isLeadImage = index === 0;
          return (
            <div
              key={`${src}-${imageIndex}`}
              className={isLeadImage ? "relative aspect-[4/3] sm:aspect-auto sm:col-span-2 sm:row-span-2" : "relative hidden aspect-square sm:block"}
            >
              <SafeImage
                src={src}
                alt={`${product.name} photo ${imageIndex + 1}`}
                fill
                priority={page === 0 && isLeadImage}
                sizes={isLeadImage ? "(max-width: 640px) 100vw, 50vw" : "25vw"}
                className="object-cover"
              />
              {page === 0 && isLeadImage && product.badge && (
                <Badge className="absolute left-4 top-4">{product.badge}</Badge>
              )}
            </div>
          );
        })}
      </div>

      {hasNavigation && (
        <div className="absolute inset-x-0 bottom-3 flex items-center justify-between px-3 sm:bottom-4 sm:px-4">
          <button
            type="button"
            onClick={() => goToPage(page - 1)}
            disabled={page === 0}
            aria-label="Previous product photos"
            className="rounded-full border border-white/20 bg-navy-950/75 px-3 py-2 text-sm font-semibold text-sand-50 backdrop-blur transition hover:bg-navy-950 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span aria-hidden="true">&larr;</span> Previous
          </button>
          <span className="rounded-full bg-navy-950/75 px-3 py-2 text-xs font-medium text-sand-100 backdrop-blur">
            {page + 1} / {pageCount}
          </span>
          <button
            type="button"
            onClick={() => goToPage(page + 1)}
            disabled={page === pageCount - 1}
            aria-label="Next product photos"
            className="rounded-full border border-white/20 bg-navy-950/75 px-3 py-2 text-sm font-semibold text-sand-50 backdrop-blur transition hover:bg-navy-950 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      )}
    </div>
  );
}
