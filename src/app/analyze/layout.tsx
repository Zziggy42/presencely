import type { Metadata } from "next"

const CANONICAL = "https://presencely-production.up.railway.app/analyze"

export const metadata: Metadata = {
  title: "Analyze Your Website – SEO Audit Tool",
  description:
    "Run a free SEO audit on any local business URL. Get actionable fixes for metadata, Google Maps visibility, reviews, structured data, and more.",
  alternates: {
    canonical: CANONICAL,
  },
  openGraph: {
    title: "Analyze Your Website – Presencely SEO Audit Tool",
    description:
      "Run a free SEO audit on any local business URL. Get actionable fixes for metadata, Google Maps visibility, reviews, structured data, and more.",
    url: CANONICAL,
  },
}

const analyzeSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Presencely Website Analyzer",
  url: CANONICAL,
  applicationCategory: "BusinessApplication",
  description:
    "Free SEO audit tool for local businesses. Analyzes metadata, Google Maps presence, reviews, structured data, and online visibility.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${CANONICAL}?url={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
}

export default function AnalyzeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(analyzeSchema) }}
      />
      {children}
    </>
  )
}
