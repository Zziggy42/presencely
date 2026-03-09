/**
 * Google Places API client
 * Works immediately with an API key — no special approval needed.
 * Used to fetch real public business data (rating, reviews, photos, hours).
 * Docs: https://developers.google.com/maps/documentation/places/web-service
 */

const BASE = "https://maps.googleapis.com/maps/api/place"

export interface PlaceSearchResult {
  place_id: string
  name: string
  formatted_address: string
  rating?: number
  user_ratings_total?: number
  business_status?: string
}

export interface PlaceDetails {
  place_id: string
  name: string
  formatted_address: string
  formatted_phone_number?: string
  website?: string
  url: string                         // Google Maps URL
  rating?: number
  user_ratings_total?: number
  price_level?: number                // 0–4
  business_status?: string
  photos?: { photo_reference: string; height: number; width: number }[]
  opening_hours?: {
    open_now: boolean
    weekday_text: string[]
  }
  reviews?: {
    author_name: string
    rating: number
    relative_time_description: string
    text: string
    time: number
  }[]
  types?: string[]
  geometry?: {
    location: { lat: number; lng: number }
  }
}

/** Search for a business by name + city, returns the best match */
export async function findBusiness(
  name: string,
  city: string,
  apiKey: string
): Promise<PlaceSearchResult | null> {
  const input = encodeURIComponent(`${name} ${city}`)
  const url =
    `${BASE}/findplacefromtext/json?` +
    `input=${input}&inputtype=textquery&` +
    `fields=place_id,name,formatted_address,rating,user_ratings_total,business_status&` +
    `key=${apiKey}`

  const res = await fetch(url)
  const data = await res.json()

  if (data.status !== "OK" || !data.candidates?.length) return null
  return data.candidates[0] as PlaceSearchResult
}

/** Get full details for a Place ID */
export async function getPlaceDetails(
  placeId: string,
  apiKey: string
): Promise<PlaceDetails | null> {
  const fields = [
    "place_id", "name", "formatted_address", "formatted_phone_number",
    "website", "url", "rating", "user_ratings_total", "price_level",
    "business_status", "photos", "opening_hours", "reviews", "types", "geometry",
  ].join(",")

  const url =
    `${BASE}/details/json?` +
    `place_id=${placeId}&fields=${fields}&key=${apiKey}`

  const res = await fetch(url)
  const data = await res.json()

  if (data.status !== "OK") return null
  return data.result as PlaceDetails
}

/** Build a photo URL from a photo_reference */
export function buildPhotoUrl(
  photoReference: string,
  apiKey: string,
  maxWidth = 400
): string {
  return (
    `${BASE}/photo?` +
    `maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${apiKey}`
  )
}

/**
 * Derive a Presence Score component from Places data.
 * This gives a real signal before GBP API access is approved.
 */
export function derivePlacesSignals(details: PlaceDetails) {
  const photoCount = details.photos?.length ?? 0
  const reviewCount = details.user_ratings_total ?? 0
  const rating = details.rating ?? 0
  const hasWebsite = !!details.website
  const hasPhone = !!details.formatted_phone_number
  const hasHours = !!details.opening_hours?.weekday_text?.length

  // Unanswered reviews estimate (Places API doesn't expose response data)
  const recentReviews = details.reviews ?? []
  const avgResponseRate = 0 // unknown from public data — will be set by GBP API

  return {
    photoCount,
    reviewCount,
    rating,
    hasWebsite,
    hasPhone,
    hasHours,
    recentReviews,
    avgResponseRate,
    // Derived
    photoScore: Math.min(100, Math.round((photoCount / 20) * 100)),  // 20 photos = perfect
    reviewScore: Math.min(100, Math.round((Math.min(reviewCount, 500) / 500) * 100)),
    ratingScore: Math.round(((rating - 1) / 4) * 100), // 1–5 scaled to 0–100
  }
}
