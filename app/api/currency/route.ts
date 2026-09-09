import { NextResponse } from "next/server";
import { getCurrencyRates } from "@/lib/currency/rate-service";

export const dynamic = "force-dynamic";

export async function GET() {
  const cache = await getCurrencyRates();
  return NextResponse.json(cache, { headers: { "Cache-Control": "public, max-age=3600" } });
}
