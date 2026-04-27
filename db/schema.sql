-- Cloudflare D1 schema for Deeptechnology
-- Single source of truth. Re-applied by scripts/d1-migrate.mjs (idempotent via IF NOT EXISTS).

-- Admin login lockouts (per-IP failure counter w/ TTL stored as expires_at)
CREATE TABLE IF NOT EXISTS admin_lockouts (
  ip          TEXT    PRIMARY KEY,
  fails       INTEGER NOT NULL DEFAULT 0,
  expires_at  INTEGER NOT NULL  -- unix ms
);
CREATE INDEX IF NOT EXISTS idx_admin_lockouts_expires ON admin_lockouts(expires_at);

-- Admin sessions (UUID -> session, 24h TTL)
CREATE TABLE IF NOT EXISTS admin_sessions (
  token       TEXT    PRIMARY KEY,
  created_at  INTEGER NOT NULL,
  expires_at  INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON admin_sessions(expires_at);

-- Quotes (full quote record stored as JSON; columns indexed for common lookups)
CREATE TABLE IF NOT EXISTS quotes (
  id          TEXT    PRIMARY KEY,
  email       TEXT,
  status      TEXT,
  data        TEXT    NOT NULL,  -- JSON blob
  created_at  INTEGER NOT NULL,
  updated_at  INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_quotes_created ON quotes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotes_email   ON quotes(email);
CREATE INDEX IF NOT EXISTS idx_quotes_status  ON quotes(status);

-- Chat history (one row per conversation key)
CREATE TABLE IF NOT EXISTS chat_history (
  key         TEXT    PRIMARY KEY,  -- e.g. 'chat:order123:history' or 'chat:anon:sess:history'
  messages    TEXT    NOT NULL,     -- JSON array
  expires_at  INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_chat_expires ON chat_history(expires_at);

-- Leads (combined ROI calculator + compare-unlock captures)
CREATE TABLE IF NOT EXISTS leads (
  id          TEXT    PRIMARY KEY,
  source      TEXT    NOT NULL,   -- 'roi_calculator' | 'compare_unlock'
  email       TEXT    NOT NULL,
  data        TEXT    NOT NULL,   -- JSON blob (varies by source)
  created_at  INTEGER NOT NULL,
  expires_at  INTEGER             -- nullable; 90-day soft retention
);
CREATE INDEX IF NOT EXISTS idx_leads_source  ON leads(source, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_expires ON leads(expires_at);

-- Vendor prospects (admin-collected at events / cold outreach)
CREATE TABLE IF NOT EXISTS vendor_prospects (
  id          TEXT    PRIMARY KEY,
  data        TEXT    NOT NULL,   -- full JSON record
  created_at  INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_vp_created ON vendor_prospects(created_at DESC);

-- Rate limits (sliding window: one row per request, count rows in window)
CREATE TABLE IF NOT EXISTS rate_limits (
  bucket  TEXT    NOT NULL,   -- e.g. 'rl:chat'
  ip      TEXT    NOT NULL,
  ts      INTEGER NOT NULL,   -- unix ms of request
  PRIMARY KEY (bucket, ip, ts)
);
CREATE INDEX IF NOT EXISTS idx_rate_limits_lookup ON rate_limits(bucket, ip, ts);

-- Work orders (one row per quote in procurement)
CREATE TABLE IF NOT EXISTS work_orders (
  id          TEXT    PRIMARY KEY,    -- matches quote id
  data        TEXT    NOT NULL,       -- full JSON record
  created_at  INTEGER NOT NULL,
  updated_at  INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_work_orders_created ON work_orders(created_at DESC);

-- Portal magic-link tokens (1h TTL, single-use)
CREATE TABLE IF NOT EXISTS portal_tokens (
  token       TEXT    PRIMARY KEY,
  email       TEXT    NOT NULL,
  expires_at  INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_portal_tokens_expires ON portal_tokens(expires_at);

-- Per-session daily message cap (chat)
CREATE TABLE IF NOT EXISTS chat_session_caps (
  session_id  TEXT    NOT NULL,
  day         TEXT    NOT NULL,        -- YYYY-MM-DD
  count       INTEGER NOT NULL DEFAULT 0,
  expires_at  INTEGER NOT NULL,
  PRIMARY KEY (session_id, day)
);
CREATE INDEX IF NOT EXISTS idx_chat_caps_expires ON chat_session_caps(expires_at);

-- Chat lead emails (per-session captured email from chat gate)
CREATE TABLE IF NOT EXISTS chat_leads (
  session_id   TEXT    PRIMARY KEY,
  email        TEXT    NOT NULL,
  captured_at  INTEGER NOT NULL,
  expires_at   INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_chat_leads_expires  ON chat_leads(expires_at);
CREATE INDEX IF NOT EXISTS idx_chat_leads_captured ON chat_leads(captured_at DESC);
