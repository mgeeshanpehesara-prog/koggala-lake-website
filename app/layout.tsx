import type { Metadata } from "next";
import "./globals.css";

export const dynamic = "force-dynamic";
import { siteConfig } from "@/lib/site-config";
import { CurrencyProvider } from "@/lib/currency/CurrencyContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TouristAttraction",
              name: siteConfig.name,
              description: siteConfig.description,
              telephone: siteConfig.phone,
              email: siteConfig.email,
              url: siteConfig.url,
              sameAs: [siteConfig.social.facebook, siteConfig.social.instagram, siteConfig.social.tripadvisor],
              aggregateRating: { "@type": "AggregateRating", ratingValue: 5, reviewCount: 505 },
            }),
          }}
        />
        <CurrencyProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </CurrencyProvider>
      </body>
    </html>
  );
}
