import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { invokeLLM } from "./_core/llm";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { buildCompanionPrompt } from "./companion-prompt";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

const activeReadingSchema = z.object({
  id: z.string().min(1),
  createdAt: z.string().min(1),
  method: z.enum(["tarot", "iching", "lunar"]),
  spreadName: z.string().min(1).max(120),
  intention: z.string().max(1200),
  cards: z.array(z.object({
    position: z.string().min(1).max(120),
    card: z.string().min(1).max(120),
    reversed: z.boolean(),
  })).min(1).max(10),
  initialReading: z.string().max(9000),
});

const companionMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(3000),
});

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  companion: router({
    reply: publicProcedure
      .input(z.object({
        reading: activeReadingSchema,
        messages: z.array(companionMessageSchema).min(1).max(12),
      }))
      .mutation(async ({ input }) => {
        try {
          const response = await invokeLLM({
            model: process.env.GROQ_API_KEY ? (process.env.GROQ_MODEL || "openai/gpt-oss-120b") : "claude-sonnet-4-6",
            maxTokens: input.reading.method === "lunar" ? 2400 : 850,
            messages: [
              { role: "system", content: buildCompanionPrompt(input.reading) },
              ...input.messages.slice(-12),
            ],
          });
          const content = response.choices[0]?.message?.content;
          const message = typeof content === "string" ? content.trim() : "";
          if (!message) throw new Error("GROQ_EMPTY_RESPONSE: No text returned.");
          return { message };
        } catch (error) {
          // Never return raw provider error bodies or request data.
          const detail = error instanceof Error ? error.message : "";
          const code =
            detail.includes("GROQ_NOT_CONFIGURED") || detail.includes("not configured") ? "AI_NOT_CONFIGURED" :
            detail.includes("GROQ_AUTH_FAILED") ? "AI_AUTH_FAILED" :
            detail.includes("GROQ_RATE_LIMITED") ? "AI_RATE_LIMITED" :
            detail.includes("GROQ_TIMEOUT") ? "AI_TIMEOUT" :
            detail.includes("GROQ_EMPTY_RESPONSE") ? "AI_EMPTY_RESPONSE" :
            "AI_PROVIDER_ERROR";
          console.warn("[Companion] AI provider failure:", code);
          const userMessages: Record<string,string> = {
            AI_NOT_CONFIGURED: "AI_NOT_CONFIGURED: Numinous Path needs GROQ_API_KEY in Render environment settings.",
            AI_AUTH_FAILED: "AI_AUTH_FAILED: The Groq API key was rejected. Check the key in Render.",
            AI_RATE_LIMITED: "AI_RATE_LIMITED: Groq's usage limit was reached. Please retry later.",
            AI_TIMEOUT: "AI_TIMEOUT: Groq took too long. Your reading remains saved.",
            AI_EMPTY_RESPONSE: "AI_EMPTY_RESPONSE: Groq returned no reading text. Please retry.",
            AI_PROVIDER_ERROR: "AI_PROVIDER_ERROR: The AI service could not complete this request. Check the Render logs.",
          };
          throw new TRPCError({ code: "SERVICE_UNAVAILABLE", message: userMessages[code] });
        }
      }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
