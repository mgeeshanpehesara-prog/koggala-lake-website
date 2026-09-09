# Koggala Lake Website — Full Build

This project contains the customer-facing website and a protected admin control room in the same Next.js app.

## Customer side
- Premium responsive tourism landing page
- Boat Safari, Kayak Adventure, Self-Guided Kayak Rental
- Product detail pages
- Exact time selection (Boat: hourly 06:30–16:30; Kayak/Rental: 06:30, 08:30, 10:30, 12:30, 14:30, 16:30)
- Adult/child pricing (under 12 free)
- Guest checkout fields
- Full online payment or pay-on-arrival booking choice
- Visa/Mastercard payment button ready for gateway credentials
- WhatsApp confirmation
- Gallery, reviews, about, contact, maps
- USD/EUR/LKR selector

## Admin side
Open `/admin`.
The admin API is protected by an httpOnly session cookie. Configure these in `.env.local`:

```env
ADMIN_EMAIL=your-email
ADMIN_PASSWORD=use-a-long-unique-password
ADMIN_SESSION_TOKEN=use-a-long-random-secret
```

Admin can create, edit and delete products and set each product's own:
- name, category, description
- main image
- price + currency
- max people
- child-free setting
- exact time slots
- highlights

For this local build, product records are persisted in `data/products.json`. For production hosting, migrate this store to Supabase/PostgreSQL so changes are durable across deployments and available to all customers.

## Payments
The checkout includes a secure-card UI and a 50%/full-payment selector, but live card charging is intentionally not faked. Add your chosen payment provider's merchant credentials and implement its hosted checkout/webhook before launch. Do not store card numbers or CVV in this application.

## Reviews
Google is currently represented with the verified business count supplied by the owner (505 at the time of the build). The architecture leaves room for official Google Business Profile API synchronization. Tripadvisor and GetYourGuide review text is not fabricated; official/approved access should be connected before automated syncing.

## Run locally
```bash
npm install
npm run dev
```
Then open the local URL shown by Next.js, normally `http://localhost:3000` (or another port if 3000 is occupied).
