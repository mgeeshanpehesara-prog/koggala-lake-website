import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { getGalleryImages, saveGalleryImages } from "@/lib/data/gallery-store";
import type { GalleryImage } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await getGalleryImages());
}

export async function PUT(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const images = (await request.json()) as GalleryImage[];
  if (!Array.isArray(images)) return NextResponse.json({ error: "Gallery must be an array." }, { status: 400 });
  if (images.some((image) => !image.id || !image.src || !image.alt || !image.category)) {
    return NextResponse.json({ error: "Each gallery image needs a file, alt text and category." }, { status: 400 });
  }
  return NextResponse.json(await saveGalleryImages(images));
}
