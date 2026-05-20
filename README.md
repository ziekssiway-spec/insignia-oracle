# The Insignia Oracle

A production Next.js app that generates a unique gold signet-ring crest and matched real quote from a 19-question questionnaire, then gates the reveal behind an email capture.

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and fill in at least OPENAI_API_KEY
cp .env.local.example .env.local

# 3. Run dev server
npm run dev
# → http://localhost:3000
```

Without `OPENAI_API_KEY` the app falls back to the free Pollinations API — fine for development, not for production quality.

## Environment variables

See `.env.local.example` for the full list. The critical ones:

| Variable | Purpose |
|---|---|
| `OPENAI_API_KEY` | Image generation via `gpt-image-1` (server-side, never exposed to browser) |
| `CLOUDINARY_*` | Optional: upload generated images for permanent URLs |
| `MAILCHIMP_API_KEY` + `MAILCHIMP_LIST_ID` + `MAILCHIMP_SERVER` | Push leads to Mailchimp |
| `KLAVIYO_API_KEY` + `KLAVIYO_LIST_ID` | Push leads to Klaviyo (alternative to Mailchimp) |
| `NEXT_PUBLIC_PIETRA_URL` | Your real Pietra product/checkout link |

## Architecture

```
app/
  page.tsx                 ← top-level state machine (welcome → questionnaire → gate → result)
  layout.tsx               ← Google Fonts (Cormorant Garamond + Inter), metadata
  globals.css              ← all styles, cream/gold palette
  api/
    generate-image/route.ts  ← POST { prompt } → { imageUrl }; calls OpenAI or Pollinations
    capture/route.ts         ← POST lead data → local JSON + optional ESP; GET (dev only) → leads download

components/
  Welcome.tsx              ← opening screen
  Questionnaire.tsx        ← 19 questions, 4 chapters, progress bar
  EmailGate.tsx            ← email validation + consent
  Result.tsx               ← crest image, quote, brief, Pietra block, download

data/
  questions.ts             ← all 19 questions as typed data (edit to update copy)
  quotes.ts                ← curated real-quote library with tags (add ~110 more before launch)

lib/
  types.ts                 ← shared TypeScript interfaces
  quote-matcher.ts         ← token-bag matching against answer text + archetype/element tags
  prompt-builder.ts        ← assembles the locked gold-signet prompt from answers
```

## Lead export (dev)

In development, `GET /api/capture` streams `data/leads.json` as a download. In production this endpoint returns 403 — export from your ESP instead.

## Before launching publicly

- [ ] Set `OPENAI_API_KEY` (or fal.ai/Replicate key with a matching `/api/generate-image` implementation)
- [ ] Wire an ESP (`MAILCHIMP_*` or `KLAVIYO_*`)
- [ ] Set `NEXT_PUBLIC_PIETRA_URL` to the real order link
- [ ] Expand `data/quotes.ts` to ~150 verified quotes
- [ ] Add auth to `GET /api/capture` or remove it
- [ ] Set up Cloudinary for permanent image URLs (optional but recommended)

## Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- OpenAI Node SDK (`openai`)
- No UI library — pure CSS with CSS variables
