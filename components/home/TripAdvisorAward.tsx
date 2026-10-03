"use client";

/* eslint-disable @next/next/no-img-element */

import Script from "next/script";

// Official TripAdvisor Travelers' Choice 2026 certificate widget.
// Markup/ids/classes are kept as provided by TripAdvisor; only JSX-required
// syntax (className, camelCase event props) was adjusted for Next.js.
export default function TripAdvisorAward() {
  return (
    <section aria-label="TripAdvisor Travelers' Choice 2026 award" className="border-y border-white/5 bg-navy-900/40">
      <div className="container-premium flex flex-col items-center gap-1.5 py-4 text-center sm:gap-2 sm:py-5">
        <p className="eyebrow text-gold-400">Travelers&rsquo; Choice 2026</p>

        <div id="TA_certificateOfExcellence993" className="TA_certificateOfExcellence flex justify-center">
          <ul id="Lz66uxz" className="TA_links NAfYq2 m-0 flex list-none items-center justify-center p-0">
            <li id="K2DmcGa" className="ut6kmgyJGteB">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.tripadvisor.com/Attraction_Review-g1189030-d26934724-Reviews-Koggala_Lake_Boat_Safari_Kayak_Adventure_with_Malish-Koggala_Galle_District_Sou.html"
              >
                <img
                  src="https://static.tacdn.com/img2/travelers_choice/widgets/tchotel_2026_L.png"
                  alt="TripAdvisor Travelers' Choice 2026"
                  className="widCOEImg mx-auto h-16 w-auto sm:h-20"
                  id="CDSWIDCOELOGO"
                />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <Script
        id="tripadvisor-coe-widget-993"
        src="https://www.jscache.com/wejs?wtype=certificateOfExcellence&uniq=993&locationId=26934724&lang=en_US&year=2026&display_version=2"
        strategy="lazyOnload"
        data-loadtrk="true"
        onLoad={(event) => {
          (event.currentTarget as HTMLScriptElement & { loadtrk?: boolean }).loadtrk = true;
        }}
      />
    </section>
  );
}
