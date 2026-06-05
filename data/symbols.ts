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
    meaning: 'You cannot rush your own unfolding',
    promptDescription: 'an engraved nautilus shell (the spiral of sacred unfolding, growth that cannot be forced)',
  },
  {
    value: 'honeycomb',
    label: 'Honeycomb',
    emoji: '⬡',
    meaning: 'Devotion made visible',
    promptDescription: 'an engraved honeycomb (devotion made visible, the quiet alchemy of showing up)',
  },
  {
    value: 'star',
    label: 'Star',
    emoji: '✦',
    meaning: 'The light that never asks permission',
    promptDescription: 'an engraved star (the light within that needs no permission to shine)',
  },
  {
    value: 'greek-key',
    label: 'Greek Key',
    emoji: '⌘',
    meaning: 'What your ancestors carried for you',
    promptDescription: 'an engraved Greek key meander (the unbroken thread of ancestral lineage and inheritance)',
  },
  {
    value: 'flame',
    label: 'Flame',
    emoji: '🔥',
    meaning: 'It takes discipline to be a free spirit',
    promptDescription: 'an engraved flame (the sacred fire of discipline, passion, and spiritual courage)',
  },
  {
    value: 'labyrinth',
    label: 'Labyrinth',
    emoji: '◎',
    meaning: 'The body knows the way',
    promptDescription: 'an engraved labyrinth (the somatic path inward, where the body leads and the mind follows)',
  },
  {
    value: 'palm',
    label: 'Palm',
    emoji: '🌴',
    meaning: 'Softness that survives every storm',
    promptDescription: 'an engraved palm frond (resilience through surrender, surviving by bending not breaking)',
  },
  {
    value: 'quatrefoil',
    label: 'Quatrefoil',
    emoji: '✿',
    meaning: 'Wholeness was never lost',
    promptDescription: 'an engraved quatrefoil (the remembrance of wholeness, sacred balance already present)',
  },
  {
    value: 'sun',
    label: 'Sun',
    emoji: '☀',
    meaning: 'Awakening is the most vital part of a human life',
    promptDescription: 'an engraved radiant sun (awakening, the clarifying light that burns through illusion)',
  },
  {
    value: 'pyramid',
    label: 'Pyramid',
    emoji: '△',
    meaning: 'Heaven and earth, met in the body',
    promptDescription: 'an engraved pyramid (the meeting point of heaven and earth, spiritual and material unified)',
  },
  {
    value: 'raven',
    label: 'Raven',
    emoji: '🪶',
    meaning: 'Magic lives at the edge of what you know',
    promptDescription: 'an engraved raven (the messenger between worlds, magic at the threshold of the unknown)',
  },
  {
    value: 'serpent',
    label: 'Serpent',
    emoji: '🐍',
    meaning: 'Shedding is how you survive',
    promptDescription: 'an engraved serpent (sacred transformation through shedding, death and rebirth as medicine)',
  },
  {
    value: 'eye',
    label: 'Eye',
    emoji: '👁',
    meaning: 'See yourself without flinching',
    promptDescription: 'an engraved eye (unflinching self-witness, the courage to see clearly)',
  },
  {
    value: 'moon',
    label: 'Moon',
    emoji: '☽',
    meaning: 'Trust the dark as much as the light',
    promptDescription: 'an engraved crescent moon (trust in darkness, cycles of release and return)',
  },
  {
    value: 'spiral',
    label: 'Spiral',
    emoji: '𓇽',
    meaning: 'You return, but never as the same person',
    promptDescription: 'an engraved spiral (the cyclical nature of healing, returning transformed)',
  },
];

export function getSymbolByValue(value: string): Symbol | undefined {
  return SYMBOLS.find((s) => s.value === value);
}
