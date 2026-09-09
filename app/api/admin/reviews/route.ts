import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { getAllReviews, saveReviews, type ManagedReview } from "@/lib/data/reviews-store";

export const dynamic = "force-dynamic";

async function authorize() {
  return isAdmin();
}

export async function GET() {
  if (!(await authorize())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await getAllReviews());
}

export async function PUT(request: Request) {
  if (!(await authorize())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const review = (await request.json()) as ManagedReview;
  if (!review?.id || !review.text?.trim() || !review.authorName?.trim()) {
    return NextResponse.json({ error: "Reviewer name and review text are required." }, { status: 400 });
  }
  const reviews = await getAllReviews();
  const next = reviews.some((item) => item.id === review.id)
    ? reviews.map((item) => (item.id === review.id ? review : item))
    : [...reviews, review];
  await saveReviews(next);
  return NextResponse.json(review);
}

export async function DELETE(request: Request) {
  if (!(await authorize())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = (await request.json()) as { id?: string };
  if (!id) return NextResponse.json({ error: "Review id is required." }, { status: 400 });
  await saveReviews((await getAllReviews()).filter((review) => review.id !== id));
  return NextResponse.json({ ok: true });
}
