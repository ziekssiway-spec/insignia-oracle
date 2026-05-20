import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface LeadRecord {
  email: string;
  name: string;
  family: string;
  animal: string;
  quote: string;
  imageUrl: string;
  answers: Record<string, unknown>;
  when: string;
  source?: string;
}

async function appendToLocalStore(record: LeadRecord): Promise<void> {
  const filePath = path.join(process.cwd(), 'data', 'leads.json');
  let list: LeadRecord[] = [];
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    list = JSON.parse(raw);
  } catch {
    // file doesn't exist yet
  }
  list.push(record);
  await fs.writeFile(filePath, JSON.stringify(list, null, 2), 'utf-8');
}

async function pushToMailchimp(record: LeadRecord): Promise<void> {
  const apiKey = process.env.MAILCHIMP_API_KEY!;
  const listId = process.env.MAILCHIMP_LIST_ID!;
  const server = process.env.MAILCHIMP_SERVER!;

  await fetch(`https://${server}.api.mailchimp.com/3.0/lists/${listId}/members`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}`,
    },
    body: JSON.stringify({
      email_address: record.email,
      status: 'subscribed',
      merge_fields: {
        FNAME: record.name,
        LNAME: record.family,
        ANIMAL: record.animal,
        QUOTE: record.quote,
        IMGURL: record.imageUrl,
      },
    }),
  });
}

async function pushToKlaviyo(record: LeadRecord): Promise<void> {
  const apiKey = process.env.KLAVIYO_API_KEY!;
  const listId = process.env.KLAVIYO_LIST_ID!;

  await fetch('https://a.klaviyo.com/api/profiles/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      revision: '2024-02-15',
      Authorization: `Klaviyo-API-Key ${apiKey}`,
    },
    body: JSON.stringify({
      data: {
        type: 'profile',
        attributes: {
          email: record.email,
          first_name: record.name,
          last_name: record.family,
          properties: {
            spirit_animal: record.animal,
            matched_quote: record.quote,
            crest_image_url: record.imageUrl,
            source: 'insignia_oracle',
          },
        },
        relationships: listId
          ? { lists: { data: [{ type: 'list', id: listId }] } }
          : undefined,
      },
    }),
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, answers, quote, imageUrl, source } = body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  const record: LeadRecord = {
    email,
    name: answers?.firstname || '',
    family: answers?.familyname || '',
    animal: answers?.animal || '',
    quote: quote ? `${quote.text} — ${quote.author}` : '',
    imageUrl: imageUrl || '',
    answers: answers || {},
    when: new Date().toISOString(),
    source: source || 'direct',
  };

  // Always write to local store (as backup / admin export)
  try {
    await appendToLocalStore(record);
  } catch (err) {
    console.error('[capture] local store write failed:', err);
  }

  // Push to ESP if configured
  try {
    if (process.env.MAILCHIMP_API_KEY && process.env.MAILCHIMP_LIST_ID) {
      await pushToMailchimp(record);
    } else if (process.env.KLAVIYO_API_KEY) {
      await pushToKlaviyo(record);
    }
  } catch (err) {
    // Non-fatal: lead is already in local store
    console.error('[capture] ESP push failed:', err);
  }

  return NextResponse.json({ ok: true });
}

// Admin: GET /api/capture returns the local leads JSON (protect this in production with auth)
export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const filePath = path.join(process.cwd(), 'data', 'leads.json');
    const raw = await fs.readFile(filePath, 'utf-8');
    return new NextResponse(raw, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename="insignia-leads.json"',
      },
    });
  } catch {
    return NextResponse.json([]);
  }
}
