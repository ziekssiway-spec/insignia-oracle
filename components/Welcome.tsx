'use client';

interface WelcomeProps {
  onStart: () => void;
}

export default function Welcome({ onStart }: WelcomeProps) {
  return (
    <div className="stage welcome-card">
      <div className="ornament">
        <div className="line" />
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l1.8 6.5L20 10l-5.2 3.8L17 20l-5-3.5L7 20l2.2-6.2L4 10l6.2-1.5z" />
        </svg>
        <div className="line r" />
      </div>
      <div className="kicker">The Insignia Oracle</div>
      <h1>Your crest, divined.</h1>
      <p className="lede">
        For centuries, a signet carried a person's whole soul — their symbol, their motto, worn for
        a lifetime. Answer the questions that follow honestly, and the Oracle will design a crest
        unique to you and find the words you were meant to live by.
      </p>
      <div className="welcome-note">Twenty questions · about six minutes · every answer optional</div>
      <button className="btn" onClick={onStart}>
        Begin the rite
      </button>
    </div>
  );
}
