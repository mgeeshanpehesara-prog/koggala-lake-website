import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import CategoryTabs from "@/components/products/CategoryTabs";
import ProductGrid from "@/components/products/ProductGrid";
import { getAllProducts } from "@/lib/data/product-store";

export const metadata: Metadata = {
  title: "Kayak Adventures",
  description:
    "Guided and self-guided kayaking adventures on Koggala Lake with Malish.",
};

export const dynamic = "force-dynamic";

export default async function KayakPage() {
  const products = await getAllProducts();
  const kayakProducts = products.filter(
    (p) => p.category === "kayak-tour" || p.category === "kayak-rental"
  );

  return (
    <>
      <PageHero
        eyebrow="Kayak Adventure"
        title="Kayaking on Koggala Lake"
        subtitle="Guided kayak tours and self-guided kayak rentals."
      />
      <section className="py-14 sm:py-20">
        <div className="container-premium">
          <CategoryTabs />
          <div className="mt-10">
            <ProductGrid products={kayakProducts} />
          </div>
        </div>
      </section>
    </>
  );
}
