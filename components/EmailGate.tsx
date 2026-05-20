'use client';

import { useState } from 'react';
import type { Answers } from '@/lib/types';

interface EmailGateProps {
  answers: Answers;
  onSubmit: (email: string) => void;
}

function titleCase(s: string): string {
  return s
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

export default function EmailGate({ answers, onSubmit }: EmailGateProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const name = answers.firstname ? `, ${titleCase(answers.firstname)}` : '';

  const handleSubmit = () => {
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Please enter a valid email so we can send your crest.');
      return;
    }
    setError('');
    onSubmit(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="stage">
      <div className="gate-card">
        <div className="seal">✦</div>
        <h2>Your crest is ready to be drawn{name}.</h2>
        <p>
          The Oracle has everything it needs. Tell us where to send your insignia, and we'll reveal
          it now — and keep your design safe so it's never lost.
        </p>
        <input
          className="email-input"
          type="email"
          placeholder="your@email.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        <div className="email-error">{error}</div>
        <button className="btn" onClick={handleSubmit}>
          Reveal my crest
        </button>
        <div className="consent">
          We'll send your crest and occasional notes about bringing it to life as a real ring or
          medallion. No noise. Unsubscribe anytime.
        </div>
      </div>
    </div>
  );
}
