import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { ensureLogin, SessionStore } from "./auth.js";
import { BlogApiClient } from "./client.js";
import { loadConfig } from "./config.js";
export function createBlogPublisherServer(config, options) {
    const effectiveConfig = options?.apiKey
        ? { ...config, apiKey: options.apiKey }
        : config;
    const client = new BlogApiClient(effectiveConfig, { apiKey: options?.apiKey });
    const session = new SessionStore();
    const server = new McpServer({
        name: "blog-publisher",
        version: "0.2.0",
    });
    server.tool("blog_login", "Verify that the current blog API key can reach the blog backend and return the active identity. Use this for connectivity or authentication checks; it does not prompt for a username or password.", {}, async () => {
        const profile = await ensureLogin(client, session, effectiveConfig);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        ok: true,
                        base_url: effectiveConfig.baseUrl,
                        user: profile,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("blog_create_post", "Create a new blog post in the backend and return the created article record.", {
        title: z.string().min(1).describe("Post title shown in the blog list and detail page."),
        content: z.string().min(1).describe("Full markdown content of the post body."),
        cover_image: z
            .string()
            .optional()
            .describe("Optional cover image URL, typically returned by blog_upload_image."),
        tags: z.array(z.string()).optional().describe("Optional tag list used for organization and search."),
        stage: z
            .string()
            .optional()
            .describe("Publishing stage such as published or draft. Defaults to the server's default stage."),
        vol: z
            .number()
            .int()
            .positive()
            .optional()
            .describe("Optional volume/issue number. Defaults to 1."),
    }, async ({ title, content, cover_image, tags, stage, vol }) => {
        await ensureLogin(client, session, effectiveConfig);
        const article = await client.createArticle({
            title,
            content,
            cover_image,
            tags,
            stage: stage || effectiveConfig.defaultStage,
            vol: vol || 1,
        });
        return {
            content: [{ type: "text", text: JSON.stringify(article, null, 2) }],
        };
    });
    server.tool("blog_update_post", "Update an existing blog post by article ID and return the updated article record.", {
        id: z.number().int().positive().describe("Numeric article ID to update."),
        title: z.string().optional().describe("New title. Omit to keep the current value."),
        content: z.string().optional().describe("New markdown content. Omit to keep the current value."),
        cover_image: z
            .string()
            .optional()
            .describe("New cover image URL. Omit to keep the current value."),
        tags: z
            .array(z.string())
            .optional()
            .describe("Replacement tag list. Provide the full desired tag set when updating tags."),
        stage: z.string().optional().describe("New publishing stage, for example published or draft."),
        vol: z.number().int().positive().optional().describe("New volume/issue number."),
    }, async ({ id, ...payload }) => {
        const profile = await ensureLogin(client, session, effectiveConfig);
        const article = await client.updateArticle(id, payload, profile?.token);
        return {
            content: [{ type: "text", text: JSON.stringify(article, null, 2) }],
        };
    });
    server.tool("blog_upload_image", "Upload an image to the blog backend and return the hosted URL plus a ready-to-paste markdown snippet. Use this before blog_create_post when a post should contain images.", {
        filename: z
            .string()
            .min(1)
            .describe("Original file name including extension, for example hero.png or cover.webp."),
        base64_data: z
            .string()
            .min(1)
            .describe("Raw base64-encoded image bytes. Do not include a data: URL prefix."),
        mime_type: z
            .string()
            .optional()
            .describe("Optional MIME type such as image/png or image/jpeg. Defaults from the file extension when omitted."),
        alt: z
            .string()
            .optional()
            .describe("Optional alt text used to generate the returned markdown snippet."),
    }, async ({ filename, base64_data, mime_type, alt }) => {
        const profile = await ensureLogin(client, session, effectiveConfig);
        const bytes = decodeBase64(base64_data);
        const uploaded = await client.uploadImage(filename, mime_type || guessMimeType(filename), bytes, profile?.token);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        ...uploaded,
                        markdown: `![${alt || filename}](${uploaded.url})`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("blog_list_posts", "List blog posts with pagination and return the backend paging result including data and totals.", {
        page: z.number().int().positive().optional().describe("1-based page number. Defaults to 1."),
        page_size: z
            .number()
            .int()
            .positive()
            .optional()
            .describe("Number of posts per page. Defaults to 10."),
    }, async ({ page, page_size }) => {
        const profile = await ensureLogin(client, session, effectiveConfig);
        const result = await client.listArticles(page || 1, page_size || 10, profile?.token);
        return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
    });
    server.tool("blog_get_post", "Fetch a single blog post by article ID and return the full article record.", {
        id: z.number().int().positive().describe("Numeric article ID to fetch."),
    }, async ({ id }) => {
        const profile = await ensureLogin(client, session, effectiveConfig);
        const article = await client.getArticle(id, profile?.token);
        return {
            content: [{ type: "text", text: JSON.stringify(article, null, 2) }],
        };
    });
    server.tool("blog_search_posts", "Search blog posts by keyword and return matching articles with the backend's total count.", {
        query: z.string().min(1).describe("Search keyword used against the blog backend search endpoint."),
    }, async ({ query }) => {
        const profile = await ensureLogin(client, session, effectiveConfig);
        const result = await client.searchArticles(query, profile?.token);
        return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
    });
    return server;
}
export async function startStdioServer() {
    const config = loadConfig();
    const server = createBlogPublisherServer(config, { apiKey: config.apiKey });
    const transport = new StdioServerTransport();
    await server.connect(transport);
}
function decodeBase64(value) {
    const normalized = value.replace(/^data:[^;]+;base64,/, "").replace(/\s+/g, "");
    return Uint8Array.from(Buffer.from(normalized, "base64"));
}
function guessMimeType(filename) {
    const ext = filename.toLowerCase().split(".").pop();
    switch (ext) {
        case "jpg":
        case "jpeg":
            return "image/jpeg";
        case "png":
            return "image/png";
        case "gif":
            return "image/gif";
        case "webp":
            return "image/webp";
        default:
            return "application/octet-stream";
    }
}
