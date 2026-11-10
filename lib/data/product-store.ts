import { promises as fs } from "fs";
import path from "path";
import { Product } from "@/lib/types";
import { products as seedProducts } from "@/lib/data/products-seed";
import { isSupabaseConfigured, supabaseRequest } from "@/lib/supabase/server";

const file = path.join(process.cwd(), "data", "products.json");
type ProductRow = { slug: string; product: Product };

export async function getAllProducts(): Promise<Product[]> {
  if (isSupabaseConfigured()) {
    const rows = await supabaseRequest<ProductRow[]>("products", {
      query: "select=slug,product&order=slug.asc",
    });
    return rows.length ? rows.map((row) => row.product) : seedProducts;
  }

  try { const parsed = JSON.parse(await fs.readFile(file, "utf8")) as Product[]; return parsed.length ? parsed : seedProducts; }
  catch { return seedProducts; }
}
export async function saveProducts(items: Product[]) {
  if (isSupabaseConfigured()) {
    if (items.length) {
      await supabaseRequest("products", {
        method: "POST",
        query: "on_conflict=slug",
        body: items.map((product) => ({ slug: product.slug, product })),
        prefer: "resolution=merge-duplicates,return=minimal",
      });
    }
    return;
  }

  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(items, null, 2), "utf8");
}
export async function upsertProduct(product: Product) {
  const items = await getAllProducts(); const i = items.findIndex(p=>p.slug===product.slug);
  if(i>=0) items[i]=product; else items.push(product); await saveProducts(items); return product;
}
export async function deleteProduct(slug:string){
  if (isSupabaseConfigured()) {
    await supabaseRequest("products", {
      method: "DELETE",
      query: `slug=eq.${encodeURIComponent(slug)}`,
      prefer: "return=minimal",
    });
    return;
  }

  const items=(await getAllProducts()).filter(p=>p.slug!==slug); await saveProducts(items);
}
