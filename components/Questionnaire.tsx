'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { QUESTIONS } from '@/data/questions';
import { SYMBOLS } from '@/data/symbols';
import type { Answers } from '@/lib/types';

interface QuestionnaireProps {
  answers: Answers;
  onAnswersChange: (answers: Answers) => void;
  onComplete: () => void;
}

export default function Questionnaire({ answers, onAnswersChange, onComplete }: QuestionnaireProps) {
  const [step, setStep] = useState(0);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  const q = QUESTIONS[step];
  const totalSteps = QUESTIONS.length;
  const fillPct = (step / totalSteps) * 100;

  // Focus the text input when the step changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 80);
    return () => clearTimeout(timer);
  }, [step]);

  const setAnswer = useCallback(
    (key: string, value: string | string[]) => {
      onAnswersChange({ ...answers, [key]: value });
    },
    [answers, onAnswersChange]
  );

  const toggleMulti = useCallback(
    (key: string, value: string) => {
      const current: string[] = Array.isArray(answers[key as keyof Answers])
        ? (answers[key as keyof Answers] as string[])
        : [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      onAnswersChange({ ...answers, [key]: next });
    },
    [answers, onAnswersChange]
  );

  const advance = useCallback(() => {
    if (step === totalSteps - 1) {
      onComplete();
    } else {
      setStep((s) => s + 1);
    }
  }, [step, totalSteps, onComplete]);

  const handleNext = useCallback(() => {
    advance();
  }, [advance]);

  const handleSkip = useCallback(() => {
    // Clear this key and advance
    const next = { ...answers };
    delete next[q.key as keyof Answers];
    delete next[`${q.key}_more` as keyof Answers];
    onAnswersChange(next);
    advance();
  }, [answers, q.key, onAnswersChange, advance]);

  const handleBack = useCallback(() => {
    if (step > 0) setStep((s) => s - 1);
  }, [step]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && q.type === 'text') {
        e.preventDefault();
        handleNext();
      }
    },
    [q.type, handleNext]
  );

  const currentValue = (answers[q.key as keyof Answers] as string) || '';
  const currentFollowup = (answers[`${q.key}_more` as keyof Answers] as string) || '';
  const currentMulti = (answers[q.key as keyof Answers] as string[]) || [];

  return (
    <div className="stage" id="screen-q">
      <div className="progress-wrap">
        <div className="progress-meta">
          <span className="progress-chapter">
            {q.chapterTitle ? `Chapter ${q.chapter} · ${q.chapterTitle}` : 'The Insignia Oracle'}
          </span>
          <span className="progress-count">
            {step + 1} / {totalSteps}
          </span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${fillPct}%` }} />
        </div>
      </div>

      <div className="question-card">
        <div className="q-prompt">{q.prompt}</div>
        {q.helper && <div className="q-helper">{q.helper}</div>}

        {q.type === 'text' && (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            className="q-input"
            type="text"
            placeholder={q.placeholder || ''}
            value={currentValue}
            onChange={(e) => setAnswer(q.key, e.target.value)}
            onKeyDown={handleKeyDown}
          />
        )}

        {q.type === 'textarea' && (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            className="q-input"
            placeholder={q.placeholder || ''}
            rows={3}
            value={currentValue}
            onChange={(e) => setAnswer(q.key, e.target.value)}
          />
        )}

        {q.type === 'symbol-picker' && (
          <>
            <div className="symbol-grid">
              {SYMBOLS.map((sym) => {
                const selected = answers[q.key as keyof Answers] === sym.value;
                return (
                  <div
                    key={sym.value}
                    className={`symbol-card${selected ? ' selected' : ''}`}
                    onClick={() => setAnswer(q.key, sym.value)}
                  >
                    <span className="sym-emoji">{sym.emoji}</span>
                    <span className="sym-label">{sym.label}</span>
                    <span className="sym-meaning">{sym.meaning}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: '20px' }}>
              <input
                className="q-input"
                type="text"
                placeholder={q.placeholder || 'Or describe your own symbol…'}
                value={typeof answers[q.key as keyof Answers] === 'string' &&
                  !SYMBOLS.find(s => s.value === answers[q.key as keyof Answers])
                  ? (answers[q.key as keyof Answers] as string)
                  : ''}
                onChange={(e) => {
                  if (e.target.value) setAnswer(q.key, e.target.value);
                }}
              />
            </div>
          </>
        )}

        {(q.type === 'options' || q.type === 'multi') && (
          <>
            <div className={`options cols-${q.cols || 3}`}>
              {q.options?.map((opt) => {
                const selected =
                  q.type === 'multi'
                    ? currentMulti.includes(opt.value)
                    : answers[q.key as keyof Answers] === opt.value;
                return (
                  <div
                    key={opt.value}
                    className={`option${selected ? ' selected' : ''}`}
                    onClick={() =>
                      q.type === 'multi'
                        ? toggleMulti(q.key, opt.value)
                        : setAnswer(q.key, opt.value)
                    }
                  >
                    {opt.symbol && <span className="o-symbol">{opt.symbol}</span>}
                    <span className="o-label">{opt.label}</span>
                  </div>
                );
              })}
            </div>
            {q.type === 'multi' && <div className="multi-hint">Choose all that ring true</div>}
            {q.followup && (
              <div className="followup">
                <input
                  className="q-input"
                  type="text"
                  placeholder={q.followup}
                  value={currentFollowup}
                  onChange={(e) => setAnswer(`${q.key}_more`, e.target.value)}
                />
              </div>
            )}
          </>
        )}

        <div className="nav-row">
          <button
            className={`back${step === 0 ? ' invisible' : ''}`}
            onClick={handleBack}
          >
            ← Back
          </button>
          <div className="nav-actions">
            <button className="skip" onClick={handleSkip}>
              Skip →
            </button>
            <button className="btn" onClick={handleNext}>
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
