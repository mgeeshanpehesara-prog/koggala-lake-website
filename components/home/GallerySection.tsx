import SectionHeading from "@/components/ui/SectionHeading";
import CTAButton from "@/components/ui/CTAButton";
import { getGalleryImages } from "@/lib/data/gallery-store";
import SafeImage from "@/components/ui/SafeImage";

export default async function GallerySection() {
  const galleryImages = await getGalleryImages();
  const preview = galleryImages.slice(0, 8);

  return (
    <section className="py-20 sm:py-28">
      <div className="container-premium">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Gallery"
            title="Moments From Koggala Lake"
          />
          <CTAButton href="/gallery" variant="ghost" className="hidden sm:inline-flex">
            View Full Gallery &rarr;
          </CTAButton>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {preview.map((img, i) => (
            <div
              key={img.id}
              className={`relative overflow-hidden rounded-xl2 card-lift ${
                i === 0 ? "col-span-2 row-span-2 aspect-square md:aspect-auto" : "aspect-square"
              }`}
            >
              <SafeImage
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 ease-premium hover:scale-110"
              />
              <span className="absolute bottom-2 left-2 rounded-full bg-navy-950/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-sand-100">
                {img.category}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8 sm:hidden">
          <CTAButton href="/gallery" variant="secondary" className="w-full">
            View Full Gallery &rarr;
          </CTAButton>
        </div>
      </div>
    </section>
  );
}
