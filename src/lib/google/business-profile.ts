/**
 * Google Business Profile API client
 * Requires applying for access at: https://developers.google.com/my-business/content/prereqs
 * OAuth scope: https://www.googleapis.com/auth/business.manage
 *
 * Until access is approved, functions return null gracefully.
 * The dashboard falls back to Places API data + mock data.
 */

const INFO_BASE = "https://mybusinessbusinessinformation.googleapis.com/v1"
const REVIEWS_BASE = "https://mybusiness.googleapis.com/v4"

export interface GBPAccount {
  name: string          // "accounts/{account_id}"
  accountName: string
  type: string
  role: string
}

export interface GBPLocation {
  name: string          // "accounts/{id}/locations/{id}"
  title: string
  phoneNumbers?: { primaryPhone: string }
  websiteUri?: string
  regularHours?: {
    periods: { openDay: string; openTime: string; closeDay: string; closeTime: string }[]
  }
  profile?: { description: string }
  metadata?: {
    mapsUri: string
    newReviewUri: string
    placeId: string
  }
}

export interface GBPReview {
  name: string
  reviewId: string
  reviewer: { displayName: string; profilePhotoUrl: string; isAnonymous: boolean }
  starRating: "ONE" | "TWO" | "THREE" | "FOUR" | "FIVE"
  comment?: string
  createTime: string
  updateTime: string
  reviewReply?: { comment: string; updateTime: string }
}

export interface GBPReviewsResponse {
  reviews?: GBPReview[]
  averageRating?: number
  totalReviewCount?: number
  nextPageToken?: string
}

/** List all GBP accounts for the authenticated user */
export async function getAccounts(
  accessToken: string
): Promise<GBPAccount[] | null> {
  try {
    const res = await fetch(`${INFO_BASE}/accounts`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.accounts ?? []
  } catch {
    return null
  }
}

/** List all locations for a GBP account */
export async function getLocations(
  accessToken: string,
  accountName: string  // "accounts/{account_id}"
): Promise<GBPLocation[] | null> {
  try {
    const readMask = [
      "name", "title", "phoneNumbers", "websiteUri",
      "regularHours", "profile", "metadata",
    ].join(",")

    const res = await fetch(
      `${INFO_BASE}/${accountName}/locations?readMask=${readMask}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    if (!res.ok) return null
    const data = await res.json()
    return data.locations ?? []
  } catch {
    return null
  }
}

/** Get reviews for a location */
export async function getReviews(
  accessToken: string,
  accountId: string,   // just the ID part, e.g. "123456789"
  locationId: string,  // just the ID part
  pageSize = 50
): Promise<GBPReviewsResponse | null> {
  try {
    const res = await fetch(
      `${REVIEWS_BASE}/accounts/${accountId}/locations/${locationId}/reviews?pageSize=${pageSize}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

/** Reply to a review */
export async function replyToReview(
  accessToken: string,
  accountId: string,
  locationId: string,
  reviewId: string,
  replyText: string
): Promise<boolean> {
  try {
    const res = await fetch(
      `${REVIEWS_BASE}/accounts/${accountId}/locations/${locationId}/reviews/${reviewId}/reply`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment: replyText }),
      }
    )
    return res.ok
  } catch {
    return false
  }
}

/** Convert star rating string to number */
export function starRatingToNumber(rating: GBPReview["starRating"]): number {
  return { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 }[rating] ?? 0
}

/** Calculate response rate from reviews array */
export function calculateResponseRate(reviews: GBPReview[]): number {
  if (!reviews.length) return 0
  const answered = reviews.filter((r) => r.reviewReply).length
  return Math.round((answered / reviews.length) * 100)
}
