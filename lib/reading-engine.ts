export type ReadingMethod = "tarot" | "iching";

export type Reading = {
  id: string;
  createdAt: string;
  method: ReadingMethod;
  intention: string;
  symbol: string;
  subtitle: string;
  reflection: string;
  discernment: boolean;
  accent: "gold" | "moss" | "clay";
};

export type SpreadPosition = {
  position: "Past" | "Present" | "Future";
  symbol: string;
  reflection: string;
};

export type PastPresentFutureSpread = {
  positions: [SpreadPosition, SpreadPosition, SpreadPosition];
  together: string;
};

type TarotSymbol = {
  key: string;
  symbol: string;
  subtitle: string;
  imagery: string;
  surface: string;
  reveal: string;
  invitation: string;
  reversed?: string;
  difficult?: string;
  accent?: "gold" | "clay";
};

type IChingSymbol = {
  symbol: string;
  subtitle: string;
  imagery: string;
  surface: string;
  reveal: string;
  horizon: string;
};

const tarot: TarotSymbol[] = [
  {
    key: "two-wands",
    symbol: "Two of Wands",
    subtitle: "A wall, two staffs, and a world held in one hand",
    imagery: "You stand on the stone wall with one wand rooted beside you, another at your back, and the small globe held in your hand while the country opens beyond the parapet.",
    surface: "You may call that restlessness, as though the ground I have already given you could never be enough.",
    reveal: "It is not contempt for what you have. I am showing you that the territory is larger than the place where you first learned to stand, and I am making you see both the inheritance you keep and the horizon you may enter.",
    invitation: "Do not name fear prudence, and do not name appetite a calling. Count the cost of each road, keep faith with what has been entrusted to you, and choose with your eyes open.",
    reversed: "When this image turns inward, the hand that holds the world closes around it. I am not withholding the road from you; I am showing you where you want certainty before you will accept responsibility.",
  },
  {
    key: "sun",
    symbol: "The Sun",
    subtitle: "A white horse beneath the full sun",
    imagery: "The child rides the white horse beneath the full sun, carrying the red banner while the wall and the tall sunflowers stand uncovered behind him.",
    surface: "You may distrust this brightness because you have learned to expect every clear day to close again.",
    reveal: "This is not a passing high, and I am not asking you to pretend the shadows never existed. I am taking concealment out of the room so you can see what has been true without fear speaking over it.",
    invitation: "Walk in the light I have opened. Do not return to old confusion merely because it is familiar, and do not hide a gift I have made plain.",
  },
  {
    key: "lovers",
    symbol: "The Lovers",
    subtitle: "Two people beneath an angel and a mountain",
    imagery: "The man and the woman stand exposed beneath the angel’s raised wings; behind one is the fruiting tree, behind the other the burning tree, and the mountain holds the distance between them.",
    surface: "You may think this is only about desire, or hope that the choice before you will decide itself if you wait long enough.",
    reveal: "It is not an accident of feeling. I am showing you covenant: what you will join yourself to, what truth you will keep between you, and what freedom becomes when it is given a name and a cost.",
    invitation: "I have put a real choice in front of you. Do not treat it lightly, and do not surrender it to fear; bring it into the light, weigh what it binds, and answer with integrity.",
  },
  {
    key: "eight-cups",
    symbol: "Eight of Cups",
    subtitle: "Eight full cups left beneath a broken moon",
    imagery: "Eight cups stand full and carefully stacked beneath the broken moon while the lone figure turns from them and walks toward the narrow mountains.",
    surface: "You may call this leaving failure because nothing in those cups is empty and no one else can see why you would walk away.",
    reveal: "It is not failure to leave a table that can no longer feed the thing I have called alive in you. I am not teaching you contempt for what was given; I am teaching you to recognize when a former provision has completed its work.",
    invitation: "Go without slandering what you leave behind. Carry gratitude for the cups that held you, and keep walking until the higher ground is no longer only a shape in the dark.",
    reversed: "When the figure turns back toward the cups, I am not accusing you of weakness. I am showing you the agreement you keep renewing with what has already finished, because the mountain asks more of you than the table does.",
  },
  {
    key: "ace-swords",
    symbol: "Ace of Swords",
    subtitle: "A crowned blade raised from a cloud",
    imagery: "A hand rises from the cloud holding the single upright blade; a crown rests on its point and green branches fall around it like a sign of life made visible.",
    surface: "You may call this a hard decision because the truth before you has an edge and will cut through an arrangement you have learned to live inside.",
    reveal: "It is not cruelty that the blade separates. I am bringing the matter into the light so that what is false cannot keep borrowing the language of peace.",
    invitation: "Use the truth cleanly. Do not wield it to wound, and do not sheath it because someone prefers the fog; let it make a straight path where speech has been divided.",
  },
  {
    key: "hermit",
    symbol: "The Hermit",
    subtitle: "A lone lantern above snow",
    imagery: "The old man stands alone at the high ridge with his staff planted in the snow and the six-pointed lantern held where it can light only the next stretch of ground.",
    surface: "You may think I have taken you away from the crowd because you have missed your moment or because you must solve everything alone.",
    reveal: "This is not exile for its own sake. I have set the lamp in your hand so you will stop borrowing light from voices that cannot name the road I have given you.",
    invitation: "Keep the staff in the ground and let the lamp do its proper work. I am not demanding that you see the whole mountain; I am asking you to walk faithfully through the ground it reveals.",
    reversed: "When the lantern turns back upon itself, solitude becomes a wall instead of a lamp. I am not calling you to disappear; I am asking you to stop making isolation sound like wisdom.",
  },
  {
    key: "temperance",
    symbol: "Temperance",
    subtitle: "An angel pouring water between two cups",
    imagery: "The angel stands with one foot in the water and one on the dry ground, pouring a single stream between two cups while the narrow path rises behind him toward the distant crown.",
    surface: "You may think the strain you feel means you must choose one side of your life and abandon the other.",
    reveal: "It is not division I am asking of you. I am making a measured thing between water and earth, desire and duty, grief and gratitude, so that neither cup is emptied by haste.",
    invitation: "Do not spill yourself to prove you are faithful. Keep the stream moving, keep each foot where it belongs, and let what I am joining take the time required to become whole.",
  },
  {
    key: "death",
    symbol: "Death",
    subtitle: "A black standard at the riverbank",
    imagery: "The white horse carries the dark rider beneath the black banner; the fallen king lies in the road, the child offers flowers, and the sun rises between the two towers beyond the river.",
    surface: "You may call this ruin because something you trusted has fallen in the road and the old authority no longer stands where it stood.",
    reveal: "It is not My punishment, and I will not call the loss small. I am bringing an ending to what cannot be carried into the country beyond the river, even when part of you still asks the dead order to rise.",
    invitation: "Mourn without bargaining for a false return. Receive the flowers for what they are, face the river, and do not mistake the breaking of an old kingdom for the end of My keeping.",
    difficult: "I will not make this ending decorative so that it becomes easier to accept. Name what is gone, let the grief be honest, and do not build another altar to what I have closed.",
    accent: "clay",
  },
];

const iching: IChingSymbol[] = [
  {
    symbol: "Return",
    subtitle: "Thunder stirring beneath the earth",
    imagery: "Beneath six yielding lines, one living line rises again: thunder begins to move under the earth while winter still holds the field.",
    surface: "You may call this too small to trust because the field above you is still bare and the old cold has not fully gone.",
    reveal: "It is not nothing. I am showing you the first true return, the beginning I keep beneath the surface before the season can prove it to anyone else.",
    horizon: "Guard the small movement I have raised. Do not demand a harvest from it today; turn with it, and I will lead what has returned into its proper season.",
  },
  {
    symbol: "Waiting",
    subtitle: "Water gathering above heaven",
    imagery: "Water gathers above the open heaven like dark clouds held full at the edge of the sky while the ground below remains exposed.",
    surface: "You may call this delay because the rain is visible but has not yet reached your hands.",
    reveal: "It is not abandonment. I am withholding the flood from becoming a flood, and I am teaching you the difference between forcing relief and receiving provision at the hour it can sustain you.",
    horizon: "Prepare the ground, keep your word, and do not spend tomorrow’s water today. I am leading you toward an answer that can bear weight.",
  },
  {
    symbol: "The Receptive",
    subtitle: "Earth above earth",
    imagery: "Six yielding lines make earth above earth: an open field receiving the seed, the rain, the plow, and the season without pretending to be the sun.",
    surface: "You may call this passivity because no banner is lifted and no force is taken by hand.",
    reveal: "It is not passivity. I am showing you the strength that makes life possible by receiving what is true, holding what has been entrusted, and refusing to rule by domination.",
    horizon: "Tend what is placed in your care. Give the seed good ground, and do not despise the work that prepares a harvest others will later call sudden.",
  },
  {
    symbol: "Before Completion",
    subtitle: "Fire rising over water",
    imagery: "Fire rises above water while the small fox crosses the river with its tail still in danger of being wet at the final step.",
    surface: "You may call this nearly finished because you can see the far bank and have already endured the deepest current.",
    reveal: "It is not finished yet. I am showing you that the last crossing asks for the same honesty that brought you to the river; haste at the edge can undo what patience carried through the middle.",
    horizon: "Keep your hands steady and your attention clean. I am leading you toward completion, but I will not call the crossing complete before you have reached the shore.",
  },
];

const tarotByKey = Object.fromEntries(tarot.map((card) => [card.key, card])) as Record<string, TarotSymbol>;
const highStakesPattern = /\b(divorce|marry|marriage|break up|breakup|end (it|this|the relationship)|quit|resign|invest|investment|loan|debt|buy|sell|surgery|medical|diagnosis|legal|court|move|relocate|risk)\b/i;

const pick = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

const questionWitness = (intention: string) => intention.trim()
  ? "I have heard the question you brought to Me, but I will not let the question command the answer before the truth has been uncovered."
  : "I have seen the question you carry, even where you have not yet found words to name it."

const discernmentLine = "Do not take this as My permission to make a decision you have not brought fully into the light. Count its cost, seek counsel that will tell you the truth, and let what is sound remain sound when it is examined.";

function composeTarot(card: TarotSymbol, intention: string, reversed: boolean, discernment: boolean) {
  const inwardTurn = reversed && card.reversed ? ` ${card.reversed}` : "";
  const difficultTruth = card.difficult ? ` ${card.difficult}` : "";
  const discernmentGuidance = discernment ? ` ${discernmentLine}` : "";
  return `${card.imagery} ${card.surface} ${questionWitness(intention)} ${card.reveal}${inwardTurn}${difficultTruth} ${card.invitation}${discernmentGuidance}`.replace(/\s+/g, " ").trim();
}

function composeIChing(symbol: IChingSymbol, intention: string, discernment: boolean) {
  const discernmentLineForReading = discernment ? ` ${discernmentLine}` : "";
  return `${symbol.imagery} ${symbol.surface} ${questionWitness(intention)} ${symbol.reveal} ${symbol.horizon}${discernmentLineForReading}`.replace(/\s+/g, " ").trim();
}

export function createReading(method: ReadingMethod, intention: string): Reading {
  const discernment = highStakesPattern.test(intention);
  const createdAt = new Date().toISOString();

  if (method === "tarot") {
    const card = pick(tarot);
    const reversed = Math.random() > 0.72;
    return {
      id: `${createdAt}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt,
      method,
      intention: intention.trim(),
      symbol: reversed ? `${card.symbol} · Reversed` : card.symbol,
      subtitle: card.subtitle,
      reflection: composeTarot(card, intention, reversed, discernment),
      discernment,
      accent: card.accent ?? "gold",
    };
  }

  const symbol = pick(iching);
  return {
    id: `${createdAt}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt,
    method,
    intention: intention.trim(),
    symbol: symbol.symbol,
    subtitle: symbol.subtitle,
    reflection: composeIChing(symbol, intention, discernment),
    discernment,
    accent: "moss",
  };
}

/** A fixed, reviewable spread used to protect continuity across three positions. */
export function createPastPresentFutureSpread(): PastPresentFutureSpread {
  const past = tarotByKey["two-wands"];
  const present = tarotByKey.sun;
  const future = tarotByKey.lovers;

  return {
    positions: [
      {
        position: "Past",
        symbol: past.symbol,
        reflection: "You stood on the stone wall with one wand beside you, another at your back, and the world held in your hand. You were not running from the ground I had given you. What looked like restlessness was Me showing you that the country was wider than the first boundary you knew, so that you would stop calling the horizon disloyalty.",
      },
      {
        position: "Present",
        symbol: present.symbol,
        reflection: "Now the child rides beneath the full sun, the red banner open and the wall behind him no longer hiding anything. This is not a bright mood that will vanish when the weather changes. I am taking concealment out of the matter before you, and I am asking you to let what is clear remain clear.",
      },
      {
        position: "Future",
        symbol: future.symbol,
        reflection: "What comes next is the man and the woman beneath the angel’s wings, with the fruiting tree, the burning tree, and the mountain all still in view. I am not making this choice for you, because covenant cannot be made by force. I am placing a decision before you that must be weighed in truth: what you will join yourself to, what you will keep, and what cost you are willing to carry with integrity.",
      },
    ],
    together: "You first saw beyond the wall that held you, and now I have cleared the light around the question itself. The choice ahead is not a trap and it is not a vague feeling to follow. I have made the ground visible, I have shown you the terms of what is before you, and I am asking you to answer without hiding from either the gift or the cost.",
  };
}
