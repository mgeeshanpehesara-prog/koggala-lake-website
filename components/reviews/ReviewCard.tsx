"use client";

import { useState } from "react";
import { Review } from "@/lib/types";
import StarRating from "@/components/ui/StarRating";

const PLATFORM_LABEL: Record<Review["platform"], string> = {
  Google: "Google",
  GetYourGuide: "GetYourGuide",
  Tripadvisor: "Tripadvisor",
};

export default function ReviewCard({ review }: { review: Review }) {
  const [expanded, setExpanded] = useState(false);
  const hasLongText = Boolean(review.text && review.text.length > 220);

  return (
    <div className="flex h-full min-h-[220px] flex-col rounded-xl2 border border-white/10 bg-navy-800/60 p-6 transition duration-300 hover:-translate-y-1 hover:border-teal-400/25 hover:bg-navy-800/75">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-white/[0.06] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-teal-400">
          {PLATFORM_LABEL[review.platform]}
        </span>
        <StarRating rating={review.rating} />
      </div>
      <p
        className={`mt-5 text-[15px] leading-7 ${expanded ? "" : "line-clamp-5"} ${review.isPlaceholder ? "italic text-sand-200/45" : "text-sand-100/85"}`}
      >
        {review.text}
      </p>
      {hasLongText && (
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          className="mt-3 self-start text-sm font-semibold text-teal-400 transition-colors hover:text-teal-300"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
      {review.authorName?.trim() && (
        <p className="mt-auto pt-5 text-sm font-medium text-sand-200/75">&mdash; {review.authorName}</p>
      )}
    </div>
  );
}
