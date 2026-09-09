import { Review } from "@/lib/types";

// NOTE: Real guest review text has not been provided yet.
// Per project requirements, we do not fabricate testimonials.
// These entries are structural placeholders showing platform + rating only,
// ready to be replaced by real review content from the future admin dashboard.

export const reviews: Review[] = [
  {
    id: "google-summary",
    platform: "Google",
    rating: 5.0,
    isPlaceholder: true,
    text: "Guest review will be managed from the admin dashboard.",
  },
  {
    id: "gyg-boat-safari",
    platform: "GetYourGuide",
    rating: 5.0,
    productSlug: "boat-safari",
    isPlaceholder: true,
    text: "Guest review will be managed from the admin dashboard.",
  },
  {
    id: "gyg-kayak-tour",
    platform: "GetYourGuide",
    rating: 4.8,
    productSlug: "wildlife-cinnamon-kayaking",
    isPlaceholder: true,
    text: "Guest review will be managed from the admin dashboard.",
  },
  {
    id: "gyg-kayak-rental",
    platform: "GetYourGuide",
    rating: 5.0,
    productSlug: "self-guided-kayak-rental",
    isPlaceholder: true,
    text: "Guest review will be managed from the admin dashboard.",
  },
  {
    id: "tripadvisor-summary",
    platform: "Tripadvisor",
    rating: 5.0,
    isPlaceholder: true,
    text: "Guest review will be managed from the admin dashboard.",
  },
];
