import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { groqEnv } = vi.hoisted(() => ({
  groqEnv: {
    groqApiKey: "test-secret",
    groqModel: "openai/gpt-oss-120b",
    aiPrimaryProvider: "groq",
    forgeApiKey: "",
    forgeApiUrl: "",
  },
}));
vi.mock("../server/_core/env", () => ({ ENV: groqEnv }));
import { invokeLLM } from "../server/_core/llm";

describe("Numinous Path Groq companion", () => {
  beforeEach(() => {
    groqEnv.groqApiKey = "test-secret";
    groqEnv.aiPrimaryProvider = "groq";
  });
  afterEach(() => vi.unstubAllGlobals());

  it("sends the reading context to the secure Groq server endpoint", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        id: "chat-1", created: 0, model: "openai/gpt-oss-120b",
        choices: [{ index: 0, message: { role: "assistant", content: "The Sun marks clarity." }, finish_reason: "stop" }],
      }),
    });
    vi.stubGlobal("fetch", fetchMock);
    const result = await invokeLLM({
      model: "claude-sonnet-4-6",
      messages: [{ role: "system", content: "Read these divination cards." }, { role: "user", content: "What does this mean?" }],
      maxTokens: 850,
    });
    expect(result.choices[0].message.content).toBe("The Sun marks clarity.");
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.groq.com/openai/v1/chat/completions");
    expect(options.headers.authorization).toBe("Bearer test-secret");
    expect(JSON.parse(options.body)).toMatchObject({
      model: "openai/gpt-oss-120b",
      max_tokens: 850,
      messages: [{ role: "system", content: "Read these divination cards." }, { role: "user", content: "What does this mean?" }],
    });
  });

  it("fails clearly without a Groq API key rather than silently choosing another provider", async () => {
    groqEnv.groqApiKey = "";
    await expect(invokeLLM({ messages: [{ role: "user", content: "Hello" }] })).rejects.toThrow("GROQ_NOT_CONFIGURED");
  });

  it("does not leak provider response bodies on rate limits", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 429, text: async () => "PRIVATE READING" }));
    await expect(invokeLLM({ messages: [{ role: "user", content: "What does this mean?" }] })).rejects.toThrow("GROQ_RATE_LIMITED");
  });
});
