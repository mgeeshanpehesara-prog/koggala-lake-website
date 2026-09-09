import { promises as fs } from "fs";
import path from "path";
import type { Review } from "@/lib/types";
import { reviews as seedReviews } from "@/lib/data/reviews";

export type ManagedReview = Review & {
  authorName: string;
  featured: boolean;
  displayOrder: number;
};

const file = path.join(process.cwd(), "data", "reviews.json");
const fallbackReviews: ManagedReview[] = seedReviews
  .filter((review) => !(review.platform === "GetYourGuide" && review.rating === 4.8))
  .map((review, index) => ({
    ...review,
    authorName: review.authorInitial || "Google guest",
    featured: review.platform === "Google",
    displayOrder: index,
  }));

export async function getAllReviews(): Promise<ManagedReview[]> {
  try {
    const parsed = JSON.parse(await fs.readFile(file, "utf8")) as ManagedReview[];
    return parsed.filter((review) => !(review.platform === "GetYourGuide" && review.rating === 4.8));
  } catch {
    return fallbackReviews;
  }
}

export async function getFeaturedReviews(): Promise<ManagedReview[]> {
  return (await getAllReviews())
    .filter((review) => review.featured)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

export async function saveReviews(reviews: ManagedReview[]) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(reviews, null, 2), "utf8");
  return reviews;
}
