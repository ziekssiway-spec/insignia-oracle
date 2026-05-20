// Source: https://kimdunham.com/pages/symbol-dictionary
// Each symbol has a meaning used both in the questionnaire options and in the image prompt.

export interface Symbol {
  value: string;
  label: string;
  emoji: string;
  meaning: string;
  promptDescription: string; // used in the image generation prompt
}

export const SYMBOLS: Symbol[] = [
  {
    value: 'nautilus',
    label: 'Nautilus Shell',
    emoji: '🐚',
    meaning: 'Natural perfection & growth',
    promptDescription: 'an engraved nautilus shell (symbolizing natural perfection and the golden ratio)',
  },
  {
    value: 'honeycomb',
    label: 'Honeycomb',
    emoji: '⬡',
    meaning: 'Geometric perfection & harmony',
    promptDescription: 'an engraved honeycomb pattern (symbolizing geometric perfection and harmony)',
  },
  {
    value: 'star',
    label: 'Star',
    emoji: '✦',
    meaning: 'Dreams & guidance',
    promptDescription: 'an engraved six-pointed star (symbolizing distant dreams and guidance)',
  },
  {
    value: 'greek-key',
    label: 'Greek Key',
    emoji: '⌘',
    meaning: 'Continuity & unity',
    promptDescription: 'an engraved Greek key meander border (symbolizing timeless continuity and unity)',
  },
  {
    value: 'flame',
    label: 'Flame',
    emoji: '🔥',
    meaning: 'Passion & illumination',
    promptDescription: 'an engraved flame (symbolizing fierce elemental energy and illumination)',
  },
  {
    value: 'labyrinth',
    label: 'Labyrinth',
    emoji: '◎',
    meaning: 'Intricacy & pattern',
    promptDescription: 'an engraved labyrinth spiral (symbolizing geometric harmony and inner journey)',
  },
  {
    value: 'palm',
    label: 'Palm',
    emoji: '🌴',
    meaning: 'Victory & triumph',
    promptDescription: 'an engraved palm frond (symbolizing victory, peace, and resilience)',
  },
  {
    value: 'quatrefoil',
    label: 'Quatrefoil',
    emoji: '✿',
    meaning: 'Symmetry & spirituality',
    promptDescription: 'an engraved quatrefoil (symbolizing spiritual balance and sacred symmetry)',
  },
  {
    value: 'sun',
    label: 'Sun',
    emoji: '☀',
    meaning: 'Vitality & renewal',
    promptDescription: 'an engraved radiant sun (symbolizing life-giving energy and renewal)',
  },
  {
    value: 'pyramid',
    label: 'Pyramid',
    emoji: '△',
    meaning: 'Ancient wisdom & ambition',
    promptDescription: 'an engraved pyramid (symbolizing ancient wisdom and human ambition)',
  },
];

export function getSymbolByValue(value: string): Symbol | undefined {
  return SYMBOLS.find((s) => s.value === value);
}
