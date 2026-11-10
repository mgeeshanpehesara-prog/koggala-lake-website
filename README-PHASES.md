# Koggala Lake Website — Full Build

This project contains the customer-facing website and a protected admin control room in the same Next.js app.

## Customer side
- Premium responsive tourism landing page
- Boat Safari, Kayak Adventure, Self-Guided Kayak Rental
- Product detail pages
- Exact time selection (Boat: hourly 06:30–16:30; Kayak/Rental: 06:30, 08:30, 10:30, 12:30, 14:30, 16:30)
- Adult/child pricing (under 12 free)
- Guest checkout fields
- Reserve now, pay on arrival booking
- WhatsApp booking and confirmation
- Gallery, reviews, about, contact, maps
- USD/EUR/LKR selector

## Admin side
Open `/admin`.
The admin API is protected by an httpOnly session cookie. Configure these for local development in `.env.local` (never commit this file):

```env
ADMIN_EMAIL=your-email
ADMIN_PASSWORD=use-a-long-unique-password
ADMIN_SESSION_TOKEN=use-a-long-random-secret
```

### Production (Vercel) configuration
`.env.local` only applies to your local machine — it is never deployed. For the live site, add the same three variables in **Vercel → Project Settings → Environment Variables**, with the **Production** environment selected (and Preview, if you want admin access on preview deployments too):

- `ADMIN_EMAIL` — the admin's login email
- `ADMIN_PASSWORD` — a long, unique password (not reused elsewhere)
- `ADMIN_SESSION_TOKEN` — a long, random secret used to sign the session cookie (e.g. generate 32+ random bytes)

After saving, redeploy the project so the new environment variables take effect. If any of these three variables are missing in production, `/admin` will show a clear "not configured" message instead of accepting a login — it will never fall back to a public/unauthenticated admin view.

Admin can create, edit and delete products and set each product's own:
- name, category, description
- main image
- price + currency
- max people
- child-free setting
- exact time slots
- highlights

For local development without database variables, product records and bookings remain in the JSON files under `data/`. For production hosting, set `SUPABASE_URL` and the server-only `SUPABASE_SERVICE_ROLE_KEY` in Vercel. The server stores product and booking JSON documents in the protected Supabase `products` and `bookings` tables, so existing product fields and historical payment fields remain intact. Apply the migration in `supabase/migrations/` before enabling these variables.

## Booking and payments
Online payment is not enabled. Customers reserve their experience through the website and pay the full amount on arrival. Customers can also confirm booking details through WhatsApp. No card numbers or CVV are collected or stored in this application.

## Reviews
Google is currently represented with the verified business count supplied by the owner (505 at the time of the build). The architecture leaves room for official Google Business Profile API synchronization. Tripadvisor and GetYourGuide review text is not fabricated; official/approved access should be connected before automated syncing.

## Run locally
```bash
npm install
npm run dev
```
Then open the local URL shown by Next.js, normally `http://localhost:3000` (or another port if 3000 is occupied).
