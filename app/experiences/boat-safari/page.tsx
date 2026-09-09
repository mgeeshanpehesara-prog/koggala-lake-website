import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import CategoryTabs from "@/components/products/CategoryTabs";
import ProductGrid from "@/components/products/ProductGrid";
import { getAllProducts } from "@/lib/data/product-store";

export const metadata: Metadata = {
  title: "Boat Safari",
  description:
    "Private boat safari on Koggala Lake with Malish — wildlife, Cinnamon Island and a fresh cinnamon drink.",
};

export const dynamic = "force-dynamic";

export default async function BoatSafariPage() {
  const boatSafariProducts = (await getAllProducts()).filter(p => p.category === "boat-safari");

  return (
    <>
      <PageHero
        eyebrow="Boat Safari"
        title="Koggala Lake Boat Safari"
        subtitle="Private boat safaris exploring wildlife, mangroves and Cinnamon Island."
      />
      <section className="py-14 sm:py-20">
        <div className="container-premium">
          <CategoryTabs />
          <div className="mt-10">
            <ProductGrid products={boatSafariProducts} />
          </div>
        </div>
      </section>
    </>
  );
}
