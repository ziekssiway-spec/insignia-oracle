import { QUOTES, ARCHETYPE_TAGS, ELEMENT_TAGS, type Quote } from '@/data/quotes';
import type { Answers } from '@/lib/types';

function tokenize(s: string | undefined): string[] {
  return (s || '').toLowerCase().split(/[^a-z]+/).filter((w) => w.length > 2);
}

export function suggestQuote(answers: Answers): Quote {
  const tokens: string[] = [];

  tokens.push(...tokenize(answers.threewords));
  tokens.push(...tokenize(answers.bestself));
  tokens.push(...tokenize(answers.callingin));
  tokens.push(...tokenize(answers.protection));
  tokens.push(...tokenize(answers.futureself));
  tokens.push(...tokenize(answers.animal));
  tokens.push(...tokenize(answers.motto));

  if (Array.isArray(answers.archetype)) {
    answers.archetype.forEach((arch) => {
      (ARCHETYPE_TAGS[arch] || []).forEach((t) => tokens.push(t));
    });
  }
  if (answers.element) {
    (ELEMENT_TAGS[answers.element] || []).forEach((t) => tokens.push(t));
  }

  let best: Quote = QUOTES[0];
  let bestScore = -1;

  for (const q of QUOTES) {
    let score = 0;
    q.tags.forEach((tag) => {
      if (tokens.includes(tag)) score += 3;
    });
    const lower = q.text.toLowerCase();
    tokens.forEach((t) => {
      if (t.length > 3 && lower.includes(t)) score += 1;
    });
    if (q.tags.includes('universal')) score += 0.2;
    if (score > bestScore) {
      bestScore = score;
      best = q;
    }
  }

  if (bestScore <= 0.2) {
    const universals = QUOTES.filter((q) => q.tags.includes('universal'));
    best = universals[Math.floor(Math.random() * universals.length)] ?? QUOTES[0];
  }

  return best;
}
