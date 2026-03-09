/**
 * GET /api/google/connect
 * Initiates Google OAuth flow.
 * Redirects the user to Google's consent screen.
 *
 * Query params:
 *   state  — arbitrary string (we use user_id from Supabase session)
 */

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { buildAuthUrl } from "@/lib/google/oauth"

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL("/auth/login", req.url))
  }

  const clientId = process.env.GOOGLE_CLIENT_ID
  if (!clientId) {
    return NextResponse.json(
      { error: "GOOGLE_CLIENT_ID not configured" },
      { status: 500 }
    )
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin
  const redirectUri = `${appUrl}/api/google/callback`

  // state = userId so we can attach tokens to the right user in the callback
  const authUrl = buildAuthUrl({
    clientId,
    redirectUri,
    state: user.id,
  })

  return NextResponse.redirect(authUrl)
}
