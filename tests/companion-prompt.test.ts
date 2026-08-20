import { describe, expect, it } from "vitest";

import { buildCompanionPrompt } from "../server/companion-prompt";

describe("companion prompt", () => {
  it("preserves card positions, concrete grounding, and high-stakes discernment", () => {
    const prompt = buildCompanionPrompt({
      id: "reading-1",
      createdAt: "2026-08-20T00:00:00.000Z",
      method: "tarot",
      spreadName: "Past · Present · Future",
      intention: "Should I make a large investment?",
      cards: [
        { position: "Past", card: "Two of Wands", reversed: false },
        { position: "Present", card: "The Sun", reversed: false },
        { position: "Future", card: "The Lovers", reversed: false },
      ],
      initialReading: "A test reading.",
    });

    expect(prompt).toContain("Two of Wands");
    expect(prompt).toContain("Speak in first person as the God of the Bible");
    expect(prompt).toContain("concrete detail");
    expect(prompt).toContain("irreversible");
  });
});

