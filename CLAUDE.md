# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # dev server at localhost:3000
npm run build    # production build
npm run lint     # Next.js ESLint
```

No test suite exists yet.

## Architecture

**Insignia Oracle** is a Next.js 14 (App Router) heraldic crest generator — a four-screen linear flow managed as a state machine in `app/page.tsx`.

### Screen State Machine

`app/page.tsx` controls which screen renders via `currentScreen: Screen`:

```
Welcome → Questionnaire → EmailGate → Result
```

Answers accumulate in an `Answers` object (typed in `lib/types.ts`) as the user progresses through Questionnaire. That object is passed to EmailGate and then Result.

### Data Flow

1. User completes 19 questions (`data/questions.ts`) across 4 chapters
2. Email captured at gate; triggers both image generation and lead capture
3. `lib/prompt-builder.ts` assembles a DALL-E prompt from answers
4. `lib/quote-matcher.ts` scores all quotes (`data/quotes.ts`) using a token-bag algorithm (keyword extraction + archetype/element tags) and returns the best match
5. `POST /api/generate-image` — rate-limited (2/IP/24h via in-memory `lib/rate-limit.ts`), calls OpenAI DALL-E or falls back to Pollinations if no API key
6. `POST /api/capture` — saves lead data and pushes to ESP (Mailchimp / Klaviyo / ConvertKit, whichever env vars are present)
7. `components/Result.tsx` renders the image, quote, brief sidebar, download button, and Pietra checkout link

### Key Files

| File | Role |
|------|------|
| `app/page.tsx` | State machine; owns `currentScreen` and `answers` |
| `components/Questionnaire.tsx` | 19-question form with 4-chapter progress; validates/stores answers |
| `components/Result.tsx` | Triggers generation, displays image + quote, handles download |
| `components/ForgeAnimation.tsx` | Galaxy-themed loading animation shown during generation |
| `lib/prompt-builder.ts` | Builds the heraldic DALL-E prompt from user answers |
| `lib/quote-matcher.ts` | Token-bag scoring; maps answers → archetype/element tags → best quote |
| `data/questions.ts` | All 19 questions as typed data |
| `data/quotes.ts` | ~50 curated quotes with archetype/element tags |
| `data/symbols.ts` | Heraldic symbols with DALL-E prompt descriptions |
| `api/generate-image/route.ts` | Image generation endpoint; `maxDuration = 60` for Vercel |
| `api/capture/route.ts` | Lead capture + ESP push |

### Styling

Pure CSS with CSS variables — no UI library. Cream/gold palette defined in `app/globals.css`. Key variables: `--gold-deep`, `--gold`, `--gold-bright`, `--gold-light`, `--gold-pale`, `--cream`, `--ink`, `--rose`. Fonts: Cormorant Garamond (serif) + Inter (sans).

### Environment Variables

```bash
OPENAI_API_KEY              # DALL-E 3 / gpt-image-1; falls back to Pollinations if absent
CLOUDINARY_CLOUD_NAME       # Optional: permanent image URLs
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
MAILCHIMP_API_KEY           # Pick one ESP
MAILCHIMP_LIST_ID
MAILCHIMP_SERVER            # e.g. us1
KLAVIYO_API_KEY
KLAVIYO_LIST_ID
KIT_API_KEY                 # ConvertKit (preferred)
KIT_FORM_ID
NEXT_PUBLIC_PIETRA_URL      # Public checkout/product link
```

Copy `.env.local.example` → `.env.local` to get started.
