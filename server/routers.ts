import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { invokeLLM } from "./_core/llm";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { buildCompanionPrompt } from "./companion-prompt";
import { z } from "zod";

const activeReadingSchema = z.object({
  id: z.string().min(1),
  createdAt: z.string().min(1),
  method: z.enum(["tarot", "iching"]),
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
        const response = await invokeLLM({
          model: "claude-sonnet-4-6",
          maxTokens: 850,
          messages: [
            { role: "system", content: buildCompanionPrompt(input.reading) },
            ...input.messages.slice(-12),
          ],
        });
        const content = response.choices[0]?.message?.content;
        const message = typeof content === "string" ? content.trim() : "";
        if (!message) throw new Error("The companion did not return a response.");
        return { message };
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
