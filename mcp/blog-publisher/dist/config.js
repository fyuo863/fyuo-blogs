export function loadConfig() {
    return {
        baseUrl: process.env.BLOG_BASE_URL?.trim() || "http://localhost:18080",
        apiKey: process.env.BLOG_API_KEY?.trim() || undefined,
        timeoutMs: Number(process.env.BLOG_TIMEOUT_MS || 10000),
        defaultStage: process.env.BLOG_DEFAULT_STAGE?.trim() || "published",
        host: process.env.MCP_HOST?.trim() || "0.0.0.0",
        port: Number(process.env.MCP_PORT || 18081),
        mcpPath: process.env.MCP_PATH?.trim() || "/mcp",
    };
}
