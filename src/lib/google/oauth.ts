/**
 * Google OAuth 2.0 utilities
 * Used for both Google Business Profile and Search Console connections.
 * Auth docs: https://developers.google.com/identity/protocols/oauth2/web-server
 */

export const GOOGLE_SCOPES = [
  "openid",
  "email",
  "profile",
  "https://www.googleapis.com/auth/business.manage",   // Google Business Profile
  "https://www.googleapis.com/auth/webmasters.readonly", // Search Console
]

export interface TokenResponse {
  access_token: string
  refresh_token?: string
  expires_in: number
  token_type: string
  scope: string
  error?: string
  error_description?: string
}

export interface GoogleUserInfo {
  id: string
  email: string
  name: string
  picture: string
}

/** Build the Google OAuth consent-screen URL */
export function buildAuthUrl({
  clientId,
  redirectUri,
  state,
  scopes = GOOGLE_SCOPES,
}: {
  clientId: string
  redirectUri: string
  state: string
  scopes?: string[]
}): string {
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth")
  url.searchParams.set("client_id", clientId)
  url.searchParams.set("redirect_uri", redirectUri)
  url.searchParams.set("response_type", "code")
  url.searchParams.set("scope", scopes.join(" "))
  url.searchParams.set("access_type", "offline")   // get refresh token
  url.searchParams.set("prompt", "consent")         // always show consent (forces refresh token)
  url.searchParams.set("state", state)
  return url.toString()
}

/** Exchange an authorisation code for access + refresh tokens */
export async function exchangeCodeForTokens({
  code,
  clientId,
  clientSecret,
  redirectUri,
}: {
  code: string
  clientId: string
  clientSecret: string
  redirectUri: string
}): Promise<TokenResponse> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  })
  return res.json()
}

/** Use a refresh token to get a new access token */
export async function refreshAccessToken({
  refreshToken,
  clientId,
  clientSecret,
}: {
  refreshToken: string
  clientId: string
  clientSecret: string
}): Promise<TokenResponse> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token",
    }),
  })
  return res.json()
}

/** Get the authenticated user's Google profile */
export async function getGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo> {
  const res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  return res.json()
}

/** Check whether an access token is still valid, refresh if needed */
export function isTokenExpired(expiresAt: string): boolean {
  return new Date(expiresAt) < new Date(Date.now() + 60_000) // 1 min buffer
}
