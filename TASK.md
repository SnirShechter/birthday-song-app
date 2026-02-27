# TASK — Fix All Issues (Priority Order)

You are fixing a birthday song generator app. It's a React 19 + Vite + Tailwind 4 + Hono monorepo (Turborepo + pnpm workspaces). The app is in Hebrew (RTL) by default with English toggle.

**IMPORTANT:** Use subagents (Task tool) wherever possible to parallelize work. Do a final self-review at the end to make sure everything compiles and works.

## Current App Flow
Landing → Questionnaire (2 steps) → StylePicker → LyricsReview (carousel) → SongPreview → Checkout → Success → VideoUpload

## Issue 1: LyricsCarousel broken — only 1 card visible, no swipe

**File:** `apps/web/src/components/lyrics/LyricsCarousel.tsx`

The carousel shows only the first card. The other cards are invisible/empty and swiping doesn't work. The issue is likely with `cardWidth` being 0 on initial render (the `useEffect` measuring runs before the container is mounted), and the `motion.div` drag behavior isn't working properly. 

**Fix:** Rewrite the carousel to work reliably. Consider using a simpler approach — maybe CSS scroll-snap or a well-tested pattern. The cards should be fully visible and swipeable on mobile.

## Issue 2: i18n incomplete — English text leaking in Hebrew mode

**Example:** "Choose this" appears on the lyrics page when Hebrew is selected. Many components have hardcoded English strings or use `t()` keys that don't exist in `he.json`.

**Fix:** Audit ALL components for hardcoded English strings. Every user-visible string must go through `t()` with a proper key. Make sure `he.json` has ALL the keys that `en.json` has. Check especially:
- `LyricsCard.tsx` — buttons like "Choose this", "Edit"
- `TierSelector.tsx` — plan descriptions  
- `SongPreview.tsx` — variation labels
- `Checkout.tsx` — all labels
- `VideoUpload.tsx` — all labels
- `StylePicker.tsx`
- Any other component with visible text

## Issue 3: Social Media Autofill — THIS IS THE #1 FEATURE

**This is the most important differentiator.** Before or at the top of the questionnaire, there should be a prominent section to connect social media profiles (Instagram, Facebook, LinkedIn, TikTok).

**How it should work:**
1. At the top of the questionnaire page, show a section: "Want to skip the form? Connect a social profile and we'll fill it for you"
2. Show buttons for Instagram, TikTok, Facebook, LinkedIn
3. When clicked, show an input for the profile URL/username
4. In MOCK MODE: simulate an API call, then auto-fill the form with mock data (name, age estimate, profile photo, interests/bio)
5. The form fields should visually populate with a nice animation
6. User can still edit anything after autofill
7. If user skips social, they just fill the form manually (current flow)

**Mock data example for Instagram:**
```json
{
  "name": "שרה כהן",
  "estimatedAge": 25,
  "profilePhoto": "https://picsum.photos/200",
  "bio": "Travel lover 🌍 | Coffee addict ☕ | Dog mom 🐕",
  "interests": ["travel", "coffee", "dogs", "photography"]
}
```

## Issue 4: Checkout page — broken template strings

The checkout shows raw template variables: `{{name}}`, `{{style}}`, `{{plan}}`, `{{total}}` instead of actual values. 

**Root cause:** The `t()` function is being called with interpolation keys like `{{name}}` but either:
- The keys don't exist in the JSON files
- The interpolation values aren't being passed to `t()`

**Also:** The checkout text uses `t("checkout.summary.recipient", "For: {{name}}")` pattern but the i18n JSON probably has literal `{{name}}` without proper i18next interpolation.

**Fix:** Make sure the checkout summary uses actual order data directly (like `order.recipientName`) rather than broken i18n interpolation for data values. The labels can use i18n but the VALUES should come from the order object.

## Issue 5: Redesign checkout → "Get the Full Song" with one-click payments

**Completely redesign the checkout page:**

1. **Rename:** Not "Checkout" — call it "Get the Full Song" (קבלו את השיר המלא)
2. **Remove tier selector** from this page — just show the song price ($9.99)
3. **One-click payment buttons** at the top (big, prominent):
   - Google Pay button (mock)
   - Apple Pay button (mock)
   - PayPal one-click button (mock)
4. **Small, subtle link** at the bottom: "Pay with credit card" — opens a modal with card form (the existing MockStripe component can be reused)
5. **Show the price clearly** at the top
6. **After payment success:** Navigate to a "Download & Share" page (the Success page)
7. **On the Success/Download page:** Show download button for the song, share links, AND at the top show an upsell: "Want a video clip too? 🎬" with a price ($19.99 extra or whatever)
8. **Video upsell flow:** If user already has a photo from social autofill, show a 10-second preview clip automatically. If not, show the photo upload interface. Either way, let them pick a video style and proceed to video generation.

## Issue 6: TierSelector — selected plan text disappears

**File:** `apps/web/src/components/checkout/TierSelector.tsx`

When selecting a plan/tier, the text inside the selected card disappears. This is likely a CSS issue — probably white text on a light gradient background, or the text color changes to match the background on selection.

**Fix:** Since we're removing the tier selector from checkout (Issue 5), this may be moot. But if TierSelector is used elsewhere, fix the text visibility on selection.

## Issue 7: Video generation loading screen stuck

**File:** `apps/web/src/pages/VideoUpload.tsx`

The video loading screen ("Rendering video...") gets stuck and never progresses. The issue is that the mock video API probably doesn't properly transition the status, or the polling endpoint returns an unexpected format.

**Check:** 
- `apps/server/src/routes/video.ts` — does the mock video generation actually set status to "completed"?
- `apps/server/src/services/mock-video.ts` — does it return properly?
- The polling in `VideoUpload.tsx` calls `/api/orders/${orderId}/video/status` — does this endpoint exist and return the right format?

**Fix:** Make the mock video flow work end-to-end: generate → poll → complete → show video player.

## General Rules

1. **All API responses are wrapped:** The server returns `{ success: true, data: ... }` patterns. ALWAYS unwrap in the frontend.
2. **Hebrew/RTL:** The app defaults to Hebrew. ALL visible text must have Hebrew translations.
3. **Mock mode:** Everything runs in mock mode (MOCK_MODE=true). No real APIs. Mock services simulate delays and return fake data.
4. **Design:** Glassmorphism + purple/pink/orange gradients. Dark theme. Modern, young, cool.
5. **After all fixes:** Run `pnpm build` to verify everything compiles.

## File Structure
```
apps/
  web/src/
    pages/ — Landing, Questionnaire, StylePicker, LyricsReview, SongPreview, Checkout, Success, VideoUpload, SharePage
    components/ — ui/, layout/, lyrics/, player/, checkout/, video/, questionnaire/, shared/
    i18n/ — en.json, he.json, index.ts
    stores/ — order.ts, player.ts, ui.ts
    lib/ — api.ts, cn.ts
  server/src/
    routes/ — orders.ts, lyrics.ts, songs.ts, video.ts, checkout.ts, share.ts
    services/ — mock-music.ts, mock-lyrics.ts, mock-video.ts, mock-social.ts (create if needed)
    middleware/ — rate-limit.ts, cors.ts
    db/ — client.ts, schema.ts
packages/
  shared/src/ — types.ts, schemas.ts, constants.ts
```
