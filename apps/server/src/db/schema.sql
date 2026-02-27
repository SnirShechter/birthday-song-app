-- Birthday Song App - Database Schema
-- PostgreSQL DDL

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- ORDERS
-- ============================================================
CREATE TABLE orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           TEXT,
  recipient_name  TEXT NOT NULL,
  recipient_nickname TEXT,
  recipient_gender TEXT NOT NULL CHECK (recipient_gender IN ('male', 'female', 'other')),
  recipient_age   INTEGER CHECK (recipient_age IS NULL OR (recipient_age >= 1 AND recipient_age <= 120)),
  relationship    TEXT,
  personality_traits TEXT[],
  hobbies         TEXT,
  funny_story     TEXT,
  occupation      TEXT,
  pet_peeve       TEXT,
  important_people TEXT,
  shared_memory   TEXT,
  desired_message TEXT,
  desired_tone    TEXT CHECK (desired_tone IS NULL OR desired_tone IN ('funny', 'emotional', 'mixed')),
  questionnaire_raw JSONB NOT NULL DEFAULT '{}',
  language        TEXT NOT NULL DEFAULT 'he' CHECK (language IN ('he', 'en')),
  selected_style  TEXT CHECK (selected_style IS NULL OR selected_style IN ('pop', 'rap', 'rock', 'ballad', 'mizrachi', 'classic', 'comedy')),
  selected_lyrics_id INTEGER,
  selected_song_id   INTEGER,
  social_source   TEXT,
  social_data     JSONB,
  status          TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'questionnaire_done', 'lyrics_ready', 'song_ready', 'preview_played', 'paid', 'completed')),
  referral_code   TEXT,
  utm_source      TEXT,
  utm_medium      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_email ON orders(email);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_referral_code ON orders(referral_code);

-- ============================================================
-- LYRICS VARIATIONS
-- ============================================================
CREATE TABLE lyrics_variations (
  id              SERIAL PRIMARY KEY,
  order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  model           TEXT NOT NULL CHECK (model IN ('claude', 'gpt4o', 'gemini')),
  style_variant   TEXT NOT NULL CHECK (style_variant IN ('pop', 'rap', 'rock', 'ballad', 'mizrachi', 'classic', 'comedy')),
  content         TEXT NOT NULL,
  selected        BOOLEAN NOT NULL DEFAULT FALSE,
  edited_content  TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_lyrics_order_id ON lyrics_variations(order_id);
CREATE INDEX idx_lyrics_selected ON lyrics_variations(order_id, selected) WHERE selected = TRUE;

-- ============================================================
-- SONG VARIATIONS
-- ============================================================
CREATE TABLE song_variations (
  id              SERIAL PRIMARY KEY,
  order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  provider        TEXT NOT NULL,
  provider_id     TEXT,
  style_prompt    TEXT,
  audio_url       TEXT,
  preview_url     TEXT,
  duration_seconds INTEGER,
  selected        BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_songs_order_id ON song_variations(order_id);
CREATE INDEX idx_songs_selected ON song_variations(order_id, selected) WHERE selected = TRUE;

-- ============================================================
-- VIDEO CLIPS
-- ============================================================
CREATE TABLE video_clips (
  id              SERIAL PRIMARY KEY,
  order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  provider        TEXT NOT NULL,
  provider_id     TEXT,
  photo_urls      TEXT[] DEFAULT '{}',
  video_style     TEXT NOT NULL,
  video_url       TEXT,
  status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at    TIMESTAMPTZ
);

CREATE INDEX idx_video_order_id ON video_clips(order_id);
CREATE INDEX idx_video_status ON video_clips(status);

-- ============================================================
-- PAYMENTS
-- ============================================================
CREATE TABLE payments (
  id                    SERIAL PRIMARY KEY,
  order_id              UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_type          TEXT NOT NULL CHECK (product_type IN ('song', 'bundle', 'premium', 'pack_5', 'pack_10')),
  amount_cents          INTEGER NOT NULL CHECK (amount_cents > 0),
  currency              TEXT NOT NULL DEFAULT 'ILS',
  stripe_session_id     TEXT,
  stripe_payment_intent TEXT,
  status                TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'refunded')),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  paid_at               TIMESTAMPTZ
);

CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_stripe_session ON payments(stripe_session_id);
CREATE INDEX idx_payments_status ON payments(status);

-- ============================================================
-- EVENTS (analytics / audit log)
-- ============================================================
CREATE TABLE events (
  id          SERIAL PRIMARY KEY,
  order_id    UUID REFERENCES orders(id) ON DELETE SET NULL,
  event_type  TEXT NOT NULL,
  payload     JSONB DEFAULT '{}',
  ip_address  TEXT,
  user_agent  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_events_order_id ON events(order_id);
CREATE INDEX idx_events_type ON events(event_type);
CREATE INDEX idx_events_created_at ON events(created_at DESC);

-- ============================================================
-- REFERRAL CODES
-- ============================================================
CREATE TABLE referral_codes (
  id              SERIAL PRIMARY KEY,
  code            TEXT NOT NULL UNIQUE,
  owner_name      TEXT NOT NULL,
  discount_percent INTEGER NOT NULL DEFAULT 10 CHECK (discount_percent >= 0 AND discount_percent <= 100),
  max_uses        INTEGER,
  current_uses    INTEGER NOT NULL DEFAULT 0,
  active          BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_referral_code ON referral_codes(code);
CREATE INDEX idx_referral_active ON referral_codes(active) WHERE active = TRUE;

-- ============================================================
-- TRIGGERS: auto-update updated_at on orders
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
