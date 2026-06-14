import { randomUUID } from "node:crypto";
import { createMcpExpressApp } from "@modelcontextprotocol/sdk/server/express.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { loadConfig } from "./config.js";
import { createBlogPublisherServer } from "./server.js";

export async function startHttpServer() {
  const config = loadConfig();
  const app = createMcpExpressApp({ host: config.host });

  app.all(config.mcpPath, async (req: any, res: any) => {
    const apiKey = resolveRequestApiKey(req);
    if (!apiKey) {
      res.status(401).json({
        error: "Missing API key. Provide X-Blog-Api-Key or Authorization: Bearer <key>.",
      });
      return;
    }
    const server = createBlogPublisherServer(config, { apiKey });
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
    });

    res.on("close", () => {
      void transport.close();
      void server.close();
    });

    await server.connect(transport);
    await transport.handleRequest(req, res);
  });

  app.get("/healthz", (_req: any, res: any) => {
    res.status(200).json({ status: "ok", transport: "streamable-http" });
  });

  app.listen(config.port, config.host, () => {
    console.log(
      `blog-publisher MCP HTTP listening on http://${config.host}:${config.port}${config.mcpPath}`,
    );
  });
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

startHttpServer().catch((error) => {
  console.error("blog-publisher MCP HTTP failed:", error);
  process.exit(1);
});
