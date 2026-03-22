import type { Metadata } from "next"

const CANONICAL = "https://presencely-production.up.railway.app/dashboard/visibility"

export const metadata: Metadata = {
  title: "Visibility Report – SEO Dashboard",
  description:
    "Monitor your local business search visibility trends, keyword rankings, Google Maps position, and indexing status.",
  alternates: {
    canonical: CANONICAL,
  },
  openGraph: {
    title: "Visibility Report – Presencely SEO Dashboard",
    description:
      "Monitor your local business search visibility trends, keyword rankings, Google Maps position, and indexing status.",
    url: CANONICAL,
  },
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://presencely-production.up.railway.app",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Dashboard",
      item: "https://presencely-production.up.railway.app/dashboard",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Visibility",
      item: CANONICAL,
    },
  ],
}

export default function VisibilityLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  )
}
