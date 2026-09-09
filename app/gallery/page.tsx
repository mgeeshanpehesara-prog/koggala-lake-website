import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Gallery from "@/components/gallery/Gallery";
import { getGalleryImages } from "@/lib/data/gallery-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos from Koggala Lake boat safaris and kayaking adventures with Malish.",
};

export default async function GalleryPage() {
  const galleryImages = await getGalleryImages();
  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Moments From Koggala Lake"
        subtitle="Boats, kayaks, wildlife, cinnamon and lake sunsets."
      />
      <section className="py-14 sm:py-20">
        <div className="container-premium">
          <Gallery galleryImages={galleryImages} />
        </div>
      </section>
    </>
  );
}
