/**
 * GET /api/google/search-console
 * Returns real Search Console keyword data for the connected user.
 * Falls back gracefully if not connected.
 */

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import {
  getRecentKeywords,
  getPagePerformance,
  summariseSearchData,
} from "@/lib/google/search-console"
import { refreshAccessToken, isTokenExpired } from "@/lib/google/oauth"

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ connected: false })
  }

  const { data: conn } = await supabase
    .from("google_connections")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (!conn?.gsc_site_url) {
    return NextResponse.json({ connected: false, reason: "Search Console not connected" })
  }

  // Refresh token if expired
  let accessToken = conn.access_token
  if (isTokenExpired(conn.token_expires_at) && conn.refresh_token) {
    const refreshed = await refreshAccessToken({
      refreshToken: conn.refresh_token,
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })

    if (refreshed.access_token) {
      accessToken = refreshed.access_token
      const expiresAt = new Date(Date.now() + refreshed.expires_in * 1000).toISOString()
      await supabase
        .from("google_connections")
        .update({ access_token: accessToken, token_expires_at: expiresAt })
        .eq("user_id", user.id)
    }
  }

  try {
    const [keywords, pages] = await Promise.all([
      getRecentKeywords(accessToken, conn.gsc_site_url),
      getPagePerformance(accessToken, conn.gsc_site_url),
    ])

    const summary = summariseSearchData(keywords)

    return NextResponse.json({
      connected: true,
      siteUrl: conn.gsc_site_url,
      summary,
      keywords: summary.topKeywords,
      pages: pages.map((p) => ({
        page: p.keys[0],
        clicks: p.clicks,
        impressions: p.impressions,
        position: Math.round(p.position * 10) / 10,
      })),
    })
  } catch (err) {
    console.error("Search Console fetch error:", err)
    return NextResponse.json({ connected: true, error: "Failed to fetch data" })
  }
}
