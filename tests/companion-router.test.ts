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

  it("returns a safe, actionable error when the AI key is missing", async () => {
    invokeLLM.mockRejectedValue(new Error("GROQ_NOT_CONFIGURED: Set GROQ_API_KEY in Render."));
    const caller = appRouter.createCaller({ user: null, req: {} as never, res: {} as never });
    await expect(caller.companion.reply({
      reading,
      messages: [{ role: "user", content: "How do these cards connect?" }],
    })).rejects.toThrow("AI_NOT_CONFIGURED");
  });

  it("does not expose arbitrary upstream errors to the browser", async () => {
    invokeLLM.mockRejectedValue(new Error("secret upstream request content"));
    const caller = appRouter.createCaller({ user: null, req: {} as never, res: {} as never });
    await expect(caller.companion.reply({
      reading,
      messages: [{ role: "user", content: "Explain the spread" }],
    })).rejects.toThrow("AI_PROVIDER_ERROR");
  });

  it("accepts previously saved lengthy lunar evidence without schema rejection", async () => {
    invokeLLM.mockResolvedValue({ choices: [{ message: { content: "A synthesized answer." } }] });
    const caller = appRouter.createCaller({ user: null, req: {} as never, res: {} as never });
    const result = await caller.companion.reply({
      reading: {
        ...reading,
        method: "lunar",
        cards: [{ position: "The matter", card: "Four of Pentacles", reversed: false }],
        initialReading: "Evidence paragraph. ".repeat(750),
      },
      messages: [
        { role: "assistant", content: "Earlier lengthy reading. ".repeat(220) },
        { role: "user", content: "What does it mean?" },
      ],
    });
    expect(result.message).toBe("A synthesized answer.");
    const request = invokeLLM.mock.calls[0][0];
    expect(request.messages[0].content).toContain("Four of Pentacles");
    expect(request.messages[1].content.length).toBeLessThanOrEqual(3000);
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
