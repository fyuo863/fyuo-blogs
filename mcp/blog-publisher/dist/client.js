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
        const res = await this.http.post("/signin", { name, password });
        return res.data;
    }
    async createArticle(payload, token) {
        const res = await this.http.post(`/articles`, payload, this.auth(token));
        return res.data.data;
    }
    async updateArticle(id, payload, token) {
        const res = await this.http.put(`/articles/${id}`, payload, this.auth(token));
        return res.data.data;
    }
    async listArticles(page = 1, pageSize = 10, token) {
        const res = await this.http.get("/articles", {
            ...this.auth(token),
            params: { page, page_size: pageSize },
        });
        return res.data;
    }
    async getArticle(id, token) {
        const res = await this.http.get(`/articles/${id}`, this.auth(token));
        return res.data.data;
    }
    async searchArticles(query, token) {
        const res = await this.http.get("/articles/search", {
            ...this.auth(token),
            params: { q: query },
        });
        return res.data;
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
}
