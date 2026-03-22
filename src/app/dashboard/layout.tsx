import type { Metadata } from "next"
import Sidebar from "@/components/layout/Sidebar"

const CANONICAL = "https://presencely-production.up.railway.app/dashboard"

export const metadata: Metadata = {
  title: "SEO Dashboard – Site Overview",
  description:
    "View your local business SEO health at a glance. Track Google Maps rankings, review scores, visibility trends, and optimization tasks.",
  alternates: {
    canonical: CANONICAL,
  },
  openGraph: {
    title: "SEO Dashboard – Presencely Site Overview",
    description:
      "View your local business SEO health at a glance. Track Google Maps rankings, review scores, visibility trends, and optimization tasks.",
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
      item: CANONICAL,
    },
  ],
}

export default function DashboardLayout({
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
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <Sidebar />
        {/* pt-14 on mobile = space for fixed top bar; pb-16 = space for bottom tab bar */}
        <main className="flex-1 overflow-y-auto pt-14 pb-16 md:pt-0 md:pb-0">
          {children}
        </main>
      </div>
    </>
  )
}
