/**
 * POST /api/google/places
 * Server-side proxy for the Google Places API.
 * Keeps the API key server-side (never exposed to the browser).
 *
 * Body: { name: string, city: string }
 * Returns: PlaceDetails or { error }
 */

import { NextRequest, NextResponse } from "next/server"
import { findBusiness, getPlaceDetails } from "@/lib/google/places"

export async function POST(req: NextRequest) {
  const { name, city } = await req.json()

  if (!name || !city) {
    return NextResponse.json({ error: "name and city are required" }, { status: 400 })
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey) {
    // Return a friendly not-configured response — client shows mock data instead
    return NextResponse.json(
      { error: "Places API not configured", fallback: true },
      { status: 200 }
    )
  }

  try {
    // Step 1: find the place_id
    const candidate = await findBusiness(name, city, apiKey)
    if (!candidate) {
      return NextResponse.json({ error: "Business not found", found: false }, { status: 200 })
    }

    // Step 2: get full details
    const details = await getPlaceDetails(candidate.place_id, apiKey)
    if (!details) {
      return NextResponse.json({ error: "Could not load details", found: false }, { status: 200 })
    }

    return NextResponse.json({ found: true, details })

  } catch (err) {
    console.error("Places API error:", err)
    return NextResponse.json({ error: "Places API error", fallback: true }, { status: 200 })
  }
}
