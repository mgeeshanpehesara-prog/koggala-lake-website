"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { GalleryImage } from "@/lib/types";
import SafeImage from "@/components/ui/SafeImage";

const CATEGORIES: Array<GalleryImage["category"] | "All"> = [
  "All",
  "Boat",
  "Kayaking",
  "Wildlife",
  "Cinnamon",
  "Lake",
  "Sunset",
];

export default function Gallery({ galleryImages }: { galleryImages: GalleryImage[] }) {
  const [active, setActive] = useState<(typeof CATEGORIES)[number]>("All");

  const filtered =
    active === "All"
      ? galleryImages
      : galleryImages.filter((img) => img.category === active);

  return (
    <div>
      <div className="scroll-row flex gap-2 overflow-x-auto pb-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActive(cat)}
            className={cn(
              "whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              active === cat
                ? "bg-teal-500 text-navy-950"
                : "glass-panel text-sand-100 hover:bg-white/10"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-8 columns-2 gap-3 sm:columns-3 sm:gap-4 [&>*]:mb-3 sm:[&>*]:mb-4">
        {filtered.map((img) => (
          <div
            key={img.id}
            className="relative break-inside-avoid overflow-hidden rounded-xl2 card-lift"
          >
            <SafeImage
              src={img.src}
              alt={img.alt}
              width={600}
              height={750}
              sizes="(max-width: 640px) 50vw, 33vw"
              className="h-auto w-full object-cover transition-transform duration-700 ease-premium hover:scale-110"
            />
            <span className="absolute bottom-2 left-2 rounded-full bg-navy-950/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-sand-100">
              {img.category}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
