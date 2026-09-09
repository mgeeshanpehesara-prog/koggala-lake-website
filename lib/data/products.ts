import { Product } from "@/lib/types";
import { products as seedProducts } from "@/lib/data/products-seed";
export const products: Product[] = seedProducts;
export { seedProducts };
export function getProductBySlug(slug:string){return products.find(p=>p.slug===slug)}
export function getProductsByCategory(category:string){return products.filter(p=>p.category===category)}
