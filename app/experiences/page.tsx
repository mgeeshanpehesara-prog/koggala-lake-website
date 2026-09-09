import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import CategoryTabs from "@/components/products/CategoryTabs";
import ProductGrid from "@/components/products/ProductGrid";
import { getAllProducts } from "@/lib/data/product-store";

export const metadata: Metadata = {
  title: "Experiences",
  description:
    "Browse all Koggala Lake boat safari and kayaking experiences with Malish.",
};

export const dynamic = "force-dynamic";

export default async function ExperiencesPage() {
  const products = await getAllProducts();
  return (
    <>
      <PageHero
        eyebrow="Experiences"
        title="All Experiences"
        subtitle="Private boat safaris and kayaking adventures on Koggala Lake."
      />
      <section className="py-14 sm:py-20">
        <div className="container-premium">
          <CategoryTabs />
          <div className="mt-10">
            <ProductGrid products={products} />
          </div>
        </div>
      </section>
    </>
  );
}
