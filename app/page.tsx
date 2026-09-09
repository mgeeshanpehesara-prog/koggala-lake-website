import Hero from "@/components/home/Hero";
import TrustBadges from "@/components/home/TrustBadges";
import ExperienceSection from "@/components/home/ExperienceSection";
import ReviewsSection from "@/components/home/ReviewsSection";
import SocialMediaSection from "@/components/home/SocialMediaSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import GallerySection from "@/components/home/GallerySection";
import AboutSection from "@/components/home/AboutSection";
import LocationSection from "@/components/home/LocationSection";
import WhatsAppCTA from "@/components/home/WhatsAppCTA";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBadges />
      <ExperienceSection />
      <ReviewsSection />
      <SocialMediaSection />
      <WhyChooseUs />
      <GallerySection />
      <AboutSection />
      <LocationSection />
      <WhatsAppCTA />
    </>
  );
}
