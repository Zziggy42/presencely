-- Migration: 001_google_connections
-- Creates the google_connections table for storing OAuth tokens per user.
-- Run this in your Supabase SQL editor or via the Supabase CLI.

CREATE TABLE IF NOT EXISTS google_connections (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- OAuth tokens
  access_token      TEXT NOT NULL,
  refresh_token     TEXT,
  token_expires_at  TIMESTAMPTZ,

  -- Google identity
  google_email      TEXT,
  google_name       TEXT,

  -- Google Business Profile
  gbp_account_id    TEXT,   -- "accounts/{account_id}"
  gbp_location_id   TEXT,   -- "accounts/{id}/locations/{id}"
  gbp_business_name TEXT,

  -- Google Search Console
  gsc_site_url      TEXT,   -- Verified property URL, e.g. "https://example.com/"

  -- Timestamps
  connected_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id)   -- One Google connection per user
);

-- Auto-update updated_at on any row change
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER google_connections_updated_at
  BEFORE UPDATE ON google_connections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security: users can only access their own connection
ALTER TABLE google_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own google connection"
  ON google_connections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own google connection"
  ON google_connections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own google connection"
  ON google_connections FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own google connection"
  ON google_connections FOR DELETE
  USING (auth.uid() = user_id);

-- Index for fast lookups by user_id
CREATE INDEX IF NOT EXISTS idx_google_connections_user_id
  ON google_connections(user_id);
