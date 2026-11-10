import "dotenv/config";
import express from "express";
import path from "node:path";
import { createServer } from "http";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";

/**
 * Non-mutating startup diagnostics. Only safe status codes are logged.
 * A GET to Groq's models endpoint verifies connectivity and authentication
 * without generating text or publishing the configured key.
 */
async function verifyGroqAtStartup(): Promise<void> {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  const model = process.env.GROQ_MODEL?.trim() || "openai/gpt-oss-120b";
  if (!apiKey) {
    console.warn("[Groq status] NOT_CONFIGURED: GROQ_API_KEY is absent from Numinous Path's Render environment.");
    return;
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch("https://api.groq.com/openai/v1/models", {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: controller.signal,
    });
    if (response.status === 401 || response.status === 403) {
      console.warn("[Groq status] AUTH_REJECTED: the configured key cannot authenticate.");
      return;
    }
    if (!response.ok) {
      console.warn(`[Groq status] PROVIDER_HTTP_${response.status}: model availability not verified.`);
      return;
    }
    const data = await response.json() as { data?: Array<{ id?: string }> };
    const hasModel = data.data?.some(item => item.id === model);
    console.info(hasModel
      ? "[Groq status] READY: credentials accepted and configured model is available."
      : "[Groq status] MODEL_UNAVAILABLE: credentials accepted, configured model not in accessible list.");
    if (hasModel) {
      // A single tiny generation probe verifies inference, not merely /models.
      // Never log the prompt, token, response body, or sensitive reading data.
      const probeController = new AbortController();
      const probeTimer = setTimeout(() => probeController.abort(), 25000);
      try {
        const result = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            model,
            messages: [{role:"user",content:"Reply with the word OK."}],
            max_completion_tokens: 128,
            stream: false,
          }),
          signal: probeController.signal,
        });
        console.info(result.ok
          ? "[Groq inference] READY: chat completions endpoint accepted a generation request."
          : `[Groq inference] HTTP_${result.status}: chat completions request rejected.`);
        await result.body?.cancel();
      } catch {
        console.warn("[Groq inference] NETWORK_OR_TIMEOUT: chat completion probe unsuccessful.");
      } finally {
        clearTimeout(probeTimer);
      }
    }
  } catch {
    console.warn("[Groq status] NETWORK_OR_TIMEOUT: could not contact Groq at startup.");
  } finally {
    clearTimeout(timeout);
  }
}

async function startServer() {
  const app = express();
  
  const server = createServer(app);

  // Enable CORS for all routes - reflect the request origin to support credentials
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
      res.header("Access-Control-Allow-Origin", origin);
    }
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    );
    res.header("Access-Control-Allow-Credentials", "true");

    // Handle preflight requests
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
      return;
    }
    next();
  });

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  registerStorageProxy(app);
  registerOAuthRoutes(app);

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, timestamp: Date.now() });
  });

  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
  );

  // Serve the Expo web export after API routes, so /api/* remains a backend
  // route while browser navigation is served from the static web build.
  const webBuildPath = path.resolve(process.cwd(), "dist/web");
  app.use(express.static(webBuildPath));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) {
      return next();
    }

    res.sendFile(path.join(webBuildPath, "index.html"), (error) => {
      if (error) next(error);
    });
  });

  // FIXED PORT LOGIC: Use Railway's PORT and listen on 0.0.0.0
  const port = parseInt(process.env.PORT || "3000");

  server.listen(port, '0.0.0.0', () => {
    console.log(`[api] server listening on port ${port}`);
    void verifyGroqAtStartup();
  });
}

startServer().catch(console.error);
