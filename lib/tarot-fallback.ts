import { getLunarMansionCard } from "../shared/lunar-mansion";
import type { CardSelection } from "../shared/reading";

/**
 * An immediately available symbolic Tarot interpretation. This is not an AI
 * response and is not represented as one; it keeps a complete reading visible
 * if the external AI provider is unavailable.
 */
const majors: Record<string, [string, string, string]> = {
  "The Fool": ["the traveler stepping toward an unseen edge", "an untested beginning", "step forward with awareness rather than reckless certainty"],
  "The Magician": ["the tools laid out on the table", "the resources already within reach", "apply your ability deliberately instead of waiting for permission"],
  "The High Priestess": ["the veiled figure between two pillars", "what remains unseen or unspoken", "observe before you force an answer"],
  "The Empress": ["the fertile garden around the seated figure", "growth that requires nourishment", "give the right things time and attention"],
  "The Emperor": ["the stone throne and commanding posture", "boundaries and responsibility", "build a structure strong enough to hold what matters"],
  "The Hierophant": ["the raised hand and keys of tradition", "teaching, commitment, and inherited rules", "test what is worth preserving and what needs understanding"],
  "The Lovers": ["the figures facing one another beneath an angel", "a choice that reflects your values", "choose with integrity rather than attraction alone"],
  "The Chariot": ["the charioteer holding two opposed forces", "a divided will demanding direction", "move only when both forces answer one purpose"],
  "Strength": ["the woman calmly tending the lion", "power expressed through restraint", "use courage without humiliating what you need to guide"],
  "The Hermit": ["the lamp raised on the mountain", "a truth found through deliberate solitude", "seek the next honest step, not instant certainty"],
  "Wheel of Fortune": ["the turning wheel", "conditions that are changing", "adapt without surrendering your principles"],
  "Justice": ["the scales and upright sword", "accountability and honest proportion", "weigh the facts before acting"],
  "The Hanged Man": ["the suspended figure seeing the world inverted", "a necessary change of perspective", "stop forcing movement that clarity has not yet earned"],
  "Death": ["the rider passing through a fallen order", "an ending that makes room for change", "release what can no longer carry you"],
  "Temperance": ["water passing between two vessels", "balance created through patient adjustment", "bring competing needs into a workable rhythm"],
  "The Devil": ["the loosely chained figures", "attachment that can be mistaken for necessity", "name what holds you and reclaim your choices"],
  "The Tower": ["lightning breaking the crown from the tower", "a structure unable to withstand the truth", "rebuild on what is real after disruption"],
  "The Star": ["the figure pouring water beneath open stars", "renewal after exposure", "replenish what has been drained"],
  "The Moon": ["the winding path between towers", "uncertainty and partial perception", "verify what you sense before treating it as fact"],
  "The Sun": ["the child beneath the bright sun", "clarity and a visible source of strength", "bring your work into daylight"],
  "Judgement": ["the figures rising at the trumpet", "a call to account for what has been left unfinished", "respond with truth rather than denial"],
  "The World": ["the figure dancing inside the wreath", "completion and integration", "honor what has been finished before beginning the next cycle"],
};
const suitImages: Record<string, [string, string]> = {
  Wands: ["the upright staffs", "initiative, creative force, and the direction of your effort"],
  Cups: ["the vessels of water", "feelings, belonging, and the way you receive or offer care"],
  Swords: ["the exposed blades", "truth, conflict, decisions, and consequences of words"],
  Pentacles: ["the marked coins", "resources, work, healthful routines, and tangible responsibilities"],
};
const ranks: Record<string, string> = {
  Ace: "a beginning that has not yet been developed",
  Two: "two needs or possibilities seeking a relationship",
  Three: "the first visible results of cooperation or effort",
  Four: "stability that can protect or become restrictive",
  Five: "disruption that tests the existing order",
  Six: "an adjustment, exchange, or return toward balance",
  Seven: "a challenge requiring discernment rather than haste",
  Eight: "momentum shaped by repetition and discipline",
  Nine: "an outcome nearing maturity",
  Ten: "the culmination of a cycle and its accumulated weight",
  Page: "the student or messenger learning a new language",
  Knight: "the force that carries an intention into action",
  Queen: "the mature capacity to hold and understand this domain",
  King: "the responsibility to direct this domain wisely",
};
function interpret(card: CardSelection): string {
  const major = majors[card.card];
  if (major) {
    return `The image of ${major[0]} turns attention toward ${major[1]}. ${card.reversed ? "Reversed, this may be delayed, avoided, or turned inward; examine resistance before moving." : "Upright, it asks for a conscious response."} ${major[2][0].toUpperCase() + major[2].slice(1)}.`;
  }
  const match = /^(Ace|Two|Three|Four|Five|Six|Seven|Eight|Nine|Ten|Page|Knight|Queen|King) of (Wands|Cups|Swords|Pentacles)$/.exec(card.card);
  if (!match) return `The drawn image of ${card.card} asks you to consider its place in the question, without assigning it a meaning that has not been established.`;
  const [, rank, suit] = match;
  const [image, domain] = suitImages[suit];
  return `In ${card.card}, ${image} place the question within ${domain}. The ${rank.toLowerCase()} emphasizes ${ranks[rank]}. ${card.reversed ? "Reversed, consider where this pattern is blocked, overextended, or inwardly resisted." : "Notice where this pattern is actually present rather than assuming an outcome."}`;
}
export function buildTarotFallback(cards: CardSelection[], intention: string): string {
  const sections = cards.map((card) => `In the position of ${card.position.toLowerCase()}, ${interpret(card)}`);
  const question = intention.trim() ? `You asked about “${intention.trim()}.” ` : "";
  return `${question}${sections.join("\n\n")}\n\nRead together, these images do not dictate the future. They ask you to distinguish what is already happening from what you can choose next. Compare the pattern with your actual circumstances, and make the consequential choice with care.`;
}

/** An integrated symbolic reading using the mapped card layers when AI is unreachable.
 * Exact overlap percentages remain in the visible per-card evidence, not repeated
 * in the prose. This does not claim an actual moon position or oracle certainty.
 */
export function buildLunarMansionFallback(cards: CardSelection[], intention: string): string {
  const interpretations = cards.map(({ position, card, reversed }) => {
    const map = getLunarMansionCard(card);
    if (!map) return null;
    const strongestNak = [...map.nakshatras].sort((a,b) => b.sharePercent-a.sharePercent)[0];
    const strongestMan = [...map.manazil].sort((a,b) => b.sharePercent-a.sharePercent)[0];
    const otherNak = map.nakshatras.find(n => n.name !== strongestNak?.name);
    const otherMan = map.manazil.find(n => n.name !== strongestMan?.name);
    const suitLife: Record<string, string> = {
      Wands: "your initiative, purpose, and the courage to move",
      Cups: "your emotional bonds, hopes, and what your heart keeps carrying",
      Swords: "your decisions, language, boundaries, and the truth you must face",
      Pentacles: "your resources, livelihood, obligations, and what you are building",
    };
    const positionMove: Record<string, string> = {
      "The heart of it": "At the center of the matter",
      "What crosses it": "What complicates this",
      "What is beneath": "Beneath what is visible",
      "What is behind": "What you have been moving away from",
      "What is above": "The standard you are reaching toward",
      "What approaches": "The next challenge to prepare for",
      "Your stance": "Your present posture",
      "The field around you": "The people and conditions around you",
      "Hope and fear": "Where longing and fear meet",
      "Where it is leading": "The direction suggested by the final image",
    };
    const lead = positionMove[position] ?? `In ${position.toLowerCase()}`;
    const secondary = [
      otherNak ? `${otherNak.name} adds ${otherNak.traits.charAt(0).toLowerCase() + otherNak.traits.slice(1)}` : "",
      otherMan ? `${otherMan.name} adds ${otherMan.traits.charAt(0).toLowerCase() + otherMan.traits.slice(1)}` : "",
    ].filter(Boolean).join(" ");
    const reversedLine = reversed
      ? "Because this card is reversed, examine where those qualities are delayed, resisted, or turned inward before pressing ahead."
      : "The question is how consciously you can put those qualities into practice, not whether the card guarantees an outcome.";
    const text = `${lead}, ${card} brings ${suitLife[map.suit]} into ${map.sign}'s ${map.element.toLowerCase()}-colored decan, shaped by ${map.planetaryRuler} through ${map.familySign}. ${strongestNak.name} emphasizes ${strongestNak.traits.charAt(0).toLowerCase() + strongestNak.traits.slice(1)} ${strongestMan.name} speaks of ${strongestMan.traits.charAt(0).toLowerCase() + strongestMan.traits.slice(1)} ${secondary} ${reversedLine}`;
    return { map, position, text: text.replace(/\s+/g," ").trim(), nak: strongestNak.name, man: strongestMan.name };
  }).filter((p): p is NonNullable<typeof p> => p !== null);
  if (!interpretations.length) return "No numbered-decan cards were present to interpret.";
  const counts = interpretations.reduce<Record<string,number>>((sum,p)=>{
    sum[p.map.suit]=(sum[p.map.suit]??0)+1; return sum;
  },{});
  const dominant = Object.entries(counts).sort((a,b)=>b[1]-a[1])[0];
  const domain: Record<string,string> = {
    Wands:"initiative and decisive action",
    Cups:"relationships, emotional debts, and attachment",
    Swords:"truth, strategy, and difficult decisions",
    Pentacles:"resources, limits, and lasting responsibilities",
  };
  const first = interpretations[0], last=interpretations[interpretations.length-1];
  // One card is one focused symbol, not a temporal journey from itself to itself.
  if (interpretations.length === 1) {
    const intro = intention.trim() ? `You asked: “${intention.trim()}.”` : `The ${first.map.card} speaks to the matter before you.`;
    const focus = `The core of this card is ${domain[first.map.suit]}. ${first.map.sign}'s ${first.map.element.toLowerCase()}-earth setting and ${first.map.planetaryRuler} as elemental-family ruler shape how that matter asks for attention. ${first.nak} and ${first.man} give its principal lunar-mansion characteristics.`;
    return [intro, focus, first.text, "Consider which part of this pattern is actually present in your situation, and what responsibility or restraint it asks of you."].join("\n\n");
  }
  const theme = `Across these ${interpretations.length} positions, ${dominant[0]} appears most often, placing particular weight on ${domain[dominant[0]]}. The spread begins with ${first.map.planetaryRuler}'s approach through ${first.map.sign} and reaches ${last.map.planetaryRuler}'s approach through ${last.map.sign}. That shift asks you to connect the root issue to the final choice instead of treating each card as a separate prediction.`;
  const closing = `The thread from ${first.nak} and ${first.man} to ${last.nak} and ${last.man} points to a change in emphasis, not a certain future. Check this symbolic account against the real facts of your situation and decide what deserves action, restraint, or release.`;
  const opening = intention.trim() ? `You asked: “${intention.trim()}.”` : "Here is the movement of the whole spread.";
  return [opening, theme, ...interpretations.map(x=>x.text), closing].join("\n\n");
}
