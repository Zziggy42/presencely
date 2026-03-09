/**
 * Google Search Console API client
 * Available to anyone with a verified property — no special approval.
 * Requires OAuth scope: https://www.googleapis.com/auth/webmasters.readonly
 * Docs: https://developers.google.com/webmaster-tools/v1/api_reference_index
 */

const BASE = "https://www.googleapis.com/webmasters/v3"

export interface SearchAnalyticsRow {
  keys: string[]       // e.g. [keyword] or [page]
  clicks: number
  impressions: number
  ctr: number          // 0–1
  position: number     // avg ranking position
}

export interface SearchAnalyticsResponse {
  rows?: SearchAnalyticsRow[]
  error?: { code: number; message: string }
}

export interface SiteEntry {
  siteUrl: string
  permissionLevel: "siteOwner" | "siteFullUser" | "siteRestrictedUser" | "siteDelegatedOwner"
}

/** List all Search Console properties the user has access to */
export async function getSites(accessToken: string): Promise<SiteEntry[]> {
  const res = await fetch(`${BASE}/sites`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  const data = await res.json()
  return data.siteEntry ?? []
}

/** Query search analytics — keywords, impressions, clicks, positions */
export async function getSearchAnalytics({
  accessToken,
  siteUrl,
  startDate,
  endDate,
  dimensions = ["query"],
  rowLimit = 100,
}: {
  accessToken: string
  siteUrl: string
  startDate: string   // "YYYY-MM-DD"
  endDate: string     // "YYYY-MM-DD"
  dimensions?: string[]
  rowLimit?: number
}): Promise<SearchAnalyticsResponse> {
  const res = await fetch(
    `${BASE}/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ startDate, endDate, dimensions, rowLimit, type: "web" }),
    }
  )
  return res.json()
}

/** Get keyword data for the last 28 days */
export async function getRecentKeywords(
  accessToken: string,
  siteUrl: string,
  limit = 50
): Promise<SearchAnalyticsRow[]> {
  const end = new Date()
  const start = new Date(end)
  start.setDate(start.getDate() - 28)

  const fmt = (d: Date) => d.toISOString().split("T")[0]

  const data = await getSearchAnalytics({
    accessToken,
    siteUrl,
    startDate: fmt(start),
    endDate: fmt(end),
    dimensions: ["query"],
    rowLimit: limit,
  })

  return data.rows ?? []
}

/** Get page performance for the last 28 days */
export async function getPagePerformance(
  accessToken: string,
  siteUrl: string
): Promise<SearchAnalyticsRow[]> {
  const end = new Date()
  const start = new Date(end)
  start.setDate(start.getDate() - 28)

  const fmt = (d: Date) => d.toISOString().split("T")[0]

  const data = await getSearchAnalytics({
    accessToken,
    siteUrl,
    startDate: fmt(start),
    endDate: fmt(end),
    dimensions: ["page"],
    rowLimit: 25,
  })

  return data.rows ?? []
}

/** Summarise totals from search analytics rows */
export function summariseSearchData(rows: SearchAnalyticsRow[]) {
  const totalClicks = rows.reduce((s, r) => s + r.clicks, 0)
  const totalImpressions = rows.reduce((s, r) => s + r.impressions, 0)
  const avgCtr = totalImpressions > 0 ? totalClicks / totalImpressions : 0
  const avgPosition =
    rows.length > 0
      ? rows.reduce((s, r) => s + r.position, 0) / rows.length
      : 0

  const topKeywords = rows
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 10)
    .map((r) => ({
      keyword: r.keys[0],
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: Math.round(r.ctr * 100),
      position: Math.round(r.position * 10) / 10,
    }))

  return { totalClicks, totalImpressions, avgCtr, avgPosition, topKeywords }
}
