export type TarotSpread = {
  id: string;
  name: string;
  description: string;
  positions: string[];
  accent: "gold" | "moss" | "clay" | "ink";
};

export const TAROT_SPREADS: TarotSpread[] = [
  {
    id: "one-card",
    name: "One Card",
    description: "One image for the matter before you.",
    positions: ["The matter"],
    accent: "gold",
  },
  {
    id: "three-card",
    name: "Three Card",
    description: "What is known, what is hidden, what must be done.",
    positions: ["What is known", "What is hidden", "What must be done"],
    accent: "moss",
  },
  {
    id: "past-present-future",
    name: "Past · Present · Future",
    description: "The ground you left, what is uncovered now, and what comes next.",
    positions: ["Past", "Present", "Future"],
    accent: "gold",
  },
  {
    id: "relationship",
    name: "Relationship",
    description: "You, the other, the bond, and what asks to be faced.",
    positions: ["You", "The other", "The bond", "What must be faced"],
    accent: "clay",
  },
  {
    id: "celtic-cross",
    name: "Celtic Cross",
    description: "A ten-card map for the whole matter and its horizon.",
    positions: ["The heart of it", "What crosses it", "What is beneath", "What is behind", "What is above", "What approaches", "Your stance", "The field around you", "Hope and fear", "Where it is leading"],
    accent: "ink",
  },
];

const majors = [
  "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor", "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit", "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance", "The Devil", "The Tower", "The Star", "The Moon", "The Sun", "Judgement", "The World",
];

const ranks = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Page", "Knight", "Queen", "King"];
const suits = ["Wands", "Cups", "Swords", "Pentacles"];

export const TAROT_DECK = [
  ...majors,
  ...suits.flatMap((suit) => ranks.map((rank) => `${rank} of ${suit}`)),
];

export function drawCards(count: number): string[] {
  const deck = [...TAROT_DECK];
  const cards: string[] = [];

  while (cards.length < count && deck.length > 0) {
    const index = Math.floor(Math.random() * deck.length);
    cards.push(deck.splice(index, 1)[0]);
  }

  return cards;
}
