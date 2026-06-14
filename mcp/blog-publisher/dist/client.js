import axios from "axios";
export class BlogApiClient {
    config;
    http;
    apiKey;
    constructor(config, options) {
        this.config = config;
        this.http = axios.create({
            baseURL: `${config.baseUrl.replace(/\/$/, "")}/api/v1`,
            timeout: config.timeoutMs,
        });
        this.apiKey = options?.apiKey ?? config.apiKey;
    }
    async signIn(name, password) {
        return this.wrap("sign in", async () => {
            const res = await this.http.post("/signin", { name, password });
            return res.data;
        });
    }
    async createArticle(payload, token) {
        return this.wrap("create article", async () => {
            const res = await this.http.post(`/articles`, payload, this.auth(token));
            return res.data.data;
        });
    }
    async updateArticle(id, payload, token) {
        return this.wrap("update article", async () => {
            const res = await this.http.put(`/articles/${id}`, payload, this.auth(token));
            return res.data.data;
        });
    }
    async listArticles(page = 1, pageSize = 10, token) {
        return this.wrap("list articles", async () => {
            const res = await this.http.get("/articles", {
                ...this.auth(token),
                params: { page, page_size: pageSize },
            });
            return res.data;
        });
    }
    async getArticle(id, token) {
        return this.wrap("get article", async () => {
            const res = await this.http.get(`/articles/${id}`, this.auth(token));
            return res.data.data;
        });
    }
    async searchArticles(query, token) {
        return this.wrap("search articles", async () => {
            const res = await this.http.get("/articles/search", {
                ...this.auth(token),
                params: { q: query },
            });
            return res.data;
        });
    }
    async uploadImage(filename, mimeType, bytes, token) {
        return this.wrap("upload image", async () => {
            const form = new FormData();
            const blob = new Blob([toArrayBuffer(bytes)], { type: mimeType || "application/octet-stream" });
            form.append("file", blob, filename);
            const res = await this.http.post("/uploads/images", form, {
                ...this.auth(token),
                headers: {
                    ...this.auth(token).headers,
                },
            });
            return res.data.data;
        });
    }
    auth(token) {
        if (this.apiKey) {
            return {
                headers: {
                    "X-API-Key": this.apiKey,
                },
            };
        }
        if (token) {
            return {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
        }
        return {
            headers: {},
        };
    }
    async wrap(action, fn) {
        try {
            return await fn();
        }
        catch (error) {
            throw new Error(formatClientError(action, error));
        }
    }
}
function formatClientError(action, error) {
    if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const statusText = error.response?.statusText;
        const details = extractResponseDetails(error.response?.data);
        const message = [status ? `${status}` : "", statusText || "", details || error.message]
            .filter(Boolean)
            .join(" ");
        return `Failed to ${action}: ${message}`.trim();
    }
    if (error instanceof Error) {
        return `Failed to ${action}: ${error.message}`;
    }
    return `Failed to ${action}: ${String(error)}`;
}
function extractResponseDetails(data) {
    if (!data) {
        return "";
    }
    if (typeof data === "string") {
        return data;
    }
    if (typeof data === "object") {
        const record = data;
        if (typeof record.error === "string") {
            return record.error;
        }
        if (typeof record.message === "string") {
            return record.message;
        }
        try {
            return JSON.stringify(data);
        }
        catch {
            return "";
        }
    }
    return String(data);
}
function toArrayBuffer(bytes) {
    return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
}
