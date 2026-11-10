/**
 * Numinous Path lunar-mansion Tarot mapping.
 *
 * 36 numbered minors (2–10 of each suit) cover the zodiac exactly once:
 * 36 × 10° = 360°. This uses conventional Tarot decan cards, but uses
 * The Absolute's *elemental-family* decan rulership rather than Chaldean faces.
 * Nakshatras and Manazil overlay by exact interval intersection, never one-to-one
 * assignments. No actual Moon position or live sky calculation is implied.
 *
 * Nakshatra and Manzil themes adapted from the existing Absolute Canon records.
 */
export type LunarCard = {
  card: string;
  suit: string;
  rank: number;
  sign: string;
  signRuler: string;
  element: string;
  decan: number;
  longitudeStart: number;
  longitudeEnd: number;
  planetaryRuler: string;
  familySign: string;
  nakshatras: LunarOverlap[];
  manazil: LunarOverlap[];
};
export type LunarOverlap = {
  name: string;
  from: number;
  to: number;
  sharePercent: number;
  ruler?: string;
  traits: string;
  symbol?: string;
};
export const NAKSHATRA_CANON = [
  {
    "name": "Ashwini",
    "ruler": "Ketu (South Node)",
    "deity": "Ashwini Kumaras (Celestial Physicians)",
    "symbol": "Horse's Head",
    "core": "Swift initiation,vitality, rescue, and pioneering renewal."
  },
  {
    "name": "Bharani",
    "ruler": "Venus",
    "deity": "Yama (Lord of Dharma and Restraint)",
    "symbol": "Yoni (Womb / Vessel of Life)",
    "core": "Gestation, restraint, threshold-crossing, and bearing heavy responsibility."
  },
  {
    "name": "Krittika",
    "ruler": "Sun",
    "deity": "Agni (Sacred Fire)",
    "symbol": "Razor / Flame",
    "core": "Purification, sharp discernment, protective warmth, and cutting away falsehood."
  },
  {
    "name": "Rohini",
    "ruler": "Moon",
    "deity": "Prajapati / Brahma (The Creator)",
    "symbol": "Chariot / Ox Cart",
    "core": "Abundant growth, magnetic beauty, artistic creation, and embodied stability."
  },
  {
    "name": "Mrigashira",
    "ruler": "Mars",
    "deity": "Soma (The Moon / Nectar)",
    "symbol": "Deer's Head",
    "core": "Alert curiosity, searching inquiry, gentle tracking, and intellectual quest."
  },
  {
    "name": "Ardra",
    "ruler": "Rahu (North Node)",
    "deity": "Rudra (The Storm God)",
    "symbol": "Teardrop / Diamond",
    "core": "Cathartic storm, fierce mental honesty, and clarity after emotional release."
  },
  {
    "name": "Punarvasu",
    "ruler": "Jupiter",
    "deity": "Aditi (Mother of the Gods / Boundlessness)",
    "symbol": "Quiver of Arrows / Home",
    "core": "Resilience, safe return, sanctuary, and philosophical renewal after storm."
  },
  {
    "name": "Pushya",
    "ruler": "Saturn",
    "deity": "Brihaspati (Priest/Sage of the Gods)",
    "symbol": "Cow's Udder / Lotus / Arrow",
    "core": "Devoted nourishment, patient stewardship, ethical counsel, and lawful care."
  },
  {
    "name": "Ashlesha",
    "ruler": "Mercury",
    "deity": "Nagas (Serpent Deities of Wisdom)",
    "symbol": "Coiled Serpent",
    "core": "Hypnotic perception, psychological radar,kundalini depth, and strategic protection."
  },
  {
    "name": "Magha",
    "ruler": "Ketu (South Node)",
    "deity": "Pitris (The Ancestors)",
    "symbol": "Royal Throne",
    "core": "Ancestral dignity, sovereign standards, lineage pride, and noble responsibility."
  },
  {
    "name": "Purva Phalguni",
    "ruler": "Venus",
    "deity": "Bhaga (God of Marital Bliss and Prosperity)",
    "symbol": "Front Legs of Marriage Bed / Hammock",
    "core": "Affection, creative leisure, warmth, charisma, and relational bonding."
  },
  {
    "name": "Uttara Phalguni",
    "ruler": "Sun",
    "deity": "Aryaman (God of Patronage, Contracts, and Noble Friendship)",
    "symbol": "Back Legs of Bed",
    "core": "Kept covenants, enduring partnership, patronage, and dependable sovereignty."
  },
  {
    "name": "Hasta",
    "ruler": "Moon",
    "deity": "Savitar (The Sun of Skillful Awakening)",
    "symbol": "Open Hand",
    "core": "Dexterity, craftsmanship, tangible mastery, healing hands, and resourcefulness."
  },
  {
    "name": "Chitra",
    "ruler": "Mars",
    "deity": "Tvashtar / Vishvakarma (Celestial Architect)",
    "symbol": "Shining Jewel / Pearl",
    "core": "Architectural design, aesthetic precision, and cutting rough stone into a jewel."
  },
  {
    "name": "Swati",
    "ruler": "Rahu (North Node)",
    "deity": "Vayu (The Wind)",
    "symbol": "Young Shoot Blown by Wind / Coral",
    "core": "Self-reliant flexibility, diplomacy, trade, and bending without breaking."
  },
  {
    "name": "Vishakha",
    "ruler": "Jupiter",
    "deity": "Indra and Agni (Chief and Sacred Fire)",
    "symbol": "Triumphal Archway / Potter's Wheel",
    "core": "Single-pointed ambition, forked path choosing, and long-term triumph."
  },
  {
    "name": "Anuradha",
    "ruler": "Saturn",
    "deity": "Mitra (God of Friendship and Sacred Covenant)",
    "symbol": "Lotus in Mud / Triumphal Staff",
    "core": "Loyal friendship, bridge-building across divides, and blooming inside intense environments."
  },
  {
    "name": "Jyeshtha",
    "ruler": "Mercury",
    "deity": "Indra (King of the Gods / Protector)",
    "symbol": "Circular Amulet / Umbrella / Earring",
    "core": "Seniority, protective authority, crisis mastery, and carrying the shield for others."
  },
  {
    "name": "Mula",
    "ruler": "Ketu (South Node)",
    "deity": "Nirriti (Goddess of Dissolution and the Root)",
    "symbol": "Tied Bunch of Roots",
    "core": "Root-level investigation, stripping away illusion, and rebuilding from bedrock truth."
  },
  {
    "name": "Purva Ashadha",
    "ruler": "Venus",
    "deity": "Apas (The Cosmic Waters)",
    "symbol": "Winnowing Basket / Elephant Tusk",
    "core": "Undefeated conviction, emotional renewal, and separating wheat from chaff."
  },
  {
    "name": "Uttara Ashadha",
    "ruler": "Sun",
    "deity": "Vishvadevas (All the Universal Principles/Virtues)",
    "symbol": "Elephant Tusk / Small Cot",
    "core": "Enduring integrity, universal duty, alliance for the common good, and mature triumph."
  },
  {
    "name": "Shravana",
    "ruler": "Moon",
    "deity": "Vishnu (The Preserver)",
    "symbol": "Ear / Three Footprints",
    "core": "Deep listening, oral wisdom, counsel, and connecting people to their path."
  },
  {
    "name": "Dhanishta",
    "ruler": "Mars",
    "deity": "Eight Vasus (Deities of Earthly Abundance)",
    "symbol": "Drum / Flute",
    "core": "Rhythmic timing, martial orchestration, resourcefulness, and resonant action."
  },
  {
    "name": "Shatabhisha",
    "ruler": "Rahu (North Node)",
    "deity": "Varuna (Lord of Cosmic Law and Deep Waters)",
    "symbol": "Empty Circle / 100 Physicians / 100 Stars",
    "core": "Radical healing, systemic truth, boundary containment, and confronting hard remedies."
  },
  {
    "name": "Purva Bhadrapada",
    "ruler": "Jupiter",
    "deity": "Aja Ekapada (The One-Footed Goat / Fire of Ascent)",
    "symbol": "Sword / Front Legs of Funeral Cot / Two-Faced Man",
    "core": "Fierce idealism, purifying fire, and standing between worldly life and spiritual vision."
  },
  {
    "name": "Uttara Bhadrapada",
    "ruler": "Saturn",
    "deity": "Ahir Budhnya (Serpent of the Deep Ocean)",
    "symbol": "Back Legs of Cot / Twins in the Deep",
    "core": "Deep stillness, meditative endurance, compassionate wisdom, and emotional anchoring."
  },
  {
    "name": "Revati",
    "ruler": "Mercury",
    "deity": "Pushan (The Nourisher and Guide of Travelers)",
    "symbol": "Pair of Fish / Drum for Timekeeping",
    "core": "Safe guidance, empathy, completion of cycles, and shepherding others across thresholds."
  }
] as const;
export const MANZIL_CANON = [
  {
    "name": "Al-Sharatain",
    "quality": "Mixed / Conditional",
    "themes": [
      "initiation",
      "cutting ties",
      "bold departure"
    ],
    "meaning": "Strong pioneering impulse; acts decisively when a boundary must be crossed, though must guard against impatience."
  },
  {
    "name": "Al-Butain",
    "quality": "Fortunate",
    "themes": [
      "hidden resource",
      "reconciliation",
      "finding support"
    ],
    "meaning": "Quiet resourcefulness and ability to win support or calm tension after an initial disruption."
  },
  {
    "name": "Al-Thurayya",
    "quality": "Fortunate",
    "themes": [
      "abundance",
      "fellowship",
      "craft and study"
    ],
    "meaning": "Relational warmth, love of craft and knowledge, and thriving within a trusted circle."
  },
  {
    "name": "Al-Dabaran",
    "quality": "Unfortunate",
    "themes": [
      "contest",
      "intense friction",
      "integrity under fire"
    ],
    "meaning": "High-intensity drive connected to Royal Star Aldebaran; demands absolute moral integrity when handling conflict."
  },
  {
    "name": "Al-Haq’ah",
    "quality": "Mixed / Conditional",
    "themes": [
      "instruction",
      "travel",
      "patronage"
    ],
    "meaning": "Intellectual clarity, curiosity, and capacity to earn respect through skill and clear speech."
  },
  {
    "name": "Al-Han’ah",
    "quality": "Fortunate",
    "themes": [
      "kinship",
      "alliance",
      "mutual protection"
    ],
    "meaning": "Instinctive loyalty to allies and strong desire for reciprocal, protective bonds."
  },
  {
    "name": "Al-Dhira’",
    "quality": "Fortunate",
    "themes": [
      "gain",
      "friendship",
      "safe passage"
    ],
    "meaning": "Generous reach, diplomatic skill, and ability to turn goodwill into practical opportunity."
  },
  {
    "name": "Al-Nathrah",
    "quality": "Fortunate",
    "themes": [
      "nurture",
      "victory",
      "affection"
    ],
    "meaning": "Protective warmth, strong family/pack instinct, and fierce defense of those in one's care."
  },
  {
    "name": "Al-Tarf",
    "quality": "Unfortunate",
    "themes": [
      "vigilance",
      "caution",
      "boundary defense"
    ],
    "meaning": "Sharp situational awareness and sensitivity to insincerity; learns to set firm boundaries without bitterness."
  },
  {
    "name": "Al-Jabhah",
    "quality": "Fortunate",
    "themes": [
      "sovereignty",
      "healing",
      "enduring alliances"
    ],
    "meaning": "Natural dignity and leadership presence tied to the Lion's brow; thrives when authority is used to strengthen others."
  },
  {
    "name": "Al-Zubrah",
    "quality": "Fortunate",
    "themes": [
      "respect",
      "commerce",
      "rescue"
    ],
    "meaning": "Steadfast pride, protective generosity, and capacity to command respect in public arenas."
  },
  {
    "name": "Al-Sarfah",
    "quality": "Fortunate",
    "themes": [
      "harvest",
      "turning point",
      "betterment"
    ],
    "meaning": "Marks seasonal and personal turning points; skilled at ripening long effort into tangible results."
  },
  {
    "name": "Al-Awwa’",
    "quality": "Fortunate",
    "themes": [
      "benevolence",
      "freedom",
      "union"
    ],
    "meaning": "Persuasive voice, relational discernment, and desire for liberating, honest companionship."
  },
  {
    "name": "Al-Simak",
    "quality": "Fortunate",
    "themes": [
      "grace",
      "artistry",
      "protection"
    ],
    "meaning": "Aligned with Spica's gift: natural talent, refinement, and protection through skill rather than force."
  },
  {
    "name": "Al-Ghafr",
    "quality": "Fortunate",
    "themes": [
      "uncovering hidden value",
      "goodwill",
      "quiet study"
    ],
    "meaning": "Perceptive mind that looks beneath appearances and values quiet, trustworthy alliances."
  },
  {
    "name": "Al-Zubana",
    "quality": "Mixed / Conditional",
    "themes": [
      "redress",
      "liberation",
      "weighing cost"
    ],
    "meaning": "Acute sense of fairness and balance; quick to notice when an exchange has become one-sided."
  },
  {
    "name": "Al-Iklil",
    "quality": "Fortunate",
    "themes": [
      "durable friendship",
      "security",
      "protection"
    ],
    "meaning": "Builds enduring, crisis-tested loyalty; values friends and partners who stand firm under pressure."
  },
  {
    "name": "Al-Qalb",
    "quality": "Mixed / Conditional",
    "themes": [
      "courage",
      "defending against rivalry",
      "deep resolve"
    ],
    "meaning": "Aligned with Royal Star Antares: intense passion, strategic focus, and the need to channel intensity into noble purpose rather than obsession."
  },
  {
    "name": "Al-Shaula",
    "quality": "Mixed / Conditional",
    "themes": [
      "decisive strike",
      "completing difficult work",
      "harvest"
    ],
    "meaning": "Incisive honesty and willingness to name what others avoid; potent capacity for breakthrough when disciplined."
  },
  {
    "name": "Al-Na’am",
    "quality": "Fortunate",
    "themes": [
      "taming wildness",
      "swift journey",
      "fellowship"
    ],
    "meaning": "Combines adventurous reach with practical discipline that brings big ambitions home."
  },
  {
    "name": "Al-Baldah",
    "quality": "Mixed / Conditional",
    "themes": [
      "solitude",
      "structural completion",
      "sobriety"
    ],
    "meaning": "Self-contained realism; comfortable standing in empty or uncharted space to build something lasting."
  },
  {
    "name": "Sa’d al-Dhabih",
    "quality": "Mixed / Conditional",
    "themes": [
      "sacrifice for freedom",
      "healing",
      "escape from constraint"
    ],
    "meaning": "Willingness to make a hard, clean sacrifice in order to preserve integrity and freedom."
  },
  {
    "name": "Sa’d Bula’",
    "quality": "Mixed / Conditional",
    "themes": [
      "absorption",
      "healing",
      "release"
    ],
    "meaning": "Capacity to digest difficult experience and metabolize pressure into quiet wisdom."
  },
  {
    "name": "Sa’d al-Su’ud",
    "quality": "Fortunate",
    "themes": [
      "auspicious growth",
      "harmony",
      "vitality"
    ],
    "meaning": "Restorative warmth, steady hope, and ability to bring renewal after a long winter."
  },
  {
    "name": "Sa’d al-Akhbiya",
    "quality": "Fortunate",
    "themes": [
      "shelter",
      "emerging life",
      "protection"
    ],
    "meaning": "Nurtures fledgling ideas and people in private shelter until they are strong enough to emerge."
  },
  {
    "name": "Al-Fargh al-Muqaddam",
    "quality": "Fortunate",
    "themes": [
      "union",
      "affection",
      "safe deliverance"
    ],
    "meaning": "Generous outpouring of goodwill, creativity, and capacity to unite disparate people."
  },
  {
    "name": "Al-Fargh al-Mu’akhkhar",
    "quality": "Mixed / Conditional",
    "themes": [
      "increase of trade",
      "harvest",
      "fluidity"
    ],
    "meaning": "Adaptable resourcefulness; must keep commitments anchored so energy does not spill outward."
  },
  {
    "name": "Al-Risha/Batn al-Hut",
    "quality": "Fortunate",
    "themes": [
      "tying the knot",
      "safe return",
      "synthesis"
    ],
    "meaning": "Completes the 28-mansion circle by tying together loose threads into enduring meaning and safe harbor."
  }
] as const;
const SIGNS = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"] as const;
const SIGN_RULERS: Record<string,string> = {Aries:"Mars",Taurus:"Venus",Gemini:"Mercury",Cancer:"Moon",Leo:"Sun",Virgo:"Mercury",Libra:"Venus",Scorpio:"Mars",Sagittarius:"Jupiter",Capricorn:"Saturn",Aquarius:"Saturn",Pisces:"Jupiter"};
const SIGN_ELEMENTS: Record<string,string> = {Aries:"Fire",Leo:"Fire",Sagittarius:"Fire",Taurus:"Earth",Virgo:"Earth",Capricorn:"Earth",Gemini:"Air",Libra:"Air",Aquarius:"Air",Cancer:"Water",Scorpio:"Water",Pisces:"Water"};
// Numbered minor arcana follow the traditional 36-card Tarot decan sequence.
const SUIT_SIGNS: Record<string, readonly string[]> = {
  Wands:["Aries","Leo","Sagittarius"],
  Cups:["Cancer","Scorpio","Pisces"],
  Swords:["Libra","Aquarius","Gemini"],
  Pentacles:["Capricorn","Taurus","Virgo"],
};
export const LUNAR_MANSION_DECK = Object.entries(SUIT_SIGNS).flatMap(([suit,signs])=>
  Array.from({length:9},(_,i)=>`${["Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten"][i]} of ${suit}`));
function overlapping<T extends {name:string}>(items: readonly T[], divisor: number, start:number, end:number, traits:(item:T)=>string, ruler?:(item:T)=>string, symbol?:(item:T)=>string): LunarOverlap[] {
  return items.flatMap((item,i)=>{
    const from=Math.max(start,i*360/divisor);
    const to=Math.min(end,(i+1)*360/divisor);
    return to-from>0.000001 ? [{name:item.name,from:Number(from.toFixed(4)),to:Number(to.toFixed(4)),sharePercent:Number(((to-from)*10).toFixed(2)),traits:traits(item),...(ruler?{ruler:ruler(item)}:{}),...(symbol?{symbol:symbol(item)}:{})}] : [];
  });
}
export function getLunarMansionCard(card:string): LunarCard | null {
  const found=/^(Two|Three|Four|Five|Six|Seven|Eight|Nine|Ten) of (Wands|Cups|Swords|Pentacles)$/.exec(card);
  if(!found)return null;
  const rank=["Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten"].indexOf(found[1])+2;
  const suit=found[2], slot=rank-2;
  const sign=SUIT_SIGNS[suit][Math.floor(slot/3)];
  const decan=slot%3+1;
  const start=SIGNS.indexOf(sign as typeof SIGNS[number])*30+(decan-1)*10;
  const element=SIGN_ELEMENTS[sign];
  const family=SIGNS.filter(s=>SIGN_ELEMENTS[s]===element);
  // The Absolute's configured elemental-family decans advance through the
  // three same-element signs starting at the sign under consideration.
  const idx=family.indexOf(sign as typeof SIGNS[number]);
  const familySign=family[(idx+decan-1)%3];
  const end=start+10;
  return {
    card,suit,rank,sign,signRuler:SIGN_RULERS[sign],element,
    decan,longitudeStart:start,longitudeEnd:end,
    planetaryRuler:SIGN_RULERS[familySign],familySign,
    nakshatras:overlapping(NAKSHATRA_CANON,27,start,end,x=>x.core,x=>x.ruler,x=>x.symbol),
    manazil:overlapping(MANZIL_CANON,28,start,end,x=>x.meaning),
  };
}
export function lunarMansionContext(card:string):string {
  const record=getLunarMansionCard(card);
  if(!record)return `${card}: no numbered-minor decan mapping`;
  const degree=(n:number)=>`${n%30}° ${SIGNS[Math.floor(n/30)]??"Pisces"}`;
  return `${card} — ${record.sign} decan ${record.decan} (${degree(record.longitudeStart)}–${record.longitudeEnd%30===0?"30° "+record.sign:degree(record.longitudeEnd)}), ${record.element} suit. Sign ruler: ${record.signRuler}; elemental family: ${record.familySign}; elemental-family decan ruler: ${record.planetaryRuler}. Nakshatra overlays: ${record.nakshatras.map(n=>`${n.name} (${n.sharePercent}% of card; ${n.ruler}; ${n.traits})`).join("; ")}. Arabic Manzil overlays: ${record.manazil.map(m=>`${m.name} (${m.sharePercent}% of card; ${m.traits})`).join("; ")}.`;
}
