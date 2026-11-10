import { describe, expect, it } from "vitest";
import { buildTarotFallback } from "../lib/tarot-fallback";

describe("Tarot card-based fallback", () => {
  it("preserves every position and distinguishes the drawn cards", () => {
    const result = buildTarotFallback([
      { position: "What is known", card: "The Tower", reversed: false },
      { position: "What is hidden", card: "Nine of Cups", reversed: true },
      { position: "What must be done", card: "Ace of Swords", reversed: false },
    ], "How should I proceed?");
    expect(result).toContain("How should I proceed?");
    expect(result).toContain("what is known");
    expect(result).toContain("lightning breaking the crown");
    expect(result).toContain("what is hidden");
    expect(result).toContain("nine");
    expect(result).toContain("Reversed");
    expect(result).toContain("what must be done");
    expect(result).toContain("blades");
  });
  it("handles any full ten-card spread without dropping a card", () => {
    const cards = Array.from({ length: 10 }, (_, i) => ({
      position: `Position ${i + 1}`,
      card: "Two of Wands",
      reversed: i % 2 === 0,
    }));
    const result = buildTarotFallback(cards, "");
    cards.forEach(c => expect(result).toContain(c.position.toLowerCase()));
  });
});
