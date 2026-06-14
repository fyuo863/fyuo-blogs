export type BlogPublisherConfig = {
  baseUrl: string;
  apiKey: string;
  username: string;
  password: string;
  timeoutMs: number;
  defaultStage: string;
};

export function loadConfig(): BlogPublisherConfig {
  return {
    baseUrl: process.env.BLOG_BASE_URL?.trim() || "http://localhost:18080",
    apiKey: process.env.BLOG_API_KEY?.trim() || "",
    username: process.env.BLOG_AGENT_NAME?.trim() || "agent-publisher",
    password: process.env.BLOG_AGENT_PASSWORD?.trim() || "agent123456",
    timeoutMs: Number(process.env.BLOG_TIMEOUT_MS || 10000),
    defaultStage: process.env.BLOG_DEFAULT_STAGE?.trim() || "published",
  };
}
