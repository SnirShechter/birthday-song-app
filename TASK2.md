# TASK 2 — Social Autofill + Checkout Redesign + Video Fix

Fix these issues in order. Do NOT use subagents. Write code directly, one issue at a time. Run `pnpm build` at the end.

## Issue A: Social Autofill (THE MOST IMPORTANT FEATURE)

Add a social media autofill section at the TOP of the Questionnaire page.

### Frontend Changes (`apps/web/src/pages/Questionnaire.tsx`):
1. Before Step 1, show a "Social Connect" card with 4 buttons: Instagram, TikTok, Facebook, LinkedIn
2. Each button should open a small input for the profile URL/username
3. On submit, call `POST /api/social/autofill` with `{ platform, username }`
4. The API response (mock) returns profile data → auto-fill the form fields with animation
5. User can still edit after autofill
6. If user clicks "Skip" → go to normal Step 1

### Backend Changes:
Create `apps/server/src/services/mock-social.ts`:
```typescript
export function mockSocialAutofill(platform: string, username: string) {
  // Return mock data with slight delay
  return {
    name: "שרה כהן",
    estimatedAge: 25,
    profilePhoto: "https://picsum.photos/200",
    bio: "Travel lover 🌍 | Coffee addict ☕ | Dog mom 🐕",
    interests: ["travel", "coffee", "dogs", "photography"],
    gender: "female",
  };
}
```

Create route in `apps/server/src/routes/social.ts` and register it in the main server file.

### i18n:
Add keys to both `en.json` and `he.json`:
- `questionnaire.social.title` → "Skip the form? Connect a profile" / "רוצים לדלג? חברו פרופיל"
- `questionnaire.social.subtitle` → "We'll auto-fill the details" / "נמלא את הפרטים אוטומטית"
- `questionnaire.social.skip` → "Fill manually instead" / "למלא ידנית"
- `questionnaire.social.connecting` → "Getting profile info..." / "מביא פרטי פרופיל..."
- `questionnaire.social.success` → "Profile connected! Review the details below" / "פרופיל מחובר! בדקו את הפרטים למטה"

## Issue B: Fix Checkout → "Get the Full Song" with one-click payments

Completely rewrite `apps/web/src/pages/Checkout.tsx`:

1. Remove `TierSelector` — just show price $9.99
2. Title: "Get the Full Song" / "קבלו את השיר המלא"
3. Show 3 big payment buttons at top:
   - Google Pay (mock — just calls handlePaymentSuccess)
   - Apple Pay (mock)
   - PayPal (mock)
4. Small subtle link at bottom: "Pay with credit card" → opens MockStripe modal
5. Show order summary (recipient name, style) with actual values from `order` object (NOT i18n interpolation)
6. After payment → navigate to Success page

## Issue C: Fix Video loading stuck

The `VideoUpload.tsx` polls `/api/orders/${orderId}/video/status` but:
1. The API returns `{ success: true, video: { status, videoUrl, ... } }` — need to unwrap `.video`
2. The frontend does `api.get<VideoClip>(...)` expecting raw VideoClip — wrong
3. The video POST sends `{ videoStyle, photoCount }` but the schema expects `{ photoUrls, videoStyle }` — need to fix schema or send right data

Fix the polling to unwrap the response:
```typescript
const res = await api.get<{ success: boolean; video: VideoClip }>(...);
const status = res.video;
```

And fix the POST to send the right data format.

## General notes:
- All API responses are wrapped in `{ success, data }` — always unwrap
- ALL text must have Hebrew translations in `he.json`
- Run `pnpm build` when done to verify it compiles
