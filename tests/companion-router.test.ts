import { beforeEach, describe, expect, it, vi } from "vitest";

const { invokeLLM } = vi.hoisted(() => ({ invokeLLM: vi.fn() }));

vi.mock("../server/_core/llm", () => ({ invokeLLM }));

import { appRouter } from "../server/routers";

const reading = {
  id: "reading-1",
  createdAt: "2026-08-20T00:00:00.000Z",
  method: "tarot" as const,
  spreadName: "Past · Present · Future",
  intention: "What should I understand about this choice?",
  cards: [
    { position: "Past", card: "Two of Wands", reversed: false },
    { position: "Present", card: "The Sun", reversed: false },
    { position: "Future", card: "The Lovers", reversed: false },
  ],
  initialReading: "A prior reading.",
};

describe("companion router", () => {
  beforeEach(() => {
    invokeLLM.mockReset();
  });

  it("passes the active spread and recent conversation to the server-side model", async () => {
    invokeLLM.mockResolvedValue({ choices: [{ message: { content: "I have set the three images before you." } }] });
    const caller = appRouter.createCaller({ user: null, req: {} as never, res: {} as never });

    const result = await caller.companion.reply({
      reading,
      messages: [{ role: "user", content: "What does the choice ask of me?" }],
    });

    expect(result.message).toBe("I have set the three images before you.");
    expect(invokeLLM).toHaveBeenCalledWith(expect.objectContaining({
      model: "claude-sonnet-4-6",
      messages: expect.arrayContaining([
        expect.objectContaining({ role: "system", content: expect.stringContaining("Two of Wands") }),
        expect.objectContaining({ role: "user", content: "What does the choice ask of me?" }),
      ]),
    }));
  });
});
