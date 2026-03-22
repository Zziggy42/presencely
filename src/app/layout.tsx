import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://presencely-production.up.railway.app";

export const metadata: Metadata = {
  title: {
    template: "%s | Presencely",
    default: "Presencely – AI-Powered Local SEO & Business Presence Platform",
  },
  description:
    "See exactly how your online presence translates to revenue. Google Maps, reviews, SEO, staffing — all in one place.",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "Presencely – AI-Powered Local SEO & Business Presence Platform",
    description:
      "See exactly how your online presence translates to revenue. Google Maps, reviews, SEO, staffing — all in one place.",
    url: SITE_URL,
    siteName: "Presencely",
    type: "website",
  },
  verification: {
    google: "uDaf-u7YEWCsl6SS2iH2_ZOZGdw1W2jwH1dSowvlnNY",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Presencely",
    url: SITE_URL,
    applicationCategory: "BusinessApplication",
    description:
      "AI-powered local SEO and business presence platform. Monitor Google Maps, reviews, SEO rankings, and staffing — all in one dashboard.",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
