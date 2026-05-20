// In-memory rate limiter — works on serverless (Vercel)
// Resets when the function cold-starts, which is fine for abuse prevention.

const MAX_GENERATIONS = 2;
const WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

interface RateLimitRecord {
  count: number;
  firstAt: number;
}

const store = new Map<string, RateLimitRecord>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetsAt: number;
}

export function checkRateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  const record = store.get(ip);

  if (!record || now - record.firstAt > WINDOW_MS) {
    store.set(ip, { count: 1, firstAt: now });
    return { allowed: true, remaining: MAX_GENERATIONS - 1, resetsAt: now + WINDOW_MS };
  }

  if (record.count >= MAX_GENERATIONS) {
    return { allowed: false, remaining: 0, resetsAt: record.firstAt + WINDOW_MS };
  }

  record.count += 1;
  store.set(ip, record);
  return { allowed: true, remaining: MAX_GENERATIONS - record.count, resetsAt: record.firstAt + WINDOW_MS };
}
