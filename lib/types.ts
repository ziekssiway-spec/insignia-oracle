export interface Answers {
  firstname?: string;
  familyname?: string;
  myth?: string;
  threewords?: string;
  bestself?: string;
  turningpoint?: string;
  animal?: string;
  archetype?: string[];
  element?: string;
  element_more?: string;
  plant?: string;
  symbol?: string;
  origin?: string;
  numbers?: string;
  motto?: string;
  insideout?: string;
  callingin?: string;
  protection?: string;
  futureself?: string;
  mantra?: string;
}

export type Screen = 'welcome' | 'questionnaire' | 'gate' | 'result';
