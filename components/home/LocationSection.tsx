/* eslint-disable @next/next/no-img-element */
import SectionHeading from "@/components/ui/SectionHeading";
import { getWebsiteContent } from "@/lib/data/website-content-store";

export default async function LocationSection() {
  const { locations } = await getWebsiteContent();
  const visibleLocations = [locations.ticketOffice, locations.boatPlace].filter((location) => location.enabled);
  return (
    <section className="bg-navy-900/40 py-20 sm:py-28">
      <div className="container-premium">
        <SectionHeading eyebrow="Find Us" title="Meet Us at Koggala Lake" subtitle="Choose the location that matches your visit." />
        <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {visibleLocations.map((location) => <article key={location.name} className="flex items-start gap-4 rounded-xl2 border border-white/10 bg-navy-800/50 p-5"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-teal-500/15 text-teal-400">{location.imageUrl ? <img src={location.imageUrl} alt="" className="h-6 w-6 object-contain" /> : <span aria-hidden="true">&#128205;</span>}</div><div><h3 className="font-display text-lg font-medium text-sand-50">{location.name}</h3><p className="mt-2 text-sm leading-relaxed text-sand-200/65">{location.description}</p>{location.url && <a href={location.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex rounded-full border border-teal-400/30 px-3 py-2 text-xs font-semibold text-teal-300 transition hover:bg-teal-400/10">{location.buttonText || "Open Location"} <span aria-hidden="true" className="ml-2">&rarr;</span></a>}</div></article>)}
        </div>
      </div>
    </section>
  );
}
