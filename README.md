# Koggala Lake Boat Safari & Kayak Adventure with Malish — Website (Phase 1)

Premium customer-facing tourism website built with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS**.

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000

To build for production:

```bash
npm run build
npm run start
```

## What this Phase 1 build includes

- Full marketing site: Home, Experiences (all / boat-safari / kayak),
  individual experience detail pages, Gallery, Reviews, About, Contact,
  and placeholder legal pages (Privacy / Terms / Cancellation).
- Reusable component library (`components/`) — Navbar, Hero, ProductCard,
  ProductCarousel/Grid, ReviewCard, Gallery, CTAButton, Footer,
  ExperienceSection, TrustBadges, CurrencySelector, BookingPanel, etc.
- Product data (`lib/data/products.ts`) modelled with `mainImage` and
  `galleryImages[]` so a future admin dashboard can replace them without
  touching component code.
- A `CurrencyProvider` (`lib/currency/`) with a working USD/EUR/LKR
  selector using clearly-labelled static placeholder conversion rates —
  structured so Phase 2 can swap in a live exchange-rate feed with no
  UI changes.
- A "Select Date & Time / Book Now" placeholder booking panel on each
  experience page (no real booking logic yet, as requested).
- Fully responsive layouts, sticky navbar, mobile hamburger menu, and a
  sticky mobile "Book Now" bar on experience detail pages.
- SEO metadata via the Next.js Metadata API on every page.

## Intentionally left for later phases

- Payment gateway / Visa & Mastercard checkout
- Real booking engine (availability, time slots, full online payment / pay on arrival)
- Database (e.g. Supabase/PostgreSQL) — products/reviews/gallery currently
  live in `lib/data/*.ts` as typed arrays, matching the shape a database
  would return, so swapping in real data fetching later is straightforward
- Authentication and the admin dashboard
- Live currency exchange rates (current rates in `lib/currency/currency.ts`
  are static placeholders, clearly commented)
- Real photography — all images currently use Picsum placeholder photos
  (`https://picsum.photos/...`) referenced by `mainImage` / `galleryImages`
  in `lib/data/products.ts` and `lib/data/gallery.ts`. Swap these for real
  photos before launch.
- Real guest review text — review cards currently show platform + rating
  only, with a placeholder note, per the "do not fabricate testimonials"
  requirement.

## Project structure

```
app/                    Routes (App Router)
  page.tsx              Home
  experiences/           /experiences, /experiences/boat-safari, /experiences/kayak
  experiences/[slug]/    Individual experience detail pages
  gallery/ reviews/ about/ contact/
  privacy/ terms/ cancellation/
components/
  layout/               Navbar, MobileMenu, Footer
  ui/                   CTAButton, CurrencySelector, SectionHeading, Badge, StarRating, PageHero, LegalPage
  home/                 Hero, TrustBadges, ExperienceSection, WhyChooseUs, GallerySection, ReviewsSection, AboutSection, LocationSection, WhatsAppCTA
  products/             ProductCard, ProductGrid, ProductCarousel, CategoryTabs, BookingPanel, MobileStickyBar
  reviews/               ReviewCard
  gallery/               Gallery (with category filter)
lib/
  types.ts              Shared TypeScript types (Product, Review, GalleryImage, Currency)
  site-config.ts         Business name, contact details, social + map links
  utils.ts               cn() class helper, whatsappLink() helper
  data/                  products.ts, reviews.ts, gallery.ts (static — Phase 2 will fetch from a database)
  currency/               CurrencyContext.tsx, currency.ts (conversion + formatting)
```
