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

/** Full evidence-based lunar-decan reading when the external AI cannot reply. */
export function buildLunarMansionFallback(cards: CardSelection[], intention: string): string {
  const intro = intention.trim() ? `You asked about “${intention.trim()}.” ` : "";
  const parts = cards.map(({position,card,reversed})=>{
    const map = getLunarMansionCard(card);
    if(!map)return `In ${position}, ${card} has no decan correspondence in this 36-card mode.`;
    const naks=map.nakshatras.map(n=>`${n.name} (${n.sharePercent}% of this decan, ${n.ruler}: ${n.traits})`).join("; ");
    const mans=map.manazil.map(m=>`${m.name} (${m.sharePercent}%: ${m.traits})`).join("; ");
    return `In ${position}, ${card} occupies ${map.sign} decan ${map.decan} (${map.longitudeStart}°–${map.longitudeEnd}° of the complete wheel). Its ${map.element} suit expresses the ${map.signRuler}-ruled sign through ${map.familySign}, giving an elemental-family sub-ruler of ${map.planetaryRuler}. The overlapping Vedic Nakshatras are ${naks}. The overlapping Arabic Manazil are ${mans}. ${reversed?"Reversed, these motifs describe friction, delay, or inward work rather than an assured outcome.":"Consider where these combined qualities show up in the situation before you."}`;
  });
  return `${intro}${parts.join("\\n\\n")}\\n\\nRead the positions as one developing matter: the elemental setting describes its arena, the rulers describe how it unfolds, and the lunar mansions give their contrasting characteristics. This symbolic correspondence is not a live astronomical reading or a certain prediction.`;
}
