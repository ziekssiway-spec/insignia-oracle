import { NextRequest, NextResponse } from 'next/server';


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

// In-memory lead store (use an ESP/CRM for persistence in production)
const leads: LeadRecord[] = [];

async function appendToLocalStore(record: LeadRecord): Promise<void> {
  leads.push(record);
  console.log('[capture] lead stored in memory:', record.email);
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

async function pushToKit(record: LeadRecord): Promise<void> {
  const apiKey = process.env.KIT_API_KEY!;
  const formId = process.env.KIT_FORM_ID!;

  await fetch(`https://api.convertkit.com/v3/forms/${formId}/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: apiKey,
      email: record.email,
      first_name: record.name,
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
    if (process.env.KIT_API_KEY && process.env.KIT_FORM_ID) {
      await pushToKit(record);
    } else if (process.env.MAILCHIMP_API_KEY && process.env.MAILCHIMP_LIST_ID) {
      await pushToMailchimp(record);
    } else if (process.env.KLAVIYO_API_KEY) {
      await pushToKlaviyo(record);
    }
  } catch (err) {
    console.error('[capture] ESP push failed:', err);
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
