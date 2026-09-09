import { promises as fs } from "fs";
import path from "path";

const CACHE_FILE = path.join(process.cwd(), "data", "currency-rates.json");
const CACHE_TTL = 24 * 60 * 60 * 1000;
const API_URL = "https://open.er-api.com/v6/latest/USD";

type RateCache = { base: "USD"; rates: Record<string, number>; updatedAt: number };

const fallbackCache: RateCache = { base: "USD", rates: { USD: 1 }, updatedAt: 0 };

async function readCache(): Promise<RateCache> {
  try {
    const value = JSON.parse(await fs.readFile(CACHE_FILE, "utf8")) as Partial<RateCache>;
    if (value.base === "USD" && value.rates && typeof value.updatedAt === "number") return { base: "USD", rates: value.rates, updatedAt: value.updatedAt };
  } catch { /* Use an in-memory USD fallback when no cache exists yet. */ }
  return fallbackCache;
}

function isValidRates(value: unknown): value is Record<string, number> {
  return Boolean(value && typeof value === "object" && Object.entries(value).some(([code, rate]) => code === "USD" && rate === 1) && Object.entries(value).every(([code, rate]) => /^[A-Z]{3}$/.test(code) && typeof rate === "number" && Number.isFinite(rate) && rate > 0));
}

async function refreshCache(current: RateCache): Promise<RateCache> {
  if (Date.now() - current.updatedAt < CACHE_TTL && isValidRates(current.rates)) return current;
  try {
    const response = await fetch(API_URL, { next: { revalidate: 86400 } });
    const data = await response.json() as { result?: string; base_code?: string; rates?: Record<string, number> };
    if (response.ok && data.result === "success" && data.base_code === "USD" && data.rates && isValidRates(data.rates)) {
      const next: RateCache = { base: "USD", rates: data.rates, updatedAt: Date.now() };
      await fs.mkdir(path.dirname(CACHE_FILE), { recursive: true });
      await fs.writeFile(CACHE_FILE, JSON.stringify(next, null, 2), "utf8");
      return next;
    }
  } catch { /* Preserve the last successful cache and retry on a later request. */ }
  return current;
}

export async function getCurrencyRates() {
  return refreshCache(await readCache());
}
