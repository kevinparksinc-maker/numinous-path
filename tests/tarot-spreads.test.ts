import { describe, expect, it, vi } from "vitest";

import { drawCards, TAROT_DECK, TAROT_SPREADS } from "../lib/tarot-spreads";

describe("tarot spread library", () => {
  it("offers multiple layouts from one card through Celtic Cross", () => {
    expect(TAROT_SPREADS.map((spread) => spread.id)).toEqual(expect.arrayContaining([
      "one-card", "three-card", "past-present-future", "relationship", "celtic-cross",
    ]));
    expect(TAROT_SPREADS.find((spread) => spread.id === "celtic-cross")?.positions).toHaveLength(10);
  });

  it("contains the full 78-card Tarot deck and draws cards without duplication", () => {
    expect(TAROT_DECK).toHaveLength(78);
    vi.spyOn(Math, "random").mockReturnValue(0.1);
    const cards = drawCards(5);

    expect(cards).toHaveLength(5);
    expect(new Set(cards).size).toBe(5);
  });
});
