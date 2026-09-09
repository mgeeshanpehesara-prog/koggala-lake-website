import { NextResponse } from 'next/server';
import { getReviewStats } from '@/lib/reviews-service';

export async function GET() {
  const stats = await getReviewStats();
  return NextResponse.json({ ok: true, stats, note: 'Provider adapters are ready; live platform sync requires approved credentials/API access.' });
}
