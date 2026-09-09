import type { ReviewPlatformSettings, ReviewSettings } from "@/lib/data/website-content-store";

export type ReviewPlatformKey = "google" | "getyourguide" | "tripadvisor";

export type ReviewPlatform = {
  key: ReviewPlatformKey;
  name: string;
  mark: string;
  fallbackLogoUrl: string;
  settings: ReviewPlatformSettings;
  action: string;
};

export function getReviewPlatforms(settings: ReviewSettings): ReviewPlatform[] {
  return [
    { key: "google", name: "Google", mark: "G", fallbackLogoUrl: "https://cdn.simpleicons.org/google/4285F4", settings: settings.google, action: "View on Google" },
    { key: "getyourguide", name: "GetYourGuide", mark: "G", fallbackLogoUrl: "https://cdn.simpleicons.org/getyourguide/111111", settings: settings.getyourguide, action: "View on GetYourGuide" },
    { key: "tripadvisor", name: "Tripadvisor", mark: "TA", fallbackLogoUrl: "https://cdn.simpleicons.org/tripadvisor/34A853", settings: settings.tripadvisor, action: "View on Tripadvisor" },
  ];
}

export function getPlatformLinks(platform: ReviewPlatform) {
  return platform.settings.links.length ? platform.settings.links : [platform.settings.url];
}
