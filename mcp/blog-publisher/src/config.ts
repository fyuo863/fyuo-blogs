export type BlogPublisherConfig = {
  baseUrl: string;
  apiKey?: string;
  timeoutMs: number;
  defaultStage: string;
  host: string;
  port: number;
  mcpPath: string;
};

export function loadConfig(): BlogPublisherConfig {
  return {
    baseUrl: process.env.BLOG_BASE_URL?.trim() || "http://localhost:18080",
    timeoutMs: Number(process.env.BLOG_TIMEOUT_MS || 10000),
    defaultStage: process.env.BLOG_DEFAULT_STAGE?.trim() || "published",
    host: process.env.MCP_HOST?.trim() || "0.0.0.0",
    port: Number(process.env.MCP_PORT || 18081),
    mcpPath: process.env.MCP_PATH?.trim() || "/mcp",
  };
}
