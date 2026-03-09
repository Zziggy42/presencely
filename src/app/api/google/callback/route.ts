/**
 * GET /api/google/callback
 * Handles the OAuth callback from Google.
 * Exchanges auth code for tokens and stores them in Supabase.
 * Then redirects to the onboarding page (or dashboard if already set up).
 */

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { exchangeCodeForTokens, getGoogleUserInfo } from "@/lib/google/oauth"
import { getAccounts, getLocations } from "@/lib/google/business-profile"
import { getSites } from "@/lib/google/search-console"

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const code  = searchParams.get("code")
  const state = searchParams.get("state")   // user_id
  const error = searchParams.get("error")

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin

  // User denied access
  if (error) {
    return NextResponse.redirect(
      `${appUrl}/onboarding?error=${encodeURIComponent(error)}`
    )
  }

  if (!code || !state) {
    return NextResponse.redirect(`${appUrl}/onboarding?error=missing_params`)
  }

  const clientId     = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${appUrl}/onboarding?error=not_configured`)
  }

  const redirectUri = `${appUrl}/api/google/callback`

  try {
    // 1. Exchange code for tokens
    const tokens = await exchangeCodeForTokens({
      code, clientId, clientSecret, redirectUri,
    })

    if (tokens.error) {
      return NextResponse.redirect(
        `${appUrl}/onboarding?error=${encodeURIComponent(tokens.error_description ?? tokens.error)}`
      )
    }

    const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString()

    // 2. Get Google user info
    const googleUser = await getGoogleUserInfo(tokens.access_token)

    // 3. Try to fetch GBP accounts (may fail if API access not yet approved)
    const gbpAccounts = await getAccounts(tokens.access_token)
    let gbpAccountId: string | null = null
    let gbpLocationId: string | null = null
    let gbpBusinessName: string | null = null

    if (gbpAccounts && gbpAccounts.length > 0) {
      gbpAccountId = gbpAccounts[0].name  // "accounts/123"
      const locations = await getLocations(tokens.access_token, gbpAccounts[0].name)
      if (locations && locations.length > 0) {
        gbpLocationId  = locations[0].name  // "accounts/123/locations/456"
        gbpBusinessName = locations[0].title
      }
    }

    // 4. Try to fetch Search Console sites
    const sites = await getSites(tokens.access_token)
    const primarySite = sites?.[0]?.siteUrl ?? null

    // 5. Store in Supabase
    const supabase = await createClient()

    const { error: upsertError } = await supabase
      .from("google_connections")
      .upsert(
        {
          user_id:       state,
          access_token:  tokens.access_token,
          refresh_token: tokens.refresh_token ?? null,
          token_expires_at: expiresAt,
          google_email:  googleUser.email,
          google_name:   googleUser.name,
          gbp_account_id:   gbpAccountId,
          gbp_location_id:  gbpLocationId,
          gbp_business_name: gbpBusinessName,
          gsc_site_url:  primarySite,
          connected_at:  new Date().toISOString(),
          updated_at:    new Date().toISOString(),
        },
        { onConflict: "user_id" }
      )

    if (upsertError) {
      console.error("Failed to save Google connection:", upsertError)
      return NextResponse.redirect(`${appUrl}/onboarding?error=db_error`)
    }

    // 6. Redirect to onboarding with success
    const params = new URLSearchParams({ connected: "true" })
    if (gbpBusinessName) params.set("business", gbpBusinessName)
    if (primarySite)     params.set("site", primarySite)

    return NextResponse.redirect(`${appUrl}/onboarding?${params}`)

  } catch (err) {
    console.error("Google OAuth callback error:", err)
    return NextResponse.redirect(`${appUrl}/onboarding?error=unexpected`)
  }
}
