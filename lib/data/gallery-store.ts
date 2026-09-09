import { promises as fs } from "fs";
import path from "path";
import type { GalleryImage } from "@/lib/types";
import { galleryImages as seedGalleryImages } from "@/lib/data/gallery";

const file = path.join(process.cwd(), "data", "gallery.json");

export async function getGalleryImages(): Promise<GalleryImage[]> {
  try {
    const parsed = JSON.parse(await fs.readFile(file, "utf8")) as GalleryImage[];
    return parsed.length ? parsed : seedGalleryImages;
  } catch {
    return seedGalleryImages;
  }
}

export async function saveGalleryImages(images: GalleryImage[]) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(images, null, 2), "utf8");
  return images;
}
