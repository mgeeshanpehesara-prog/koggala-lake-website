import { Product } from "@/lib/types";
import ProductCard from "@/components/products/ProductCard";

export default function ProductCarousel({ products }: { products: Product[] }) {
  return (
    <div className="-mx-5 sm:-mx-8 lg:-mx-10">
      <div className="scroll-row flex gap-5 overflow-x-auto px-5 sm:px-8 lg:px-10 pb-4 snap-x snap-mandatory sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-8 lg:grid-cols-3 lg:px-10">
        {products.map((product) => (
          <ProductCard
            key={product.slug}
            product={product}
            className="min-w-[82%] snap-start sm:min-w-0"
          />
        ))}
      </div>
    </div>
  );
}
