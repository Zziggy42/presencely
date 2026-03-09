/**
 * GET /api/google/status
 * Returns the current Google connection status for the authenticated user.
 * Used by the dashboard and settings page to show connected/disconnected state.
 */

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export interface GoogleConnectionStatus {
  connected: boolean
  googleEmail?: string
  googleName?: string
  gbpConnected: boolean
  gbpBusinessName?: string
  gbpAccountId?: string
  gbpLocationId?: string
  gscConnected: boolean
  gscSiteUrl?: string
  connectedAt?: string
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ connected: false, gbpConnected: false, gscConnected: false })
  }

  const { data, error } = await supabase
    .from("google_connections")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (error || !data) {
    return NextResponse.json<GoogleConnectionStatus>({
      connected: false,
      gbpConnected: false,
      gscConnected: false,
    })
  }

  return NextResponse.json<GoogleConnectionStatus>({
    connected: true,
    googleEmail:    data.google_email,
    googleName:     data.google_name,
    gbpConnected:   !!data.gbp_account_id,
    gbpBusinessName: data.gbp_business_name,
    gbpAccountId:   data.gbp_account_id,
    gbpLocationId:  data.gbp_location_id,
    gscConnected:   !!data.gsc_site_url,
    gscSiteUrl:     data.gsc_site_url,
    connectedAt:    data.connected_at,
  })
}
