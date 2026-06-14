import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { ensureLogin, SessionStore } from "./auth.js";
import { BlogApiClient } from "./client.js";
import { loadConfig } from "./config.js";
export async function startServer() {
    const config = loadConfig();
    const client = new BlogApiClient(config);
    const session = new SessionStore();
    const server = new McpServer({
        name: "blog-publisher",
        version: "0.1.0",
    });
    server.tool("blog_login", {}, async () => {
        const profile = await ensureLogin(client, session, config);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        ok: true,
                        base_url: config.baseUrl,
                        user: profile,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("blog_create_post", {
        title: z.string().min(1),
        content: z.string().min(1),
        tags: z.array(z.string()).optional(),
        stage: z.string().optional(),
        vol: z.number().int().positive().optional(),
    }, async ({ title, content, tags, stage, vol }) => {
        const profile = await ensureLogin(client, session, config);
        const article = await client.createArticle({
            title,
            content,
            tags,
            stage: stage || config.defaultStage,
            vol: vol || 1,
        });
        return {
            content: [{ type: "text", text: JSON.stringify(article, null, 2) }],
        };
    });
    server.tool("blog_update_post", {
        id: z.number().int().positive(),
        title: z.string().optional(),
        content: z.string().optional(),
        tags: z.array(z.string()).optional(),
        stage: z.string().optional(),
        vol: z.number().int().positive().optional(),
    }, async ({ id, ...payload }) => {
        const profile = await ensureLogin(client, session, config);
        const article = await client.updateArticle(id, payload, profile?.token);
        return {
            content: [{ type: "text", text: JSON.stringify(article, null, 2) }],
        };
    });
    server.tool("blog_list_posts", {
        page: z.number().int().positive().optional(),
        page_size: z.number().int().positive().optional(),
    }, async ({ page, page_size }) => {
        const profile = await ensureLogin(client, session, config);
        const result = await client.listArticles(page || 1, page_size || 10, profile?.token);
        return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
    });
    server.tool("blog_get_post", {
        id: z.number().int().positive(),
    }, async ({ id }) => {
        const profile = await ensureLogin(client, session, config);
        const article = await client.getArticle(id, profile?.token);
        return {
            content: [{ type: "text", text: JSON.stringify(article, null, 2) }],
        };
    });
    server.tool("blog_search_posts", {
        query: z.string().min(1),
    }, async ({ query }) => {
        const profile = await ensureLogin(client, session, config);
        const result = await client.searchArticles(query, profile?.token);
        return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
    });
    const transport = new StdioServerTransport();
    await server.connect(transport);
}
