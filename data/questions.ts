export type QuestionType = 'text' | 'textarea' | 'options' | 'multi' | 'symbol-picker';

export interface Option {
  value: string;
  symbol?: string;
  label: string;
}

export interface Question {
  key: string;
  chapter: string;
  chapterTitle: string;
  prompt: string;
  helper?: string;
  type: QuestionType;
  placeholder?: string;
  cols?: number;
  options?: Option[];
  followup?: string;
}

export const QUESTIONS: Question[] = [
  {
    key: 'firstname',
    chapter: '',
    chapterTitle: '',
    prompt: 'First — what should we call you?',
    helper: 'Your first name, so your insignia feels like yours.',
    type: 'text',
    placeholder: 'Your first name',
  },

  // Chapter I — Identity & Legacy
  {
    key: 'familyname',
    chapter: 'I',
    chapterTitle: 'Identity & Legacy',
    prompt: 'What is your family name — and what does it mean to you?',
    helper: 'Its history, its values, or a story behind it.',
    type: 'textarea',
    placeholder: 'The name, and what it carries…',
  },
  {
    key: 'myth',
    chapter: 'I',
    chapterTitle: 'Identity & Legacy',
    prompt: 'If your life were a myth or fairy tale, what would its title be?',
    helper: 'Invent it. The stranger and truer, the better.',
    type: 'text',
    placeholder: '"The Girl Who Swallowed the Moon"…',
  },
  {
    key: 'threewords',
    chapter: 'I',
    chapterTitle: 'Identity & Legacy',
    prompt: 'Three words for the energy you want this crest to carry.',
    helper: 'For example: courage, devotion, mischief.',
    type: 'text',
    placeholder: 'word, word, word',
  },
  {
    key: 'bestself',
    chapter: 'I',
    chapterTitle: 'Identity & Legacy',
    prompt: 'When people meet you at your best, what do you hope they feel?',
    type: 'textarea',
    placeholder: 'Safe, dared, seen, lit up…',
  },
  {
    key: 'turningpoint',
    chapter: 'I',
    chapterTitle: 'Identity & Legacy',
    prompt: 'Which achievement or turning point should this piece commemorate?',
    type: 'textarea',
    placeholder: 'A threshold you crossed…',
  },

  // Chapter II — Spirit & Archetype
  {
    key: 'animal',
    chapter: 'II',
    chapterTitle: 'Spirit & Archetype',
    prompt: 'Which animal feels most like your spirit ally right now — and why?',
    helper: 'Wolf, owl, serpent, dolphin, horse, raven… trust the first that arrives.',
    type: 'textarea',
    placeholder: 'The creature, and why it\'s yours…',
  },
  {
    key: 'archetype',
    chapter: 'II',
    chapterTitle: 'Spirit & Archetype',
    prompt: 'Which archetype feels closest to you?',
    helper: 'Choose as many as ring true.',
    type: 'multi',
    cols: 4,
    options: [
      { value: 'warrior', label: 'Warrior' },
      { value: 'lover', label: 'Lover' },
      { value: 'mystic', label: 'Mystic' },
      { value: 'sovereign', label: 'Queen / King' },
      { value: 'sage', label: 'Sage' },
      { value: 'parent', label: 'Mother / Father' },
      { value: 'rebel', label: 'Rebel' },
    ],
  },
  {
    key: 'element',
    chapter: 'II',
    chapterTitle: 'Spirit & Archetype',
    prompt: 'Which element do you feel most at home in?',
    type: 'options',
    cols: 4,
    options: [
      { value: 'earth', symbol: '◬', label: 'Earth' },
      { value: 'air', symbol: '✺', label: 'Air' },
      { value: 'fire', symbol: '✦', label: 'Fire' },
      { value: 'water', symbol: '〜', label: 'Water' },
    ],
    followup: 'How does it show up in your life?',
  },
  {
    key: 'plant',
    chapter: 'II',
    chapterTitle: 'Spirit & Archetype',
    prompt: 'Is there a plant, tree, or flower you feel deeply connected to?',
    helper: 'And what does it symbolize for you?',
    type: 'textarea',
    placeholder: 'Olive, oak, jasmine, fern…',
  },
  {
    key: 'symbol',
    chapter: 'II',
    chapterTitle: 'Spirit & Archetype',
    prompt: 'Which symbol calls to you most?',
    helper: 'Choose one — or skip and describe your own below.',
    type: 'symbol-picker',
    placeholder: 'Or describe your own symbol…',
  },

  // Chapter III — Origins & Talismans
  {
    key: 'origin',
    chapter: 'III',
    chapterTitle: 'Origins & Talismans',
    prompt: 'Where do you feel you "come from" on a soul level?',
    helper: 'A city, a landscape, a country, an ancestral culture.',
    type: 'textarea',
    placeholder: 'The place your spirit answers to…',
  },
  {
    key: 'numbers',
    chapter: 'III',
    chapterTitle: 'Origins & Talismans',
    prompt: 'Is there a date, year, or set of numbers that feels talismanic?',
    helper: 'A birth year, anniversary, lucky number, angel numbers.',
    type: 'text',
    placeholder: 'e.g. 11:11 · 1987 · 7',
  },
  {
    key: 'motto',
    chapter: 'III',
    chapterTitle: 'Origins & Talismans',
    prompt: 'If your family or chosen family had a motto, what would it be?',
    helper: 'One short phrase — or even a single word.',
    type: 'text',
    placeholder: 'A few words to stand on…',
  },
  {
    key: 'insideout',
    chapter: 'III',
    chapterTitle: 'Origins & Talismans',
    prompt: 'What belongs on the outside of the crest — and what stays hidden inside?',
    helper: 'The face you show the world, and the private mantra only you know.',
    type: 'textarea',
    placeholder: 'Outside: … · Inside: …',
  },

  // Chapter IV — The Road Ahead
  {
    key: 'callingin',
    chapter: 'IV',
    chapterTitle: 'The Road Ahead',
    prompt: 'What are you calling in — what do you most want more of next?',
    type: 'textarea',
    placeholder: 'The thing on its way to you…',
  },
  {
    key: 'protection',
    chapter: 'IV',
    chapterTitle: 'The Road Ahead',
    prompt: 'What do you need protection from — and what does protection feel like?',
    helper: 'Clear boundaries, safe travel, steadfast love…',
    type: 'textarea',
    placeholder: 'What guards you, and how…',
  },
  {
    key: 'futureself',
    chapter: 'IV',
    chapterTitle: 'The Road Ahead',
    prompt: 'Picture your future self, ten years on, wearing this crest. What has become true?',
    type: 'textarea',
    placeholder: 'What they know now…',
  },
  {
    key: 'mantra',
    chapter: 'IV',
    chapterTitle: 'The Road Ahead',
    prompt: 'Is there a quote, mantra, or tiny phrase you\'d like encoded in the crest?',
    helper: 'In any language. Leave it blank and the Oracle will find one for you.',
    type: 'text',
    placeholder: 'Optional — or let the Oracle choose',
  },
];
