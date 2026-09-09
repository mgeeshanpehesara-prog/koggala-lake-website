import { reviewStats } from '@/lib/data/site-content';

export type ReviewSource = 'Google' | 'GetYourGuide' | 'Tripadvisor';
export type ReviewStats = { source: ReviewSource; rating: number; reviews: number | null; syncedAt: string; live: boolean };

/**
 * Provider boundary for Phase 4. The website reads one normalized shape, so
 * real Google/partner APIs can be connected later without redesigning the UI.
 */
export async function getReviewStats(): Promise<ReviewStats[]> {
  return [
    { source: 'Google', rating: reviewStats.google.rating, reviews: reviewStats.google.reviews, syncedAt: new Date().toISOString(), live: false },
    { source: 'GetYourGuide', rating: reviewStats.getyourguide.rating, reviews: reviewStats.getyourguide.reviews, syncedAt: new Date().toISOString(), live: false },
    { source: 'Tripadvisor', rating: reviewStats.tripadvisor.rating, reviews: reviewStats.tripadvisor.reviews, syncedAt: new Date().toISOString(), live: false },
  ];
}
