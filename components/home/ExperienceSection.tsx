import SectionHeading from "@/components/ui/SectionHeading";
import ProductCarousel from "@/components/products/ProductCarousel";
import CTAButton from "@/components/ui/CTAButton";
import { getAllProducts } from "@/lib/data/product-store";

export const dynamic = "force-dynamic";

export default async function ExperienceSection() {
  const products = await getAllProducts();
  return (
    <section className="py-20 sm:py-28">
      <div className="container-premium">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Experiences"
            title="Choose Your Adventure"
            subtitle="Explore Koggala Lake your way."
          />
          <CTAButton href="/experiences" variant="ghost" className="hidden sm:inline-flex">
            View All Experiences &rarr;
          </CTAButton>
        </div>

        <div className="mt-10">
          <ProductCarousel products={products} />
        </div>

        <div className="mt-10 sm:hidden">
          <CTAButton href="/experiences" variant="secondary" className="w-full">
            View All Experiences &rarr;
          </CTAButton>
        </div>
      </div>
    </section>
  );
}
