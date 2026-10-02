import { createHash, randomUUID } from "node:crypto";
import { pathToFileURL } from "node:url";
import { createMcpExpressApp } from "@modelcontextprotocol/sdk/server/express.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { loadConfig, type BlogPublisherConfig } from "./config.js";
import { createBlogPublisherServer } from "./server.js";

export function createHttpApp(config: BlogPublisherConfig, limits = { sessions: 128, idleMs: 900_000 }) {
  const app = createMcpExpressApp({ host: config.host });
  type Session = { fingerprint: string; touched: number; transport: StreamableHTTPServerTransport; server: ReturnType<typeof createBlogPublisherServer> };
  const sessions = new Map<string, Session>();
  let pending = 0;
  async function remove(id: string) {
    const session = sessions.get(id);
    sessions.delete(id);
    if (session) await session.server.close().catch(() => {});
  }
  const timer = setInterval(() => {
    for (const [id, s] of sessions) if (Date.now() - s.touched >= limits.idleMs) void remove(id);
  }, Math.min(limits.idleMs, 30_000));
  timer.unref();

  app.all(config.mcpPath, async (req, res) => {
    if (req.method === "OPTIONS") { res.sendStatus(204); return; }
    const key = resolveRequestApiKey(req);
    if (!key || key.length > 512) { res.sendStatus(401); return; }
    const id = resolveSessionId(req);
    const fingerprint = createHash("sha256").update(key).digest("hex");
    let session = sessions.get(id);
    if (session && session.fingerprint !== fingerprint) { res.sendStatus(403); return; }
    if (session && Date.now() - session.touched >= limits.idleMs) {
      await remove(id); session = undefined;
    }
    // No positive cache: revocation must apply to POST, GET and DELETE alike.
    try {
      const auth = await fetch(`${config.baseUrl.replace(/\/$/, "")}/api/v1/auth/verify`, {
        headers: { "X-API-Key": key }, redirect: "error", signal: AbortSignal.timeout(config.timeoutMs),
      });
      await auth.body?.cancel();
      if (auth.status !== 204) {
        if (auth.status === 401 || auth.status === 403) { await remove(id); res.sendStatus(401); }
        else res.sendStatus(503);
        return;
      }
    } catch { res.sendStatus(503); return; }
    if (id && !session) { res.sendStatus(404); return; }
    let created = false;
    try {
      if (!session) {
        if (req.method !== "POST" || !isInitializeRequest(req.body)) { res.sendStatus(400); return; }
        if (sessions.size + pending >= limits.sessions) { res.setHeader("Retry-After", "30"); res.sendStatus(429); return; }
        pending++;
        created = true;
        const server = createBlogPublisherServer(config, { apiKey: key });
        const transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: randomUUID,
          onsessioninitialized: (sessionId) => { sessions.set(sessionId, session!); },
        });
        session = { fingerprint, touched: Date.now(), transport, server };
        await server.connect(transport);
        // Install after connect, which supplies its own onclose callback.
        const onclose = transport.onclose;
        transport.onclose = () => { if (transport.sessionId) sessions.delete(transport.sessionId); onclose?.(); };
      }
      session.touched = Date.now();
      await session.transport.handleRequest(req, res, req.body);
    } catch {
      if (created && session?.transport.sessionId) await remove(session.transport.sessionId);
      if (!res.headersSent) res.sendStatus(500);
    } finally {
      if (created) {
        pending--;
        if (!session?.transport.sessionId) await session?.server.close().catch(() => {});
      }
    }
  });
  app.get("/healthz", (_req, res) => { res.json({ status: "ok" }); });
  return { app, close: async () => { clearInterval(timer); await Promise.all([...sessions.keys()].map(remove)); } };
}
export async function startHttpServer() {
  const config = loadConfig();
  const { app, close } = createHttpApp(config);
  const listener = app.listen(config.port, config.host);
  listener.on("close", () => { void close(); });
  return listener;
}

function resolveRequestApiKey(req: any): string {
  const headerValue =
    req.header?.("x-blog-api-key") ||
    req.header?.("X-Blog-Api-Key") ||
    req.headers?.["x-blog-api-key"];
  if (typeof headerValue === "string" && headerValue.trim()) {
    return headerValue.trim();
  }

  const authHeader =
    req.header?.("authorization") ||
    req.header?.("Authorization") ||
    req.headers?.authorization;
  if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length).trim();
  }

  return "";
}

function resolveSessionId(req: any): string {
  const headerValue =
    req.header?.("mcp-session-id") ||
    req.header?.("Mcp-Session-Id") ||
    req.header?.("MCP-Session-Id") ||
    req.headers?.["mcp-session-id"];
  if (typeof headerValue === "string" && headerValue.trim()) {
    return headerValue.trim();
  }
  return "";
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  startHttpServer().catch(() => { console.error("MCP startup failed"); process.exit(1); });
}
