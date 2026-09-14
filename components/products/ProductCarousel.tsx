import { Product } from "@/lib/types";
import ProductCard from "@/components/products/ProductCard";

export default function ProductCarousel({ products }: { products: Product[] }) {
  return (
    <div className="-mx-5 sm:-mx-8 lg:-mx-10">
      <div className="scroll-row flex gap-4 overflow-x-auto px-5 pb-4 snap-x snap-mandatory sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-8 sm:pb-0 lg:grid-cols-3 lg:px-10">
        {products.map((product) => (
          <ProductCard
            key={product.slug}
            product={product}
            className="w-[80vw] max-w-[300px] flex-shrink-0 snap-start sm:w-auto sm:max-w-none sm:flex-shrink"
          />
        ))}
      </div>
    </div>
  );
}
