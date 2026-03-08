import { NextRequest, NextResponse } from "next/server"

export interface WebsiteScanResult {
  url: string
  reachable: boolean
  title: string | null
  metaDescription: string | null
  hasMetaDescription: boolean
  metaDescriptionLength: number | null
  hasCanonical: boolean
  hasSchemaMarkup: boolean
  schemaTypes: string[]
  hasOpenGraph: boolean
  hasTwitterCard: boolean
  hasGoogleAnalytics: boolean
  hasGoogleTagManager: boolean
  hasFavicon: boolean
  hasViewport: boolean
  isHttps: boolean
  // Derived scores
  seoScore: number       // 0-100
  findings: Finding[]
}

export interface Finding {
  type: "good" | "warning" | "error"
  label: string
  detail: string
  impact: "high" | "medium" | "low"
}

function extractMeta(html: string, name: string): string | null {
  const patterns = [
    new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${name}["']`, "i"),
  ]
  for (const re of patterns) {
    const m = html.match(re)
    if (m) return m[1]
  }
  return null
}

function extractTitle(html: string): string | null {
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  return m ? m[1].trim() : null
}

function extractSchemaTypes(html: string): string[] {
  const types: string[] = []
  const re = /"@type"\s*:\s*"([^"]+)"/g
  let m: RegExpExecArray | null
  while ((m = re.exec(html)) !== null) {
    if (!types.includes(m[1])) types.push(m[1])
  }
  return types
}

function buildFindings(data: Omit<WebsiteScanResult, "seoScore" | "findings">): Finding[] {
  const findings: Finding[] = []

  if (!data.hasMetaDescription || !data.metaDescription) {
    findings.push({ type: "error", label: "Missing meta description", detail: "Google shows this in search results — missing it loses clicks.", impact: "high" })
  } else if (data.metaDescriptionLength && data.metaDescriptionLength < 50) {
    findings.push({ type: "warning", label: "Meta description too short", detail: `Only ${data.metaDescriptionLength} chars — aim for 140–160 for maximum click-through.`, impact: "medium" })
  } else if (data.metaDescriptionLength && data.metaDescriptionLength > 160) {
    findings.push({ type: "warning", label: "Meta description too long", detail: `${data.metaDescriptionLength} chars — Google truncates after 160, cutting off your message.`, impact: "low" })
  } else {
    findings.push({ type: "good", label: "Meta description present", detail: `${data.metaDescriptionLength} chars — well optimised for search snippets.`, impact: "high" })
  }

  if (!data.hasSchemaMarkup) {
    findings.push({ type: "error", label: "No schema markup (JSON-LD)", detail: "Schema tells Google your hours, cuisine, price range — missing it hurts local rankings.", impact: "high" })
  } else {
    const types = data.schemaTypes.join(", ") || "detected"
    findings.push({ type: "good", label: "Schema markup present", detail: `Types found: ${types}. Helps Google understand your business.`, impact: "high" })
  }

  if (!data.hasOpenGraph) {
    findings.push({ type: "warning", label: "Missing Open Graph tags", detail: "When people share your site on social media it shows a blank preview — lost referral traffic.", impact: "medium" })
  } else {
    findings.push({ type: "good", label: "Open Graph tags present", detail: "Social shares will show a rich preview, improving click-through from socials.", impact: "medium" })
  }

  if (!data.isHttps) {
    findings.push({ type: "error", label: "Not using HTTPS", detail: "Google down-ranks HTTP sites and browsers show a security warning to visitors.", impact: "high" })
  } else {
    findings.push({ type: "good", label: "HTTPS secure", detail: "Secure connection — a basic trust signal for both Google and customers.", impact: "low" })
  }

  if (!data.hasGoogleAnalytics && !data.hasGoogleTagManager) {
    findings.push({ type: "warning", label: "No analytics detected", detail: "You're flying blind — no way to measure which online channels drive website visits.", impact: "medium" })
  } else {
    findings.push({ type: "good", label: "Analytics tracking active", detail: "Measurement is in place — you can see where traffic comes from.", impact: "medium" })
  }

  if (!data.hasCanonical) {
    findings.push({ type: "warning", label: "No canonical tag", detail: "Duplicate page versions may split your Google ranking signals.", impact: "low" })
  }

  if (!data.hasViewport) {
    findings.push({ type: "error", label: "Missing viewport meta tag", detail: "Site may not be mobile-friendly — Google penalises non-mobile sites in local search.", impact: "high" })
  }

  return findings
}

function calcSeoScore(findings: Finding[]): number {
  let score = 100
  for (const f of findings) {
    if (f.type === "error")   score -= f.impact === "high" ? 18 : f.impact === "medium" ? 10 : 5
    if (f.type === "warning") score -= f.impact === "high" ? 10 : f.impact === "medium" ? 6  : 3
  }
  return Math.max(0, Math.min(100, score))
}

export async function POST(req: NextRequest) {
  const { url } = await req.json()

  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "URL required" }, { status: 400 })
  }

  // Normalise URL
  let normalised = url.trim()
  if (!normalised.startsWith("http")) normalised = "https://" + normalised

  const isHttps = normalised.startsWith("https://")

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    const response = await fetch(normalised, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; PresencelyBot/1.0; +https://presencely.com/bot)",
        "Accept": "text/html",
      },
    })
    clearTimeout(timeout)

    const html = await response.text()

    const title            = extractTitle(html)
    const metaDescription  = extractMeta(html, "description")
    const hasCanonical     = /<link[^>]+rel=["']canonical["']/i.test(html)
    const hasSchemaMarkup  = html.includes("application/ld+json")
    const schemaTypes      = extractSchemaTypes(html)
    const hasOpenGraph     = html.includes('property="og:') || html.includes("property='og:")
    const hasTwitterCard   = html.includes('name="twitter:') || html.includes("name='twitter:")
    const hasGoogleAnalytics  = html.includes("gtag") || html.includes("ga(") || html.includes("_gaq")
    const hasGoogleTagManager = html.includes("googletagmanager.com")
    const hasFavicon       = html.includes('rel="icon"') || html.includes("rel='icon'") || html.includes("rel=\"shortcut icon\"")
    const hasViewport      = html.includes('name="viewport"') || html.includes("name='viewport'")

    const partial: Omit<WebsiteScanResult, "seoScore" | "findings"> = {
      url: normalised,
      reachable: true,
      title,
      metaDescription,
      hasMetaDescription: !!metaDescription,
      metaDescriptionLength: metaDescription?.length ?? null,
      hasCanonical,
      hasSchemaMarkup,
      schemaTypes,
      hasOpenGraph,
      hasTwitterCard,
      hasGoogleAnalytics,
      hasGoogleTagManager,
      hasFavicon,
      hasViewport,
      isHttps,
    }

    const findings  = buildFindings(partial)
    const seoScore  = calcSeoScore(findings)

    return NextResponse.json({ ...partial, findings, seoScore } satisfies WebsiteScanResult)

  } catch {
    // Site unreachable / timed out — return a degraded result
    const partial: Omit<WebsiteScanResult, "seoScore" | "findings"> = {
      url: normalised, reachable: false, title: null, metaDescription: null,
      hasMetaDescription: false, metaDescriptionLength: null,
      hasCanonical: false, hasSchemaMarkup: false, schemaTypes: [],
      hasOpenGraph: false, hasTwitterCard: false, hasGoogleAnalytics: false,
      hasGoogleTagManager: false, hasFavicon: false, hasViewport: false, isHttps,
    }
    const findings = buildFindings(partial)
    return NextResponse.json({ ...partial, findings, seoScore: 20 } satisfies WebsiteScanResult)
  }
}
