import { describe, expect, it } from "vitest";
import { LUNAR_MANSION_DECK, getLunarMansionCard, lunarMansionContext, NAKSHATRA_CANON, MANZIL_CANON } from "../shared/lunar-mansion";
import { buildLunarMansionFallback } from "../lib/tarot-fallback";
import { buildCompanionPrompt } from "../server/companion-prompt";

describe("Lunar Mansion 36-decan mode", () => {
  it("maps 36 unique numbered minor cards onto the complete 360-degree zodiac", () => {
    expect(LUNAR_MANSION_DECK).toHaveLength(36);
    const cards = LUNAR_MANSION_DECK.map(name => getLunarMansionCard(name)!);
    expect(cards.every(Boolean)).toBe(true);
    const sorted = cards.sort((a,b) => a.longitudeStart-b.longitudeStart);
    for (let i=0;i<36;i++) {
      expect(sorted[i].longitudeStart).toBe(i*10);
      expect(sorted[i].longitudeEnd).toBe((i+1)*10);
      expect(sorted[i].planetaryRuler).toBeTruthy();
      expect(sorted[i].signRuler).toBeTruthy();
      expect(sorted[i].nakshatras.length).toBeGreaterThan(0);
      expect(sorted[i].manazil.length).toBeGreaterThan(0);
      expect(sorted[i].nakshatras.reduce((sum, m)=>sum+m.sharePercent,0)).toBeCloseTo(100,1);
      expect(sorted[i].manazil.reduce((sum, m)=>sum+m.sharePercent,0)).toBeCloseTo(100,1);
    }
  });
  it("preserves traditional Tarot decan suit-sign sequence and both mansion boundary overlaps", () => {
    expect(getLunarMansionCard("Two of Wands")).toMatchObject({sign:"Aries",decan:1,longitudeStart:0,planetaryRuler:"Mars"});
    expect(getLunarMansionCard("Five of Swords")).toMatchObject({sign:"Aquarius",decan:1,longitudeStart:300});
    expect(getLunarMansionCard("Ten of Pentacles")).toMatchObject({sign:"Virgo",decan:3,longitudeStart:170});
    expect(getLunarMansionCard("Ace of Cups")).toBeNull();
    expect(getLunarMansionCard("The Star")).toBeNull();
    expect(NAKSHATRA_CANON).toHaveLength(27);
    expect(MANZIL_CANON).toHaveLength(28);
    const card = getLunarMansionCard("Three of Wands")!;
    expect(card.nakshatras.length).toBe(2);
    expect(lunarMansionContext("Three of Wands")).toContain("Ashwini");
    expect(lunarMansionContext("Three of Wands")).toContain("Bharani");
  });
  it("passes decan ruler and both mansion traits to Groq and fallback", () => {
    const cards = [{position:"The matter",card:"Three of Wands",reversed:false}];
    const reading = {id:"a",createdAt:"2026-11-10",method:"lunar" as const,spreadName:"One Card",intention:"What is changing?",cards,initialReading:""};
    const prompt = buildCompanionPrompt(reading);
    expect(prompt).toContain("LUNAR MANSION READING");
    expect(prompt).toContain("Bharani");
    expect(prompt).toContain("Manzil overlays");
    const result = buildLunarMansionFallback(cards,reading.intention);
    expect(result).toContain("Ashwini");
    expect(result).toContain("Al-Butain");
    expect(result).toContain("decan");
  });
});
