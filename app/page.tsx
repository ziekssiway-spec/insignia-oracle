'use client';

import { useState, useCallback } from 'react';
import Welcome from '@/components/Welcome';
import Questionnaire from '@/components/Questionnaire';
import EmailGate from '@/components/EmailGate';
import Result from '@/components/Result';
import { suggestQuote } from '@/lib/quote-matcher';
import type { Answers, Screen } from '@/lib/types';
import type { Quote } from '@/data/quotes';

export default function Page() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [answers, setAnswers] = useState<Answers>({});
  const [email, setEmail] = useState('');
  const [quote, setQuote] = useState<Quote | null>(null);

  const handleStart = useCallback(() => setScreen('questionnaire'), []);

  const handleQuestionnaireComplete = useCallback(() => setScreen('gate'), []);

  const handleEmailSubmit = useCallback(
    (submittedEmail: string) => {
      const matched = suggestQuote(answers);
      setQuote(matched);
      setEmail(submittedEmail);
      setScreen('result');
    },
    [answers]
  );

  const handleRestart = useCallback(() => {
    setAnswers({});
    setEmail('');
    setQuote(null);
    setScreen('welcome');
  }, []);

  if (screen === 'welcome') {
    return <Welcome onStart={handleStart} />;
  }

  if (screen === 'questionnaire') {
    return (
      <Questionnaire
        answers={answers}
        onAnswersChange={setAnswers}
        onComplete={handleQuestionnaireComplete}
      />
    );
  }

  if (screen === 'gate') {
    return <EmailGate answers={answers} onSubmit={handleEmailSubmit} />;
  }

  if (screen === 'result' && quote) {
    return (
      <Result
        answers={answers}
        email={email}
        quote={quote}
        onRestart={handleRestart}
      />
    );
  }

  return null;
}
