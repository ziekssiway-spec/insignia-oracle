// Universal symbols drawn from heraldic, ancient, and cross-cultural traditions.
// Meanings written for the Insignia Oracle.

export interface Symbol {
  value: string;
  label: string;
  emoji: string;
  meaning: string;
  promptDescription: string;
}

export const SYMBOLS: Symbol[] = [
  {
    value: 'nautilus',
    label: 'Nautilus Shell',
    emoji: '🐚',
    meaning: 'Unfolding & becoming',
    promptDescription: 'an engraved nautilus shell (symbolizing sacred unfolding and the spiral of growth)',
  },
  {
    value: 'honeycomb',
    label: 'Honeycomb',
    emoji: '⬡',
    meaning: 'Order & community',
    promptDescription: 'an engraved honeycomb (symbolizing the beauty of structure, patience, and collective purpose)',
  },
  {
    value: 'star',
    label: 'Star',
    emoji: '✦',
    meaning: 'Guidance & longing',
    promptDescription: 'an engraved six-pointed star (symbolizing inner light and the pull toward what matters)',
  },
  {
    value: 'greek-key',
    label: 'Greek Key',
    emoji: '⌘',
    meaning: 'Continuity & legacy',
    promptDescription: 'an engraved Greek key meander (symbolizing the unbroken thread of lineage and time)',
  },
  {
    value: 'flame',
    label: 'Flame',
    emoji: '🔥',
    meaning: 'Passion & courage',
    promptDescription: 'an engraved flame (symbolizing the fire that drives and transforms)',
  },
  {
    value: 'labyrinth',
    label: 'Labyrinth',
    emoji: '◎',
    meaning: 'The inner journey',
    promptDescription: 'an engraved labyrinth spiral (symbolizing the winding path inward toward truth)',
  },
  {
    value: 'palm',
    label: 'Palm',
    emoji: '🌴',
    meaning: 'Victory & endurance',
    promptDescription: 'an engraved palm frond (symbolizing triumph earned through perseverance)',
  },
  {
    value: 'quatrefoil',
    label: 'Quatrefoil',
    emoji: '✿',
    meaning: 'Balance & grace',
    promptDescription: 'an engraved quatrefoil (symbolizing harmony, wholeness, and quiet spiritual power)',
  },
  {
    value: 'sun',
    label: 'Sun',
    emoji: '☀',
    meaning: 'Radiance & life force',
    promptDescription: 'an engraved radiant sun (symbolizing vitality, clarity, and the power to illuminate)',
  },
  {
    value: 'pyramid',
    label: 'Pyramid',
    emoji: '△',
    meaning: 'Mastery & permanence',
    promptDescription: 'an engraved pyramid (symbolizing the pursuit of greatness and what endures)',
  },
];

export function getSymbolByValue(value: string): Symbol | undefined {
  return SYMBOLS.find((s) => s.value === value);
}
