export interface Quote {
  text: string;
  author: string;
  tags: string[];
}

// Every quote real and verified. Tags used for matching to answers.
// ⚠️ Expand to ~150 before a heavily-promoted launch. Every added quote must be verified real and correctly attributed.
export const QUOTES: Quote[] = [
  { text: "It takes discipline to be a free spirit.", author: "Gabrielle Roth", tags: ["freedom", "discipline", "spirit", "rebel"] },
  { text: "The only way to deal with an unfree world is to become so absolutely free that your very existence is an act of rebellion.", author: "Albert Camus", tags: ["freedom", "rebel", "power"] },
  { text: "I am no bird; and no net ensnares me: I am a free human being with an independent will.", author: "Charlotte Brontë", tags: ["freedom", "independence", "sovereign"] },
  { text: "Life shrinks or expands in proportion to one's courage.", author: "Anaïs Nin", tags: ["courage", "life", "warrior"] },
  { text: "Courage is grace under pressure.", author: "Ernest Hemingway", tags: ["courage", "grace", "warrior"] },
  { text: "You gain strength, courage and confidence by every experience in which you really stop to look fear in the face.", author: "Eleanor Roosevelt", tags: ["courage", "strength", "fear", "warrior"] },
  { text: "Where there is love there is life.", author: "Mahatma Gandhi", tags: ["love", "life", "lover"] },
  { text: "Let yourself be silently drawn by the strange pull of what you really love.", author: "Rumi", tags: ["love", "devotion", "soul", "mystic"] },
  { text: "The best thing to hold on to in life is each other.", author: "Audrey Hepburn", tags: ["love", "connection", "lover", "parent"] },
  { text: "And the day came when the risk to remain tight in a bud was more painful than the risk it took to blossom.", author: "Anaïs Nin", tags: ["transformation", "growth", "courage"] },
  { text: "We must be willing to let go of the life we planned so as to have the life that is waiting for us.", author: "Joseph Campbell", tags: ["transformation", "journey", "mystic"] },
  { text: "What the caterpillar calls the end of the world, the master calls a butterfly.", author: "Richard Bach", tags: ["transformation", "mystic"] },
  { text: "In every walk with nature one receives far more than he seeks.", author: "John Muir", tags: ["nature", "earth"] },
  { text: "Look deep into nature, and then you will understand everything better.", author: "Albert Einstein", tags: ["nature", "wisdom", "earth", "sage"] },
  { text: "Adopt the pace of nature: her secret is patience.", author: "Ralph Waldo Emerson", tags: ["nature", "patience", "earth", "stillness"] },
  { text: "Knowing yourself is the beginning of all wisdom.", author: "Aristotle", tags: ["wisdom", "self", "sage"] },
  { text: "Wisdom begins in wonder.", author: "Socrates", tags: ["wisdom", "wonder", "sage", "mystic"] },
  { text: "The wound is the place where the Light enters you.", author: "Rumi", tags: ["resilience", "healing", "light", "mystic"] },
  { text: "That which does not kill us makes us stronger.", author: "Friedrich Nietzsche", tags: ["resilience", "strength", "warrior"] },
  { text: "I am not afraid of storms, for I am learning how to sail my ship.", author: "Louisa May Alcott", tags: ["resilience", "courage", "journey", "water"] },
  { text: "Within you there is a stillness and a sanctuary to which you can retreat at any time and be yourself.", author: "Hermann Hesse", tags: ["stillness", "peace", "water", "mystic"] },
  { text: "Nature does not hurry, yet everything is accomplished.", author: "Lao Tzu", tags: ["stillness", "patience", "nature", "sage", "earth"] },
  { text: "Be like water making its way through cracks.", author: "Bruce Lee", tags: ["water", "flow", "adaptability"] },
  { text: "The most beautiful thing we can experience is the mysterious.", author: "Albert Einstein", tags: ["mystery", "wonder", "mystic", "air"] },
  { text: "There are years that ask questions and years that answer.", author: "Zora Neale Hurston", tags: ["mystery", "time", "wisdom", "sage"] },
  { text: "No one can make you feel inferior without your consent.", author: "Eleanor Roosevelt", tags: ["power", "sovereign", "self"] },
  { text: "I am the master of my fate, I am the captain of my soul.", author: "William Ernest Henley", tags: ["sovereign", "power", "will", "warrior"] },
  { text: "Well-behaved women seldom make history.", author: "Laurel Thatcher Ulrich", tags: ["rebel", "power", "freedom"] },
  { text: "Not all those who wander are lost.", author: "J.R.R. Tolkien", tags: ["journey", "freedom", "seeker", "air"] },
  { text: "It is good to have an end to journey toward; but it is the journey that matters in the end.", author: "Ursula K. Le Guin", tags: ["journey", "seeker"] },
  { text: "Creativity takes courage.", author: "Henri Matisse", tags: ["creativity", "courage", "rebel"] },
  { text: "You can't use up creativity. The more you use, the more you have.", author: "Maya Angelou", tags: ["creativity", "rebel"] },
  { text: "Set your life on fire. Seek those who fan your flames.", author: "Rumi", tags: ["fire", "passion", "mystic"] },
  { text: "I would rather be ashes than dust.", author: "Jack London", tags: ["fire", "passion", "rebel", "warrior"] },
  { text: "Hope is the thing with feathers that perches in the soul.", author: "Emily Dickinson", tags: ["hope", "air", "soul"] },
  { text: "There is a crack in everything. That's how the light gets in.", author: "Leonard Cohen", tags: ["hope", "light", "resilience"] },
  { text: "Keep your face always toward the sunshine—and shadows will fall behind you.", author: "Walt Whitman", tags: ["hope", "light"] },
  { text: "There is no friendship, no love, like that of the parent for the child.", author: "Henry Ward Beecher", tags: ["love", "nurture", "parent", "family"] },
  { text: "The privilege of a lifetime is to become who you truly are.", author: "Carl Jung", tags: ["self", "becoming", "mystic", "universal"] },
  { text: "Tell me, what is it you plan to do with your one wild and precious life?", author: "Mary Oliver", tags: ["life", "wonder", "freedom", "universal"] },
];

export const ARCHETYPE_TAGS: Record<string, string[]> = {
  warrior: ["courage", "strength", "warrior", "resilience"],
  lover: ["love", "devotion", "lover", "passion"],
  mystic: ["mystery", "spirit", "mystic", "wonder", "stillness"],
  sovereign: ["power", "sovereign", "will"],
  sage: ["wisdom", "sage", "stillness", "patience"],
  parent: ["love", "nurture", "parent", "family"],
  rebel: ["freedom", "rebel", "creativity"],
};

export const ELEMENT_TAGS: Record<string, string[]> = {
  fire: ["fire", "passion", "transformation", "courage"],
  water: ["water", "flow", "stillness", "peace"],
  earth: ["earth", "nature", "patience", "stillness"],
  air: ["air", "freedom", "wonder", "mystery", "hope"],
};

export const ARCH_LABEL: Record<string, string> = {
  warrior: "Warrior",
  lover: "Lover",
  mystic: "Mystic",
  sovereign: "Queen / King",
  sage: "Sage",
  parent: "Mother / Father",
  rebel: "Rebel",
};
