import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';

  const limit = checkRateLimit(ip);

  if (!limit.allowed) {
    const resetsIn = Math.ceil((limit.resetsAt - Date.now()) / 1000 / 60 / 60);
    return NextResponse.json(
      {
        error: 'RATE_LIMIT',
        message: `You've used both your crest generations. Your forge resets in ${resetsIn} hour${resetsIn === 1 ? '' : 's'}.`,
        resetsAt: limit.resetsAt,
      },
      { status: 429 }
    );
  }

  const { prompt } = await req.json();
  if (!prompt || typeof prompt !== 'string') {
    return NextResponse.json({ error: 'prompt required' }, { status: 400 });
  }

  if (process.env.OPENAI_API_KEY) {
    try {
      const { default: OpenAI } = await import('openai');
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      // Try dall-e-3 first (fastest, ~10s). Fall back to gpt-image-1 if unavailable.
      let imageUrl: string | undefined;

      try {
        const response = await openai.images.generate({
          model: 'dall-e-3',
          prompt,
          n: 1,
          size: '1024x1024',
          quality: 'hd',
        });
        imageUrl = response.data[0]?.url;
      } catch (dalle3Err: unknown) {
        const msg = dalle3Err instanceof Error ? dalle3Err.message : String(dalle3Err);
        console.warn('[generate-image] dall-e-3 failed, trying gpt-image-1:', msg);

        const response = await openai.images.generate({
          model: 'gpt-image-1',
          prompt,
          n: 1,
          size: '1024x1024',
          quality: 'high',
        });
        const item = response.data?.[0];
        const b64 = (item as { b64_json?: string })?.b64_json;
        imageUrl = item?.url ?? (b64 ? `data:image/png;base64,${b64}` : undefined);
      }

      if (!imageUrl) throw new Error('No image returned');
      return NextResponse.json({ imageUrl });

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('[generate-image] OpenAI error:', msg);
      return NextResponse.json({ error: msg }, { status: 500 });
    }
  }

  // Free fallback: Pollinations
  const seed = Math.floor(Math.random() * 1_000_000);
  const params = new URLSearchParams({
    width: '1024', height: '1024',
    model: 'flux', nologo: 'true',
    seed: String(seed), private: 'true',
  });
  const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${params}`;
  return NextResponse.json({ imageUrl });
}
