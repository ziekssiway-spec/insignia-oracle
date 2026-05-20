import { promises as fs } from 'fs';
import path from 'path';

const STORE_PATH = path.join(process.cwd(), 'data', 'rate-limits.json');
const MAX_GENERATIONS = 2;
// Reset window: 24 hours
const WINDOW_MS = 24 * 60 * 60 * 1000;

interface RateLimitRecord {
  count: number;
  firstAt: number;
}

type Store = Record<string, RateLimitRecord>;

async function readStore(): Promise<Store> {
  try {
    const raw = await fs.readFile(STORE_PATH, 'utf-8');
    return JSON.parse(raw) as Store;
  } catch {
    return {};
  }
}

async function writeStore(store: Store): Promise<void> {
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), 'utf-8');
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetsAt: number; // epoch ms
}

export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  const store = await readStore();
  const now = Date.now();
  const record = store[ip];

  // No record or window expired — fresh start
  if (!record || now - record.firstAt > WINDOW_MS) {
    store[ip] = { count: 1, firstAt: now };
    await writeStore(store);
    return { allowed: true, remaining: MAX_GENERATIONS - 1, resetsAt: now + WINDOW_MS };
  }

  // Within window
  if (record.count >= MAX_GENERATIONS) {
    return {
      allowed: false,
      remaining: 0,
      resetsAt: record.firstAt + WINDOW_MS,
    };
  }

  // Increment
  record.count += 1;
  store[ip] = record;
  await writeStore(store);
  return {
    allowed: true,
    remaining: MAX_GENERATIONS - record.count,
    resetsAt: record.firstAt + WINDOW_MS,
  };
}
