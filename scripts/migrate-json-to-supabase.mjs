import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const configuredUrl = process.env.SUPABASE_URL?.trim();
const url = configuredUrl ? configuredUrl.replace(/\/+$/, "") : undefined;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!url || !serviceRoleKey) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.");
}

async function readJson(fileName) {
  const parsed = JSON.parse(await readFile(path.join(root, "data", fileName), "utf8"));
  if (!Array.isArray(parsed)) {
    throw new Error(`${fileName} must contain a JSON array.`);
  }
  return parsed;
}

async function insertMissing(table, conflictColumn, rows) {
  if (!rows.length) return;

  const response = await fetch(
    `${url}/rest/v1/${table}?on_conflict=${conflictColumn}`,
    {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "resolution=ignore-duplicates,return=minimal",
      },
      body: JSON.stringify(rows),
    },
  );

  if (!response.ok) {
    throw new Error(`Supabase ${table} import failed with status ${response.status}.`);
  }
}

const products = await readJson("products.json");
const bookings = await readJson("bookings.json");

await insertMissing(
  "products",
  "slug",
  products.map((product) => ({ slug: product.slug, product })),
);
await insertMissing(
  "bookings",
  "id",
  bookings.map((booking) => ({ id: booking.id, booking })),
);

console.log(
  `Processed ${products.length} products and ${bookings.length} bookings. Existing rows were left unchanged.`,
);
