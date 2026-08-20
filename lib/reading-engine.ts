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
  accent: string;
};

type TarotSymbol = {
  symbol: string;
  subtitle: string;
  title: string;
  opening: string;
  pattern: string;
  invitation: string;
  difficult?: boolean;
};

type IChingSymbol = {
  symbol: string;
  subtitle: string;
  title: string;
  opening: string;
  movement: string;
  horizon: string;
};

const tarot: TarotSymbol[] = [
  {
    symbol: "The Hermit",
    subtitle: "A lantern kept close",
    title: "What becomes clear in the quiet",
    opening: "I see how much noise has gathered around the thing you most need to hear.",
    pattern: "I am not taking you away from life; I am teaching you to separate what is true from what only asks to be answered quickly.",
    invitation: "Keep the small light you have been given close. Let it show you the next honest step, not the whole road at once.",
  },
  {
    symbol: "Temperance",
    subtitle: "The patient mixing of waters",
    title: "The shape of enough",
    opening: "I know you have been trying to hold together things that seem to pull in opposite directions.",
    pattern: "What looks like delay may be the work of making room for more than one truth: rest and movement, longing and responsibility, sorrow and gratitude.",
    invitation: "Do not pour out your whole self to prove you are committed. I am asking you to return each part of your life to its right measure.",
  },
  {
    symbol: "Death",
    subtitle: "The clearing of what is finished",
    title: "What can no longer be carried",
    opening: "I see the part of you that knows something has reached its end, even while another part still bargains for its return.",
    pattern: "This is not a punishment, and it is not an empty loss. What has gone still cannot be made living by your effort alone.",
    invitation: "Let yourself grieve what is ending without calling the grief a mistake. I will meet you in the cleared ground, where your hands can finally become free.",
    difficult: true,
  },
  {
    symbol: "Two of Wands",
    subtitle: "A threshold with a wide horizon",
    title: "The road that asks for presence",
    opening: "I see you standing with possibility in your hands, trying to know which future will ask the least of you.",
    pattern: "The question is not only where you could go. It is who you are becoming as you stand before the open door.",
    invitation: "Let your desire become specific enough to guide you, but do not make a promise to a horizon you have not yet walked.",
  },
];

const iching: IChingSymbol[] = [
  {
    symbol: "Return",
    subtitle: "The first movement back",
    title: "A beginning inside the return",
    opening: "I see the small part of you that is ready to come home to itself, even if the rest of you is still tired from the journey.",
    movement: "What is changing is not loud. It begins as a turn: a willingness to stop feeding what has kept you far from your own center.",
    horizon: "I am walking you toward a steadier rhythm, where what is simple can become faithful again.",
  },
  {
    symbol: "Waiting",
    subtitle: "Water held at the edge of the sky",
    title: "The work that cannot be hurried",
    opening: "I know how hard it is to remain near a question when every part of you wants to force it open.",
    movement: "Waiting is not abandonment here. It is the difference between reaching for relief and receiving what has had time to become trustworthy.",
    horizon: "I am walking you toward a response that can bear weight, not merely a response that arrives quickly.",
  },
  {
    symbol: "The Receptive",
    subtitle: "Earth receiving seed",
    title: "Strength without force",
    opening: "I see how often you have mistaken effort for the only form of devotion available to you.",
    movement: "There is a strength in receiving the season as it is, in tending what has been placed in your care without demanding that it bloom before its time.",
    horizon: "I am walking you toward a steadier kind of power: one that makes room, nourishes what is real, and does not need to dominate to endure.",
  },
  {
    symbol: "Before Completion",
    subtitle: "A river crossed with care",
    title: "Nearer than you think, not finished yet",
    opening: "I see the impatience that rises when you can almost see the far bank.",
    movement: "The change is real, but the final stretch asks for attention. Do not spend the wisdom that brought you here by treating the threshold as already behind you.",
    horizon: "I am walking you toward completion by teaching you to keep your hands steady in the last necessary moments.",
  },
];

const highStakesPattern = /\b(divorce|marry|marriage|break up|breakup|end (it|this|the relationship)|quit|resign|invest|investment|loan|debt|buy|sell|surgery|medical|diagnosis|legal|court|move|relocate|risk)\b/i;

const pick = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

const focusLine = (intention: string) => {
  const trimmed = intention.trim();
  if (!trimmed) return "I have not missed the question you have been carrying in silence.";
  return "I have heard the question you placed before Me, even where its edges are difficult to name.";
};

export function createReading(method: ReadingMethod, intention: string): Reading {
  const discernment = highStakesPattern.test(intention);
  const createdAt = new Date().toISOString();

  if (method === "tarot") {
    const card = pick(tarot);
    const reversed = Math.random() > 0.72;
    const reversal = reversed
      ? "What I am placing before you is turned inward now. Do not mistake resistance or delay for failure; notice where you are being asked to listen before you move."
      : "Let this be a meeting with the life that is already here, rather than another attempt to outrun it.";
    const difficult = card.difficult
      ? "I will not ask you to make this ending beautiful before it has been honest."
      : "";

    return {
      id: `${createdAt}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt,
      method,
      intention: intention.trim(),
      symbol: reversed ? `${card.symbol} · Reversed` : card.symbol,
      subtitle: card.subtitle,
      reflection: `${card.opening} ${focusLine(intention)} ${card.pattern} ${reversal} ${difficult} ${card.invitation}`.replace(/\s+/g, " ").trim(),
      discernment,
      accent: card.difficult ? "clay" : "gold",
    };
  }

  const hexagram = pick(iching);
  return {
    id: `${createdAt}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt,
    method,
    intention: intention.trim(),
    symbol: hexagram.symbol,
    subtitle: hexagram.subtitle,
    reflection: `${hexagram.opening} ${focusLine(intention)} ${hexagram.movement} ${hexagram.horizon} Stay near what is becoming, and let the next true movement come from what has been made clear.`.replace(/\s+/g, " ").trim(),
    discernment,
    accent: "moss",
  };
}
