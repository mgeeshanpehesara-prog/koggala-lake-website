// Official TripAdvisor "Travelers' Choice" award mark.
// The vector paths below are copied unmodified from Tripadvisor's own
// production markup (the same icon Tripadvisor renders on this listing's
// "Awards" panel at tripadvisor.com). Unlike the self-serve certificate
// widget's static PNG (which bakes a large white card into the pixels),
// this is the genuine official artwork with a transparent background, so
// it can sit cleanly on our dark site background without any cropping,
// clipping or recoloring.
function TravelersChoiceMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" role="img" aria-label="Tripadvisor Travelers' Choice award mark" className={className}>
      <path
        fill="#00EB5B"
        d="M7.272 39.942c-3.867 0-7.015-3.157-7.015-7.035V20.665q0-.12.003-.236v-.05q-.002-.16-.003-.32C.257 9.14 9.113.257 19.999.257c10.885 0 19.741 8.882 19.741 19.8q0 .156-.003.308v.06l.003.237v12.242c0 3.878-3.148 7.035-7.015 7.035H7.272z"
      />
      <path
        fill="#161107"
        d="M19.999.514c5.206 0 10.097 2.031 13.78 5.722s5.707 8.6 5.707 13.82q0 .156-.003.312v.066c0 .075.006.153.006.228v12.242c0 3.737-3.033 6.779-6.758 6.779H7.272c-3.728 0-6.758-3.042-6.758-6.78v-12.24q0-.117.003-.229v-.066c0-.104-.006-.208-.006-.312 0-5.22 2.026-10.126 5.708-13.82C9.9 2.548 14.793.514 19.999.514m0-.514C8.955 0 0 8.98 0 20.056q-.001.183.006.361c0 .084-.006.164-.006.245v12.242c0 4.028 3.255 7.292 7.272 7.292h25.453c4.017 0 7.272-3.264 7.272-7.292V20.662q.002-.124-.006-.245c0-.121.006-.24.006-.36C40 8.98 31.045 0 20 0"
      />
      <path
        fill="#161107"
        d="M16.779 20.907c0 .985-.795 1.78-1.772 1.78-.976 0-1.77-.8-1.77-1.78s.793-1.779 1.77-1.779 1.772.8 1.772 1.78m9.98 0c0 .985-.794 1.78-1.77 1.78-.978 0-1.772-.8-1.772-1.78s.794-1.779 1.771-1.779 1.771.8 1.771 1.78m1.597-3.709 1.633-1.787h-3.622a11.2 11.2 0 0 0-6.37-1.97c-2.366 0-4.547.728-6.356 1.97h-3.63l1.634 1.787a5.01 5.01 0 0 0-1.628 3.71c0 2.771 2.234 5.019 4.99 5.019a4.95 4.95 0 0 0 3.392-1.34L20 26.34l1.602-1.75a4.96 4.96 0 0 0 3.392 1.337c2.758 0 4.993-2.248 4.993-5.02a5 5 0 0 0-1.629-3.709m-13.345 7.108a3.39 3.39 0 0 1-3.378-3.396c0-1.875 1.514-3.397 3.378-3.397s3.378 1.522 3.378 3.397a3.39 3.39 0 0 1-3.378 3.396m4.99-3.494c0-2.237-1.615-4.154-3.749-4.975a9.65 9.65 0 0 1 3.75-.754c1.328 0 2.596.267 3.748.754-2.134.821-3.749 2.738-3.749 4.975m4.99 3.494c-1.863 0-3.378-1.522-3.378-3.396 0-1.875 1.515-3.397 3.379-3.397 1.863 0 3.378 1.522 3.378 3.397s-1.515 3.396-3.378 3.396M24.669 31.41c-.81.055-1.549.33-2.145.749a4.23 4.23 0 0 0 2.227.447 4.24 4.24 0 0 0 2.144-.75 4.23 4.23 0 0 0-2.226-.447M28.545 29.397c-.83.371-1.499.94-1.965 1.61a4.7 4.7 0 0 0 2.507-.384 4.74 4.74 0 0 0 1.965-1.61 4.7 4.7 0 0 0-2.508.384M32.209 25.434a6.17 6.17 0 0 0-1.687 2.84 6.15 6.15 0 0 0 2.894-1.585 6.17 6.17 0 0 0 1.687-2.84 6.15 6.15 0 0 0-2.894 1.585M32.955 20.15a7.2 7.2 0 0 0-.718 3.794 7.17 7.17 0 0 0 2.542-2.9 7.2 7.2 0 0 0 .717-3.793 7.17 7.17 0 0 0-2.541 2.899M31.842 14.302a7.85 7.85 0 0 0 .672 4.146 7.85 7.85 0 0 0 1.523-3.913 7.87 7.87 0 0 0-.673-4.146 7.85 7.85 0 0 0-1.522 3.913M15.329 31.412c.81.056 1.549.331 2.144.75a4.23 4.23 0 0 1-2.226.447 4.24 4.24 0 0 1-2.145-.75 4.23 4.23 0 0 1 2.227-.447M11.454 29.4c.829.37 1.499.94 1.965 1.61a4.7 4.7 0 0 1-2.507-.384 4.74 4.74 0 0 1-1.965-1.61 4.7 4.7 0 0 1 2.507.384M7.793 25.437a6.17 6.17 0 0 1 1.686 2.84 6.15 6.15 0 0 1-2.893-1.585 6.17 6.17 0 0 1-1.687-2.84 6.15 6.15 0 0 1 2.894 1.585M7.045 20.153a7.2 7.2 0 0 1 .717 3.793 7.17 7.17 0 0 1-2.541-2.899 7.2 7.2 0 0 1-.718-3.793 7.17 7.17 0 0 1 2.542 2.899M8.16 14.304a7.87 7.87 0 0 1-.672 4.146 7.85 7.85 0 0 1-1.522-3.913 7.87 7.87 0 0 1 .672-4.145 7.85 7.85 0 0 1 1.522 3.912M19.998 34.46c.747 0 1.353-.61 1.353-1.359 0-.75-.606-1.358-1.353-1.358-.746 0-1.353.609-1.353 1.358s.607 1.358 1.353 1.358"
      />
    </svg>
  );
}

// TripAdvisor Travelers' Choice 2026 award.
// We link straight to the business's Tripadvisor review page using the
// award mark above instead of Tripadvisor's self-serve "Certificate of
// Excellence" embed widget: that widget's only available asset for this
// listing (tchotel_2026_L.png) renders as a large, fixed, opaque white
// rectangle that cannot be made transparent without cropping or editing
// the official artwork, which would misrepresent the award.
export default function TripAdvisorAward() {
  return (
    <section aria-label="TripAdvisor Travelers' Choice 2026 award" className="border-y border-white/5 bg-navy-900/40">
      <div className="container-premium flex flex-col items-center gap-2 py-5 text-center sm:gap-2.5 sm:py-6">
        <p className="eyebrow text-gold-400">Travelers&rsquo; Choice 2026</p>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.tripadvisor.com/Attraction_Review-g1189030-d26934724-Reviews-Koggala_Lake_Boat_Safari_Kayak_Adventure_with_Malish-Koggala_Galle_District_Sou.html"
          className="group inline-flex flex-col items-center gap-1.5 transition-transform duration-300 hover:-translate-y-0.5"
        >
          <TravelersChoiceMark className="h-14 w-14 drop-shadow-[0_6px_18px_rgba(0,235,91,0.25)] sm:h-16 sm:w-16" />
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-sand-200/70 group-hover:text-sand-50">
            Tripadvisor
          </span>
        </a>
      </div>
    </section>
  );
}
