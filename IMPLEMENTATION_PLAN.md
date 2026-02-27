# Birthday Song App — Implementation Plan (Demo / Mock Mode)

> All AI services, payments, and social scraping are **mocked** — no API keys needed.
> This plan produces a fully working demo you can click through end-to-end.

---

## 1. Project Structure (Monorepo)

```
birthday-song-app/
├── docker-compose.yml
├── .env.example
├── package.json                  # Workspace root (pnpm workspaces)
├── pnpm-workspace.yaml
├── turbo.json                    # Turborepo config
├── PRODUCT_PLAN.md
├── IMPLEMENTATION_PLAN.md
│
├── packages/
│   └── shared/                   # Shared types & constants
│       ├── package.json
│       └── src/
│           ├── types.ts          # Order, Lyrics, Song, Video, Payment types
│           ├── constants.ts      # Styles, languages, tiers, prices
│           ├── schemas.ts        # Zod schemas (shared validation)
│           └── index.ts
│
├── apps/
│   ├── server/                   # Hono backend
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── Dockerfile
│   │   └── src/
│   │       ├── index.ts          # Hono app entry
│   │       ├── db/
│   │       │   ├── schema.sql    # PostgreSQL DDL
│   │       │   ├── seed.sql      # Demo seed data
│   │       │   └── client.ts     # Postgres client (postgres.js)
│   │       ├── routes/
│   │       │   ├── orders.ts     # /api/orders CRUD
│   │       │   ├── lyrics.ts     # /api/orders/:id/generate-lyrics
│   │       │   ├── songs.ts      # /api/orders/:id/generate-songs
│   │       │   ├── video.ts      # /api/orders/:id/video
│   │       │   ├── checkout.ts   # /api/orders/:id/checkout (mock Stripe)
│   │       │   ├── share.ts      # /api/orders/:id/share
│   │       │   └── admin.ts      # /api/admin/stats
│   │       ├── services/
│   │       │   ├── mock-lyrics.ts    # Fake Claude/GPT/Gemini responses
│   │       │   ├── mock-music.ts     # Fake Suno responses + bundled MP3
│   │       │   ├── mock-video.ts     # Fake Kling/Runway responses + bundled MP4
│   │       │   ├── mock-social.ts    # Fake Instagram scrape
│   │       │   └── mock-stripe.ts    # Fake Stripe checkout session
│   │       ├── queue/
│   │       │   ├── worker.ts     # BullMQ worker (lyrics, music, video)
│   │       │   └── queues.ts     # Queue definitions
│   │       └── middleware/
│   │           ├── rate-limit.ts
│   │           └── cors.ts
│   │
│   └── web/                      # React frontend
│       ├── package.json
│       ├── tsconfig.json
│       ├── vite.config.ts
│       ├── Dockerfile
│       ├── index.html
│       ├── tailwind.config.ts
│       └── src/
│           ├── main.tsx
│           ├── App.tsx
│           ├── i18n/
│           │   ├── he.json       # Hebrew strings
│           │   └── en.json       # English strings
│           ├── stores/
│           │   ├── order.ts      # Zustand — order + questionnaire state
│           │   ├── ui.ts         # Zustand — theme, language, RTL
│           │   └── player.ts     # Zustand — audio playback
│           ├── pages/
│           │   ├── Landing.tsx
│           │   ├── Questionnaire.tsx
│           │   ├── StylePicker.tsx
│           │   ├── LyricsReview.tsx
│           │   ├── SongPreview.tsx
│           │   ├── Checkout.tsx
│           │   ├── Success.tsx
│           │   ├── VideoUpload.tsx
│           │   ├── SharePage.tsx
│           │   └── NotFound.tsx
│           ├── components/
│           │   ├── ui/           # shadcn/ui base (glass variants)
│           │   │   ├── Button.tsx
│           │   │   ├── Card.tsx
│           │   │   ├── Input.tsx
│           │   │   ├── Progress.tsx
│           │   │   ├── RadioGroup.tsx
│           │   │   ├── Dialog.tsx
│           │   │   ├── Select.tsx
│           │   │   └── Badge.tsx
│           │   ├── layout/
│           │   │   ├── Shell.tsx          # App shell (nav, footer, RTL wrapper)
│           │   │   ├── ThemeToggle.tsx
│           │   │   └── LangToggle.tsx
│           │   ├── questionnaire/
│           │   │   ├── ChatBubble.tsx     # AI / User chat bubbles
│           │   │   ├── QuestionStep.tsx   # Single question renderer
│           │   │   ├── SocialAutofill.tsx # "Scan profile" mock
│           │   │   └── ProgressBar.tsx    # Thin gradient bar
│           │   ├── lyrics/
│           │   │   ├── LyricsCarousel.tsx # Swipeable cards
│           │   │   ├── LyricsCard.tsx     # Single variation card
│           │   │   └── LyricsEditor.tsx   # Inline edit textarea
│           │   ├── player/
│           │   │   ├── AudioPlayer.tsx    # Sticky bottom bar
│           │   │   ├── Waveform.tsx       # Canvas waveform vis
│           │   │   └── MiniPlayer.tsx     # Compact preview player
│           │   ├── video/
│           │   │   ├── PhotoUploader.tsx  # Drag-and-drop grid
│           │   │   ├── VideoPlayer.tsx    # Embedded player
│           │   │   └── StyleGrid.tsx      # Video style selector
│           │   ├── checkout/
│           │   │   ├── TierSelector.tsx   # Song / Bundle / Premium radio
│           │   │   └── MockStripe.tsx     # Fake Stripe Checkout overlay
│           │   └── shared/
│           │       ├── Confetti.tsx       # canvas-confetti wrapper
│           │       ├── LoadingScreen.tsx  # Rotating messages + progress
│           │       ├── SocialProof.tsx    # "2,347 songs this week"
│           │       └── GradientText.tsx   # Animated gradient headline
│           ├── hooks/
│           │   ├── useOrder.ts           # API calls for order lifecycle
│           │   ├── usePolling.ts         # Poll generation status
│           │   └── useDirection.ts       # RTL/LTR helper
│           ├── lib/
│           │   ├── api.ts               # fetch wrapper (base URL, error handling)
│           │   └── cn.ts                # clsx + twMerge utility
│           ├── assets/
│           │   ├── mock/
│           │   │   ├── preview-pop.mp3       # 10s sample pop song
│           │   │   ├── preview-rap.mp3       # 10s sample rap song
│           │   │   ├── preview-mizrachi.mp3  # 10s sample mizrachi song
│           │   │   ├── full-song-pop.mp3     # Full 2-min pop song
│           │   │   └── demo-video.mp4        # 30s demo birthday video
│           │   └── images/
│           │       └── hero-gradient.webp
│           └── styles/
│               └── globals.css           # Tailwind directives + custom vars
│
└── mock-assets/                  # Git-LFS or external hosting
    ├── README.md                 # How to obtain / generate mock audio
    ├── songs/                    # Pre-recorded mock MP3s
    └── videos/                   # Pre-recorded mock MP4s
```

---

## 2. Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Monorepo** | pnpm workspaces + Turborepo | pnpm 9, turbo 2 | Workspace management, task caching |
| **Frontend** | React | 19 | UI framework |
| **Build** | Vite | 6 | Bundler / dev server |
| **Language** | TypeScript | 5.7 | Type safety everywhere |
| **Styling** | Tailwind CSS | 4 | Utility-first CSS |
| **Components** | shadcn/ui | latest | Accessible primitives (customized glass variants) |
| **Animations** | Framer Motion | 12 | Page transitions, micro-interactions |
| **State** | Zustand | 5 | Lightweight global state |
| **Routing** | React Router | 7 | Client-side routing |
| **i18n** | i18next + react-i18next | 24 / 15 | Hebrew / English translation |
| **Audio** | Howler.js | 2.2 | Cross-browser audio playback |
| **Icons** | Lucide React | latest | Consistent iconography |
| **Confetti** | canvas-confetti | 1.9 | Purchase celebration effect |
| **Validation** | Zod | 3.24 | Shared request/response schemas |
| **Backend** | Hono | 4 | Lightweight HTTP framework |
| **Runtime** | Node.js | 22 LTS | Server runtime |
| **Database** | PostgreSQL | 16 | Persistent storage |
| **DB Client** | postgres.js (porsager) | 3 | Zero-dep Postgres driver |
| **Queue** | BullMQ + Redis | 5 / 7 | Async job processing |
| **Fonts** | Plus Jakarta Sans, Inter, Heebo | — | Google Fonts (Latin + Hebrew) |
| **Containerization** | Docker + Docker Compose | 27 / 2.31 | Local dev + deployment |

---

## 3. Mock Data Strategy

Every external service is replaced by a deterministic mock that returns realistic data after a simulated delay.

### 3a. AI Lyrics (Claude / GPT-4o / Gemini)

**File:** `apps/server/src/services/mock-lyrics.ts`

- A JSON map of ~6 pre-written Hebrew + English lyric sets, keyed by `(style, language)`.
- Each set has 3 variations tagged as `claude`, `gpt4o`, `gemini`.
- Lyrics contain template tokens (`{{NAME}}`, `{{AGE}}`, `{{HOBBY}}`, `{{FUNNY}}`) that get string-replaced with questionnaire answers at runtime.
- Simulated delay: random 1500-3500 ms per variation (parallel).

### 3b. AI Music (Suno v5)

**File:** `apps/server/src/services/mock-music.ts`

- 3-5 pre-recorded demo MP3 files (~10s previews + one full ~2 min song per style).
- Generate these once using Suno's free tier or find CC0/royalty-free birthday songs.
- The mock service returns a static URL pointing to the bundled file in `mock-assets/songs/`.
- Each call returns 2-3 "variations" — these are the same audio with different metadata labels.
- Simulated delay: random 3000-6000 ms.
- The `preview_url` field points to a 10s clip; the `audio_url` field points to the full track (unlocked on mock "payment").

### 3c. AI Video (Kling 2.6 / Runway)

**File:** `apps/server/src/services/mock-video.ts`

- 1-2 pre-recorded demo MP4 files (30s birthday-themed clips).
- The mock returns a polling-style status: `pending` -> `processing` -> `completed` over 3 poll cycles (simulating 10s real-time wait).
- Final response returns a static `video_url` pointing to `mock-assets/videos/`.

### 3d. Social Autofill (Instagram / TikTok)

**File:** `apps/server/src/services/mock-social.ts`

- A hardcoded set of 3 fake profiles (Hebrew male, Hebrew female, English male).
- Given any username/URL, returns one of these profiles after a 2s delay.
- Response shape matches the product plan's AI analysis output JSON.
- If input contains the word "private", returns `{ status: "private" }` to demonstrate the fallback UX.

### 3e. Stripe Payments

**File:** `apps/server/src/services/mock-stripe.ts`

- `createCheckoutSession()` returns a fake session ID and redirects to an in-app `/checkout/mock?session_id=xxx` page.
- The mock checkout page shows a styled "Pay $X.XX" button that instantly marks the order as `paid`.
- No real Stripe SDK or keys are loaded.
- Webhook simulation: the mock checkout page calls `POST /api/webhooks/stripe` with a fake event body.

### 3f. Email (Resend)

- Emails are logged to server console with full HTML body rather than sent.
- The success page shows a "Check your email (mocked — see server logs)" notice.

---

## 4. Database Schema (PostgreSQL)

```sql
-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================
-- ORDERS (core entity)
-- =====================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT,

  -- Questionnaire input
  recipient_name TEXT NOT NULL,
  recipient_nickname TEXT,
  recipient_gender TEXT CHECK (recipient_gender IN ('male', 'female', 'other')),
  recipient_age INT,
  relationship TEXT,
  personality_traits TEXT[],
  hobbies TEXT,
  funny_story TEXT,
  occupation TEXT,
  pet_peeve TEXT,
  important_people TEXT,
  shared_memory TEXT,
  desired_message TEXT,
  desired_tone TEXT CHECK (desired_tone IN ('funny', 'emotional', 'mixed')),
  questionnaire_raw JSONB NOT NULL DEFAULT '{}',
  language TEXT NOT NULL DEFAULT 'he',

  -- Selections
  selected_style TEXT,
  selected_lyrics_id INT,
  selected_song_id INT,

  -- Social autofill source (nullable)
  social_source TEXT,
  social_data JSONB,

  -- Status: draft -> questionnaire_done -> lyrics_ready -> song_ready -> preview_played -> paid -> completed
  status TEXT NOT NULL DEFAULT 'draft',

  -- UTM / referral
  referral_code TEXT,
  utm_source TEXT,
  utm_medium TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ===========================
-- LYRICS VARIATIONS (3-4 per order)
-- ===========================
CREATE TABLE lyrics_variations (
  id SERIAL PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,

  model TEXT NOT NULL,              -- 'claude' | 'gpt4o' | 'gemini'
  style_variant TEXT NOT NULL,      -- 'pop' | 'rap' | 'mizrachi' | ...
  content TEXT NOT NULL,

  selected BOOLEAN NOT NULL DEFAULT false,
  edited_content TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ===========================
-- SONG VARIATIONS (2-3 per order)
-- ===========================
CREATE TABLE song_variations (
  id SERIAL PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,

  provider TEXT NOT NULL DEFAULT 'suno',
  provider_id TEXT,
  style_prompt TEXT,

  audio_url TEXT,          -- full song (gated behind payment)
  preview_url TEXT,        -- 10s clip (free)
  duration_seconds INT,

  selected BOOLEAN NOT NULL DEFAULT false,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ===========================
-- VIDEO CLIPS (0-1 per order)
-- ===========================
CREATE TABLE video_clips (
  id SERIAL PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,

  provider TEXT NOT NULL DEFAULT 'kling',
  provider_id TEXT,

  photo_urls TEXT[],
  video_style TEXT,        -- 'party' | 'funny' | 'emotional' | 'music_video' | 'avatar'
  video_url TEXT,

  status TEXT NOT NULL DEFAULT 'pending',  -- pending -> processing -> completed -> failed

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- ===========================
-- PAYMENTS
-- ===========================
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id),

  product_type TEXT NOT NULL,        -- 'song' | 'bundle' | 'premium' | 'pack_5' | 'pack_10'
  amount_cents INT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',

  stripe_session_id TEXT,
  stripe_payment_intent TEXT,

  status TEXT NOT NULL DEFAULT 'pending',  -- pending -> completed -> refunded

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  paid_at TIMESTAMPTZ
);

-- ===========================
-- ANALYTICS EVENTS
-- ===========================
CREATE TABLE events (
  id BIGSERIAL PRIMARY KEY,
  order_id UUID REFERENCES orders(id),

  event_type TEXT NOT NULL,
  metadata JSONB,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ===========================
-- REFERRAL CODES
-- ===========================
CREATE TABLE referral_codes (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  owner_email TEXT,
  discount_percent INT NOT NULL DEFAULT 20,
  uses INT NOT NULL DEFAULT 0,
  max_uses INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ===========================
-- INDEXES
-- ===========================
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_email ON orders(email);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_lyrics_order ON lyrics_variations(order_id);
CREATE INDEX idx_songs_order ON song_variations(order_id);
CREATE INDEX idx_video_order ON video_clips(order_id);
CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_events_type ON events(event_type);
CREATE INDEX idx_events_order ON events(order_id);
```

---

## 5. API Endpoints

All routes are prefixed with `/api`. Request/response bodies are JSON. Errors follow `{ error: string, details?: any }`.

### Orders

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| `POST` | `/api/orders` | Create new order from questionnaire data | None |
| `GET` | `/api/orders/:id` | Get order with lyrics/songs/video | None (UUID is secret) |
| `PATCH` | `/api/orders/:id` | Update order (select lyrics/song, edit lyrics, set email) | None |

**POST /api/orders body:**
```json
{
  "recipientName": "string (required)",
  "recipientNickname": "string",
  "recipientGender": "male | female | other",
  "recipientAge": 30,
  "relationship": "string",
  "personalityTraits": ["string"],
  "hobbies": "string",
  "funnyStory": "string",
  "occupation": "string",
  "petPeeve": "string",
  "importantPeople": "string",
  "sharedMemory": "string",
  "desiredMessage": "string",
  "desiredTone": "funny | emotional | mixed",
  "language": "he | en"
}
```

### AI Generation

| Method | Path | Description | Notes |
|--------|------|-------------|-------|
| `POST` | `/api/orders/:id/generate-lyrics` | Queue lyric generation (3 variations) | Body: `{ style: "pop" }` |
| `GET` | `/api/orders/:id/lyrics` | Get all lyric variations for order | Returns array |
| `POST` | `/api/orders/:id/generate-songs` | Queue song generation (2-3 variations) | Body: `{ lyricsId: 1 }` |
| `GET` | `/api/orders/:id/songs` | Get all song variations for order | Returns array with preview/full URLs |
| `GET` | `/api/orders/:id/preview/:songId` | Redirect to 10s preview audio URL | Free / no auth |

### Video

| Method | Path | Description | Notes |
|--------|------|-------------|-------|
| `POST` | `/api/orders/:id/video` | Start video generation | Body: `{ photoUrls: [], videoStyle: "party" }` |
| `GET` | `/api/orders/:id/video/status` | Poll video generation status | Returns `{ status, videoUrl? }` |

### Checkout / Payment (Mocked)

| Method | Path | Description | Notes |
|--------|------|-------------|-------|
| `POST` | `/api/orders/:id/checkout` | Create mock checkout session | Body: `{ tier: "song" }`. Returns `{ checkoutUrl }` |
| `POST` | `/api/webhooks/stripe` | Mock webhook handler | Called by mock checkout page |
| `GET` | `/api/orders/:id/download` | Get download URLs (gated) | 403 if not paid |

### Social Autofill (Mocked)

| Method | Path | Description | Notes |
|--------|------|-------------|-------|
| `POST` | `/api/social/scan` | Mock-scrape a social profile | Body: `{ url: "string" }`. Returns profile JSON |

### Share

| Method | Path | Description | Notes |
|--------|------|-------------|-------|
| `GET` | `/api/orders/:id/share` | Public share metadata (OG tags) | For link previews |

### Admin

| Method | Path | Description | Notes |
|--------|------|-------------|-------|
| `GET` | `/api/admin/stats` | Dashboard counts (total orders, revenue, conversions) | Demo only |

---

## 6. Frontend Pages & Components

### Pages (React Router)

| Route | Page Component | Purpose |
|-------|---------------|---------|
| `/` | `Landing` | Hero, demo audio, social proof, CTA |
| `/create` | `Questionnaire` | Chat-style multi-step questionnaire |
| `/create/style` | `StylePicker` | Genre selection grid (7 styles) |
| `/create/lyrics` | `LyricsReview` | Carousel of 3 lyric variations + edit |
| `/create/preview` | `SongPreview` | Audio player (10s), song variation cards |
| `/checkout/:orderId` | `Checkout` | Tier selector + mock Stripe overlay |
| `/success` | `Success` | Confetti + download links + share buttons |
| `/video/:orderId` | `VideoUpload` | Photo uploader + video style picker |
| `/share/:orderId` | `SharePage` | Public page: embedded player + video + CTA |
| `*` | `NotFound` | 404 |

### Key Component Behaviors

**Landing**
- Gradient mesh background (CSS radial gradients animated with Framer Motion).
- Embedded `MiniPlayer` with a demo song (mock MP3).
- Counter: "X,XXX songs created" — static mock number.
- CTA scrolls/navigates to `/create`.
- Language toggle (he/en) in top bar.

**Questionnaire**
- Chat bubble interface — each question is an "AI bubble" that appears with a typing animation.
- User answers appear as "user bubbles" on the opposite side.
- `SocialAutofill` component: input a URL -> mock 2s loading -> auto-fill answers.
- Progress bar at top (thin gradient line, step X of 8+).
- `localStorage` persistence so refreshing doesn't lose progress.
- On completion: POST to `/api/orders`, then navigate to `/create/style`.

**StylePicker**
- 7 cards in a responsive grid (2 cols mobile, 3 cols tablet, 4 cols desktop).
- Each card: emoji icon, style name (he/en), short description, sample audio snippet (200ms on hover).
- Selection triggers `POST /api/orders/:id/generate-lyrics` then navigates to `/create/lyrics` with `LoadingScreen`.

**LyricsReview**
- Horizontal swipeable carousel (Framer Motion drag + snap).
- Each `LyricsCard`: model badge (Claude/GPT/Gemini), tone tag, full lyrics text, "Edit" toggle, "Choose this" button.
- `LyricsEditor`: inline textarea appears on the card for quick edits to a specific verse.
- "Refresh" button at bottom to re-generate (calls generate-lyrics again).
- On selection: PATCH order, then `POST /api/orders/:id/generate-songs`, navigate to preview with `LoadingScreen`.

**SongPreview**
- 2-3 song variation cards stacked vertically.
- Each card has a `MiniPlayer` with 10s waveform + play/pause.
- Waveform rendered via Canvas API (randomized bar heights for demo).
- "Unlock full song" CTA at bottom -> navigate to `/checkout/:orderId`.

**Checkout**
- Glass-card modal overlay.
- `TierSelector`: 3 radio options (Song $9.99 / Song+Video $19.99 / Premium $29.99) with pricing.
- `MockStripe`: styled overlay resembling Stripe Checkout with a single "Pay" button.
- On pay: calls mock webhook -> navigates to `/success`.

**Success**
- `Confetti` fires on mount.
- Download buttons (MP3, WAV — both point to same mock file).
- Share buttons: copy link, WhatsApp (deep link), Telegram, generic Web Share API.
- If video tier: CTA to `/video/:orderId`.

**VideoUpload**
- `PhotoUploader`: drag-and-drop zone (accepts images, max 10). Uses native File API — images are displayed as thumbnails but not actually uploaded in demo mode.
- `StyleGrid`: 5 video style cards (Party, Funny, Emotional, Music Video, Avatar).
- "Generate Video" button -> `LoadingScreen` with polling -> embedded `VideoPlayer` with mock MP4.

**SharePage**
- Public-facing page with embedded audio player + optional video.
- Recipient name as hero text.
- "Create your own" CTA -> `/`.

---

## 7. Design System

### Theme Tokens (Tailwind + CSS Custom Properties)

```
/* globals.css */

:root {
  --color-primary: #7C3AED;
  --color-accent: #EC4899;
  --color-energy: #F97316;

  --gradient-main: linear-gradient(135deg, #7C3AED, #EC4899);
  --gradient-energy: linear-gradient(135deg, #F97316, #EF4444);
  --gradient-cool: linear-gradient(135deg, #06B6D4, #7C3AED);
  --gradient-magic: linear-gradient(135deg, #F59E0B, #EC4899, #7C3AED);

  --bg: #FAFAFA;
  --surface: #FFFFFF;
  --text: #111827;
  --text-muted: #6B7280;
  --border: #E5E7EB;

  --glass-bg: rgba(255, 255, 255, 0.6);
  --glass-blur: 16px;
  --glass-border: rgba(255, 255, 255, 0.3);
}

.dark {
  --bg: #0F0F0F;
  --surface: #1A1A1A;
  --text: #F9FAFB;
  --text-muted: #9CA3AF;
  --border: #374151;

  --glass-bg: rgba(30, 30, 30, 0.6);
  --glass-border: rgba(255, 255, 255, 0.08);
}
```

### Glassmorphism Utility Class

```css
.glass {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  border-radius: 1rem;
}
```

Apply to: cards, modals, inputs, chat bubbles.

### Gradients

- **Hero background**: Multi-stop radial gradient (`--gradient-magic`) with animated position via Framer Motion (slow drift).
- **CTA buttons**: `--gradient-main` with hover brightness increase + glow shadow `0 8px 30px rgba(124,58,237,0.3)`.
- **Progress bar**: `--gradient-main` fill over neutral track.
- **Active selections**: `--gradient-main` border ring.

### Dark Mode

- Toggle via `ThemeToggle` component (sun/moon icon).
- Stored in `localStorage`, defaults to system `prefers-color-scheme`.
- Applied via `<html class="dark">` toggle + Tailwind `dark:` variants.
- Gradients become more saturated/glowing in dark mode (not muted).

### RTL / Hebrew

- `<html dir="rtl" lang="he">` set dynamically based on language store.
- Tailwind `rtl:` plugin for mirrored padding/margins.
- All text content loaded from i18n JSON files.
- Numbers, URLs, and English lyrics get `dir="ltr"` inline.
- Font stack: `Heebo` for Hebrew, `Plus Jakarta Sans` / `Inter` for Latin.

### Mobile-First

- Default styles target `< 640px`.
- Breakpoints: `sm:640px`, `md:768px`, `lg:1024px`.
- Questionnaire: full-bleed chat bubbles.
- Lyrics: full-width swipeable cards.
- Audio player: sticky bottom bar (56px height).
- Touch targets: minimum 44px.
- Song preview: stacked vertically, not side-by-side.

### Animations (Framer Motion)

| Element | Animation | Duration |
|---------|-----------|----------|
| Page transitions | Fade-up (`y:20 -> 0`, `opacity:0 -> 1`) | 400ms |
| Chat bubbles | Slide-in from side + fade | 300ms + 50ms stagger |
| Card hover | Scale 1.02 + purple glow shadow | 200ms |
| Button press | Scale 0.97 | 100ms |
| Waveform bars | Looping scaleY `[0.3, 1, 0.5, 0.8, 0.4]` | 1200ms |
| Progress bar | Width tween | 600ms ease-out |
| Confetti | Burst on mount | 3000ms |
| Loading dots | Pulsing opacity | 800ms infinite |
| Gradient background | Slow position drift | 8000ms infinite |

### Typography Scale (Mobile -> Desktop)

| Role | Mobile | Desktop | Font |
|------|--------|---------|------|
| Hero | `text-3xl` (30px) | `text-6xl` (60px) | Plus Jakarta Sans 800 |
| H2 | `text-2xl` (24px) | `text-4xl` (36px) | Plus Jakarta Sans 700 |
| H3 | `text-xl` (20px) | `text-2xl` (24px) | Plus Jakarta Sans 600 |
| Body | `text-base` (16px) | `text-base` (16px) | Inter 400 / Heebo 400 |
| Small | `text-sm` (14px) | `text-sm` (14px) | Inter 400 |
| Badge | `text-xs` (12px) | `text-xs` (12px) | Inter 500 |

---

## 8. Zustand Stores

### `stores/order.ts` — Order & Questionnaire State

```
State:
  orderId: string | null
  step: number                        // current questionnaire step (0-12)
  answers: Record<string, any>        // questionnaire answers keyed by field name
  selectedStyle: string | null        // 'pop' | 'rap' | 'mizrachi' | ...
  lyrics: LyricsVariation[]           // fetched from server
  selectedLyricsId: number | null
  songs: SongVariation[]              // fetched from server
  selectedSongId: number | null
  video: VideoClip | null
  paymentStatus: 'none' | 'pending' | 'completed'
  generationStatus: 'idle' | 'generating_lyrics' | 'generating_songs' | 'generating_video'

Actions:
  setAnswer(field, value)             // update one questionnaire answer
  nextStep() / prevStep()             // navigate questionnaire
  setStyle(style)                     // select music genre
  setLyrics(variations)              // store fetched lyrics
  selectLyrics(id)                   // mark one as selected
  updateLyricsContent(id, text)      // inline edit
  setSongs(variations)               // store fetched songs
  selectSong(id)                     // mark one as selected
  setVideo(clip)                     // store video data
  setPaymentStatus(status)
  setGenerationStatus(status)
  reset()                            // start over

Persistence:
  partialize → persist answers + step + orderId to localStorage
```

### `stores/ui.ts` — Theme, Language, Layout

```
State:
  theme: 'light' | 'dark' | 'system'
  language: 'he' | 'en'
  direction: 'rtl' | 'ltr'           // derived from language

Actions:
  setTheme(theme)
  setLanguage(lang)                   // also updates direction and i18n
  toggleTheme()

Persistence:
  persist theme + language to localStorage
```

### `stores/player.ts` — Audio Playback

```
State:
  currentTrackUrl: string | null
  currentTrackLabel: string | null
  isPlaying: boolean
  progress: number                    // 0-1
  duration: number                    // seconds

Actions:
  play(url, label)
  pause()
  toggle()
  seek(position)                      // 0-1
  setProgress(n)
  stop()

No persistence.
```

---

## 9. Docker Compose

```yaml
# docker-compose.yml

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: birthday_songs
      POSTGRES_USER: app
      POSTGRES_PASSWORD: devpassword
    ports:
      - "5432:5432"
    volumes:
      - pg_data:/var/lib/postgresql/data
      - ./apps/server/src/db/schema.sql:/docker-entrypoint-initdb.d/01-schema.sql
      - ./apps/server/src/db/seed.sql:/docker-entrypoint-initdb.d/02-seed.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app -d birthday_songs"]
      interval: 5s
      timeout: 3s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5

  server:
    build:
      context: .
      dockerfile: apps/server/Dockerfile
    environment:
      DATABASE_URL: postgres://app:devpassword@postgres:5432/birthday_songs
      REDIS_URL: redis://redis:6379
      PORT: 3000
      MOCK_MODE: "true"
      CORS_ORIGIN: http://localhost:5173
    ports:
      - "3000:3000"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - ./mock-assets:/app/mock-assets:ro

  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    environment:
      VITE_API_URL: http://localhost:3000
    ports:
      - "5173:5173"
    depends_on:
      - server

volumes:
  pg_data:
```

### Dockerfiles

**apps/server/Dockerfile**
- Base: `node:22-alpine`
- Copy workspace root `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`
- `pnpm install --frozen-lockfile`
- Copy `packages/shared` and `apps/server`
- `pnpm --filter server build`
- `CMD ["node", "dist/index.js"]`

**apps/web/Dockerfile**
- Base: `node:22-alpine`
- Same workspace install
- Copy `packages/shared` and `apps/web`
- Dev mode: `CMD ["pnpm", "--filter", "web", "dev", "--host"]`
- Production: multi-stage with `pnpm --filter web build` -> `nginx:alpine` serving `dist/`

---

## 10. "Going Live" Checklist

When ready to replace mocks with real services, complete each item:

### AI Lyrics
- [ ] Get API keys: Anthropic (Claude), OpenAI (GPT-4o), Google (Gemini)
- [ ] Create `apps/server/src/services/lyrics.ts` (real implementation)
- [ ] Swap import in `routes/lyrics.ts` from `mock-lyrics` to `lyrics`
- [ ] Set `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `GOOGLE_AI_KEY` in env
- [ ] Tune prompt templates with 20+ test runs per style/language

### AI Music (Suno)
- [ ] Obtain Suno API access (enterprise or third-party: sunoapi.org / aimlapi.com)
- [ ] Create `apps/server/src/services/music.ts`
- [ ] Implement FFmpeg preview extraction (10s clip from chorus timestamp)
- [ ] Set `SUNO_API_KEY` / `SUNO_API_URL` in env
- [ ] Set up Cloudflare R2 bucket for audio file storage
- [ ] Update `audio_url` / `preview_url` to point to R2 signed URLs
- [ ] Add Udio fallback in case Suno fails

### AI Video (Kling / Runway)
- [ ] Get WaveSpeedAI API key for Kling 2.6
- [ ] Get Runway API key as fallback
- [ ] Create `apps/server/src/services/video.ts`
- [ ] Set `WAVESPEED_API_KEY`, `RUNWAY_API_KEY` in env
- [ ] Upload user photos to R2 before passing to video API
- [ ] Set up R2 bucket for video file storage

### Social Autofill
- [ ] Choose scraping provider (Apify / Scrapeless / ScrapingBee)
- [ ] Create `apps/server/src/services/social.ts`
- [ ] Set `SCRAPING_API_KEY` in env
- [ ] Implement AI analysis prompt (Claude) on scraped data
- [ ] Add privacy disclaimers in UI

### Payments (Stripe)
- [ ] Create Stripe account, get `STRIPE_SECRET_KEY` and `STRIPE_PUBLISHABLE_KEY`
- [ ] Set `STRIPE_WEBHOOK_SECRET` in env
- [ ] Replace `MockStripe` component with Stripe.js `@stripe/react-stripe-js`
- [ ] Replace `mock-stripe.ts` with real `stripe` SDK calls
- [ ] Set up webhook endpoint on public URL
- [ ] Test with Stripe CLI (`stripe listen --forward-to`)
- [ ] Configure products/prices in Stripe Dashboard

### Email
- [ ] Get Resend API key, set `RESEND_API_KEY` in env
- [ ] Create email templates (download link, receipt, abandoned cart)
- [ ] Replace console.log emails with Resend SDK calls

### Storage
- [ ] Create Cloudflare R2 bucket (`birthday-songs-assets`)
- [ ] Set `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_PUBLIC_URL` in env
- [ ] Implement upload helpers for audio, video, and user photos
- [ ] Configure signed URL generation for paid content

### Infrastructure
- [ ] Set up Dokploy project (or alternative: Railway, Fly.io)
- [ ] Configure PostgreSQL (Supabase or self-hosted)
- [ ] Configure Redis (Upstash or self-hosted)
- [ ] Set up custom domain + SSL
- [ ] Configure CDN (Cloudflare) in front of R2
- [ ] Set up Sentry for error tracking (`SENTRY_DSN` in env)
- [ ] Set up Plausible or PostHog for analytics

### Security
- [ ] Enable Stripe webhook signature verification
- [ ] Add rate limiting per IP (10 req/min for generation endpoints)
- [ ] Validate all inputs with Zod on server
- [ ] Use signed/expiring URLs for paid audio/video downloads
- [ ] HTTPS everywhere
- [ ] Review OWASP top 10 against all endpoints

### Launch
- [ ] Run full E2E test with real APIs (create 10 songs in each style)
- [ ] QA Hebrew + English + RTL layout
- [ ] QA mobile (iOS Safari, Android Chrome)
- [ ] Set up monitoring/alerting (uptime, error rate, queue depth)
- [ ] Prepare Product Hunt assets
- [ ] Set `MOCK_MODE=false` in production env
