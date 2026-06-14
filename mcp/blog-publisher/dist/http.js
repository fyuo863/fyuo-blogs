import { randomUUID } from "node:crypto";
import { createMcpExpressApp } from "@modelcontextprotocol/sdk/server/express.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { loadConfig } from "./config.js";
import { createBlogPublisherServer } from "./server.js";
export async function startHttpServer() {
    const config = loadConfig();
    const app = createMcpExpressApp({ host: config.host });
    const transports = new Map();
    app.all(config.mcpPath, async (req, res) => {
        if (req.method === "OPTIONS") {
            res.status(204).end();
            return;
        }
        const apiKey = resolveRequestApiKey(req);
        if (!apiKey) {
            res.status(401).json({
                error: "Missing API key. Provide X-Blog-Api-Key or Authorization: Bearer <key>.",
            });
            return;
        }
        const sessionId = resolveSessionId(req);
        let transport = sessionId ? transports.get(sessionId) : undefined;
        if (!transport) {
            if (sessionId) {
                res.status(404).json({
                    jsonrpc: "2.0",
                    error: {
                        code: -32000,
                        message: `Session not found: ${sessionId}`,
                    },
                    id: null,
                });
                return;
            }
            if (req.method !== "POST") {
                res.status(400).json({
                    jsonrpc: "2.0",
                    error: {
                        code: -32000,
                        message: "Session not initialized. Send the first request as POST JSON-RPC.",
                    },
                    id: null,
                });
                return;
            }
            const server = createBlogPublisherServer(config, { apiKey });
            transport = new StreamableHTTPServerTransport({
                sessionIdGenerator: () => randomUUID(),
                onsessioninitialized: (id) => {
                    transports.set(id, transport);
                },
            });
            const cleanup = async () => {
                const activeId = transport?.sessionId;
                if (activeId) {
                    transports.delete(activeId);
                }
                await transport?.close();
                await server.close();
            };
            res.on("close", () => {
                void cleanup();
            });
            await server.connect(transport);
        }
        try {
            await transport.handleRequest(req, res, req.body);
        }
        catch (error) {
            console.error("blog-publisher MCP request failed:", error);
            if (!res.headersSent) {
                res.status(400).json({
                    jsonrpc: "2.0",
                    error: {
                        code: -32700,
                        message: error instanceof Error ? error.message : "Invalid JSON",
                    },
                    id: null,
                });
            }
        }
    });
    app.get("/healthz", (_req, res) => {
        res.status(200).json({ status: "ok", transport: "streamable-http" });
    });
    app.listen(config.port, config.host, () => {
        console.log(`blog-publisher MCP HTTP listening on http://${config.host}:${config.port}${config.mcpPath}`);
    });
}
function resolveRequestApiKey(req) {
    const headerValue = req.header?.("x-blog-api-key") ||
        req.header?.("X-Blog-Api-Key") ||
        req.headers?.["x-blog-api-key"];
    if (typeof headerValue === "string" && headerValue.trim()) {
        return headerValue.trim();
    }
    const authHeader = req.header?.("authorization") ||
        req.header?.("Authorization") ||
        req.headers?.authorization;
    if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
        return authHeader.slice("Bearer ".length).trim();
    }
    return "";
}
function resolveSessionId(req) {
    const headerValue = req.header?.("mcp-session-id") ||
        req.header?.("Mcp-Session-Id") ||
        req.header?.("MCP-Session-Id") ||
        req.headers?.["mcp-session-id"];
    if (typeof headerValue === "string" && headerValue.trim()) {
        return headerValue.trim();
    }
    return "";
}
startHttpServer().catch((error) => {
    console.error("blog-publisher MCP HTTP failed:", error);
    process.exit(1);
});
