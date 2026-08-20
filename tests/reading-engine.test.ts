import { describe, expect, it, vi } from "vitest";

import { createPastPresentFutureSpread, createReading } from "../lib/reading-engine";

describe("reading engine", () => {
  it("grounds a tarot reading in its image and carries an appearance-to-truth turn", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.1);
    const reading = createReading("tarot", "A choice I am weighing");

    expect(reading.method).toBe("tarot");
    expect(reading.symbol).toBe("Two of Wands");
    expect(reading.reflection).toContain("stone wall");
    expect(reading.reflection).toContain("globe");
    expect(reading.reflection).toContain("It is not contempt");
    expect(reading.reflection).not.toMatch(/stay present|sit with this|be with what is/i);
  });

  it("adds a discernment guardrail for irreversible-choice wording", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.2);
    const reading = createReading("iching", "Should I make a large investment?");

    expect(reading.method).toBe("iching");
    expect(reading.discernment).toBe(true);
    expect(reading.reflection).toContain("Count its cost");
  });

  it("keeps a past-present-future spread as one visual and covenantal arc", () => {
    const spread = createPastPresentFutureSpread();
    const [past, present, future] = spread.positions;

    expect(past.reflection).toContain("stone wall");
    expect(present.reflection).toContain("full sun");
    expect(future.reflection).toContain("angel’s wings");
    expect(spread.together).toContain("beyond the wall");
    expect(spread.together).toContain("gift or the cost");
  });
});
