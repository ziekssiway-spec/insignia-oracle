'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { Answers } from '@/lib/types';
import type { Quote } from '@/data/quotes';
import { ARCH_LABEL } from '@/data/quotes';
import ForgeAnimation from '@/components/ForgeAnimation';

interface ResultProps {
  answers: Answers;
  email: string;
  quote: Quote;
  onRestart: () => void;
}

const LOADER_MESSAGES = [
  'Choosing the gold…',
  'Casting the band…',
  'Setting the seal…',
  'Beginning the engraving…',
  'Carving your symbol…',
  'Cutting the deep lines…',
  'Polishing the high points…',
];

function titleCase(s: string): string {
  return s
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

function firstClause(s: string | undefined): string {
  if (!s) return '';
  return s.split(/[,.]|\bbecause\b|\bwhich\b|\bthat\b|\band\b/i)[0].trim();
}

function extractInsideMantra(answers: Answers): string {
  if (answers.mantra) return answers.mantra;
  if (answers.insideout && /inside\s*[:\-]/i.test(answers.insideout)) {
    const m = answers.insideout.split(/inside\s*[:\-]/i)[1];
    if (m) return m.trim();
  }
  if (answers.motto) return answers.motto;
  return '';
}

export default function Result({ answers, email, quote, onRestart }: ResultProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Clear any cached image on mount so every session starts fresh
  useEffect(() => {
    setImageUrl(null);
    setImageLoaded(false);
    setHasStarted(false);
  }, []);
  const [loaderMsg, setLoaderMsg] = useState(LOADER_MESSAGES[0]);
  const [promptOpen, setPromptOpen] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [regenDisabled, setRegenDisabled] = useState(true);
  const [rateLimited, setRateLimited] = useState(false);
  const [downloadLabel, setDownloadLabel] = useState('Download');
  const loaderTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasCaptured = useRef(false);

  const buildBriefItems = (): [string, string][] => {
    const items: [string, string][] = [];
    if (answers.animal) items.push(['Spirit Ally', firstClause(answers.animal)]);
    if (Array.isArray(answers.archetype) && answers.archetype.length)
      items.push(['Archetype', answers.archetype.map((a) => ARCH_LABEL[a] || a).join(', ')]);
    if (answers.element) items.push(['Element', titleCase(answers.element)]);
    if (answers.plant) items.push(['Sacred Plant', firstClause(answers.plant)]);
    if (answers.symbol) items.push(['Personal Symbol', answers.symbol]);
    if (answers.threewords) items.push(['Carried Energy', answers.threewords]);
    if (answers.origin) items.push(['Soul Origin', firstClause(answers.origin)]);
    if (answers.numbers) items.push(['Talisman', answers.numbers]);
    if (answers.motto) items.push(['Motto', answers.motto]);
    return items;
  };

  const cycleLoader = useCallback(() => {
    if (loaderTimer.current) clearInterval(loaderTimer.current);
    let i = 0;
    setLoaderMsg(LOADER_MESSAGES[0]);
    loaderTimer.current = setInterval(() => {
      i = (i + 1) % LOADER_MESSAGES.length;
      setLoaderMsg(LOADER_MESSAGES[i]);
    }, 3200);
  }, []);

  const generate = useCallback(async () => {
    setImageLoaded(false);
    setImageError(false);
    setIsGenerating(true);
    setRegenDisabled(true);
    cycleLoader();

    try {
      const { buildPrompt } = await import('@/lib/prompt-builder');
      const prompt = buildPrompt(answers);
      setCurrentPrompt(prompt);

      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, size: 1024 }),
      });

      const data: { imageUrl?: string; error?: string; message?: string } = await res.json();
      if (res.status === 429) {
        if (loaderTimer.current) clearInterval(loaderTimer.current);
        setLoaderMsg(data.message || 'Generation limit reached.');
        setRateLimited(true);
        setIsGenerating(false);
        setRegenDisabled(true);
        return;
      }
      if (!res.ok || data.error) throw new Error(data.error || 'Generation failed');
      setImageUrl(data.imageUrl!);
    } catch (err: unknown) {
      if (loaderTimer.current) clearInterval(loaderTimer.current);
      const msg = err instanceof Error ? err.message : String(err);
      setLoaderMsg(`Error: ${msg}`);
      setIsGenerating(false);
      setRegenDisabled(false);
    }
  }, [answers, cycleLoader]);

  // Capture lead once on mount
  useEffect(() => {
    if (hasCaptured.current) return;
    hasCaptured.current = true;

    fetch('/api/capture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, answers, quote, imageUrl: '' }),
    }).catch(() => {});
  }, [email, answers, quote]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (loaderTimer.current) clearInterval(loaderTimer.current);
    };
  }, []);

  const handleForge = useCallback(() => {
    setHasStarted(true);
    generate();
  }, [generate]);

  const handleImageLoad = () => {
    if (loaderTimer.current) clearInterval(loaderTimer.current);
    setIsGenerating(false);
    setImageLoaded(true);
    setRegenDisabled(false);
  };

  const handleImageError = () => {
    if (loaderTimer.current) clearInterval(loaderTimer.current);
    setLoaderMsg('The forge is busy — try "Re-cut the engraving".');
    setIsGenerating(false);
    setRegenDisabled(false);
  };

  const handleDownload = async () => {
    if (!imageUrl || !imageLoaded) return;
    setDownloadLabel('Saving…');
    const name = (answers.firstname || 'insignia').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const filename = `${name}-crest.jpg`;

    try {
      const res = await fetch(imageUrl, { mode: 'cors' });
      if (!res.ok) throw new Error('fetch failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setDownloadLabel('Saved ✓');
    } catch {
      window.open(imageUrl, '_blank');
      setDownloadLabel('Opened in tab');
    } finally {
      setTimeout(() => setDownloadLabel('Download'), 1800);
    }
  };

  const handlePietra = () => {
    const pietraUrl = process.env.NEXT_PUBLIC_PIETRA_URL;
    if (pietraUrl) {
      window.open(pietraUrl, '_blank', 'noopener noreferrer');
    } else {
      alert(
        'Lovely choice. Your design and email are saved. The order flow (Pietra) will be live here soon.'
      );
    }
  };

  const briefItems = buildBriefItems();
  const insideMantra = extractInsideMantra(answers);
  const resultName = answers.firstname ? `${titleCase(answers.firstname)}'s Insignia` : 'Your Insignia';

  return (
    <div className="stage result-stage">
      {/* Ring image */}
      <div className="ring-frame" style={{ background: !hasStarted || (isGenerating && !imageLoaded) ? '#0a0500' : undefined }}>
        {!hasStarted ? (
          // Pre-forge state
          <div className="ring-loader">
            <div style={{ marginBottom: '18px', fontSize: '32px', color: 'var(--gold)', animation: 'spin 8s linear infinite' }}>✦</div>
            <div className="loader-title">Your crest awaits.</div>
            <div className="loader-sub" style={{ marginBottom: '24px' }}>Ready to be forged</div>
            <button className="btn" onClick={handleForge}>
              Forge my crest
            </button>
          </div>
        ) : isGenerating && !imageLoaded ? (
          // Magical forge animation
          <ForgeAnimation firstName={answers.firstname} />
        ) : (
          // Image reveal
          <>
            <div className={`ring-loader${imageLoaded ? ' done' : ''}`}>
              <div className="loader-ornament" />
              <div className="loader-title">Forging your signet…</div>
              <div className="loader-sub">Etching the gold</div>
              <div className="loader-substep">{loaderMsg}</div>
            </div>
            {imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className={`ring-image${imageLoaded ? ' loaded' : ''}`}
                src={imageUrl}
                alt="Your signet crest"
                crossOrigin="anonymous"
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            )}
          </>
        )}
      </div>

      {/* Quote */}
      <div className="quote-block">
        <div className="q-mark">&ldquo;</div>
        <div className="quote-text">{quote.text}</div>
        <div className="quote-author">— {quote.author}</div>
        {insideMantra && (
          <div className="mantra">
            Engraved inside the band, only for you: <em>&ldquo;{insideMantra}&rdquo;</em>
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="ring-toolbar">
        {rateLimited ? (
          <div style={{ fontSize: '13px', color: 'var(--gold-deep)', fontStyle: 'italic', textAlign: 'center', width: '100%' }}>
            ✦ Each crest is forged twice — your two engravings are spent. Come back tomorrow for a new seal.
          </div>
        ) : (
          <button className="tool-btn" disabled={regenDisabled} onClick={generate}>
            Re-cut the engraving
          </button>
        )}
        <button className="tool-btn" disabled={!imageLoaded} onClick={handleDownload}>
          {downloadLabel}
        </button>
      </div>

      {/* Brief */}
      <div className="brief">
        <h2>{resultName}</h2>
        <div className="brief-grid">
          {briefItems.length > 0 ? (
            briefItems.map(([label, value]) => (
              <div key={label} className="brief-item">
                <div className="label">{label}</div>
                <div className="value">{value}</div>
              </div>
            ))
          ) : (
            <div className="brief-item" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
              <div className="value" style={{ fontStyle: 'italic', opacity: 0.7 }}>
                A crest left to mystery — unmarked, and entirely your own.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pietra upsell */}
      <div className="pietra">
        <h3>Wear it for a lifetime</h3>
        <p>
          This design is yours, free. If you'd like it forged into a real gold signet ring or
          medallion — hand-finished, exactly like the originals — we can make it.
        </p>
        <button className="btn" onClick={handlePietra}>
          Make mine real →
        </button>
      </div>

      {/* Design notes */}
      <button className="prompt-toggle" onClick={() => setPromptOpen((o) => !o)}>
        {promptOpen ? 'Hide design notes' : 'View design notes'}
      </button>
      <div className={`prompt-box${promptOpen ? ' open' : ''}`}>
        <div className="text">{currentPrompt}</div>
      </div>

      {/* Footer actions */}
      <div className="actions-row">
        <button className="btn ghost" onClick={onRestart}>
          Start over
        </button>
        <button className="btn" onClick={() => window.print()}>
          Save brief
        </button>
      </div>

      <div className="credit">The Insignia Oracle · a crest for the spirit</div>
    </div>
  );
}
