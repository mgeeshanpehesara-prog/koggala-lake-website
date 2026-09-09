import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import ReviewsSection from "@/components/home/ReviewsSection";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reviews",
  description: "Guest ratings for Koggala Lake boat safari and kayaking experiences with Malish.",
};

export default async function ReviewsPage() {
  return (
    <>
      <PageHero
        eyebrow="Reviews"
        title="Trusted by Travelers"
        subtitle="Ratings from guests across Google, GetYourGuide and Tripadvisor."
      />
      <ReviewsSection />
    </>
  );
}
