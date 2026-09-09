import { promises as fs } from "fs";
import path from "path";
import { Product } from "@/lib/types";
import { products as seedProducts } from "@/lib/data/products-seed";

const file = path.join(process.cwd(), "data", "products.json");

export async function getAllProducts(): Promise<Product[]> {
  try { const parsed = JSON.parse(await fs.readFile(file, "utf8")) as Product[]; return parsed.length ? parsed : seedProducts; }
  catch { return seedProducts; }
}
export async function saveProducts(items: Product[]) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(items, null, 2), "utf8");
}
export async function upsertProduct(product: Product) {
  const items = await getAllProducts(); const i = items.findIndex(p=>p.slug===product.slug);
  if(i>=0) items[i]=product; else items.push(product); await saveProducts(items); return product;
}
export async function deleteProduct(slug:string){ const items=(await getAllProducts()).filter(p=>p.slug!==slug); await saveProducts(items); }
