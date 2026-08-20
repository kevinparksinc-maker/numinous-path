import { describe, expect, it, vi } from "vitest";

import { createReading } from "../lib/reading-engine";

describe("reading engine", () => {
  it("creates a coherent tarot reading with an invitation", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.1);
    const reading = createReading("tarot", "A choice I am weighing");

    expect(reading.method).toBe("tarot");
    expect(reading.reflection).toContain("I");
    expect(reading.reflection.length).toBeGreaterThan(130);
    expect(reading.symbol).toBeTruthy();
  });

  it("adds a discernment guardrail for irreversible-choice wording", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.2);
    const reading = createReading("iching", "Should I make a large investment?");

    expect(reading.method).toBe("iching");
    expect(reading.discernment).toBe(true);
  });
});
