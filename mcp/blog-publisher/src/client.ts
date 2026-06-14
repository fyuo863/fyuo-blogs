import axios, { type AxiosInstance } from "axios";
import type { BlogPublisherConfig } from "./config.js";
import type { Article, ArticlePayload, LoginResponse } from "./types.js";

export class BlogApiClient {
  private http: AxiosInstance;
  private readonly apiKey?: string;

  constructor(private readonly config: BlogPublisherConfig, options?: { apiKey?: string }) {
    this.http = axios.create({
      baseURL: `${config.baseUrl.replace(/\/$/, "")}/api/v1`,
      timeout: config.timeoutMs,
    });
    this.apiKey = options?.apiKey ?? config.apiKey;
  }

  async signIn(name: string, password: string): Promise<LoginResponse> {
    const res = await this.http.post<LoginResponse>("/signin", { name, password });
    return res.data;
  }

  async createArticle(payload: ArticlePayload, token?: string): Promise<Article> {
    const res = await this.http.post<{ data: Article }>(`/articles`, payload, this.auth(token));
    return res.data.data;
  }

  async updateArticle(id: number, payload: Partial<ArticlePayload>, token?: string): Promise<Article> {
    const res = await this.http.put<{ data: Article }>(`/articles/${id}`, payload, this.auth(token));
    return res.data.data;
  }

  async listArticles(page = 1, pageSize = 10, token?: string) {
    const res = await this.http.get<{ data: Article[]; total: number; page: number; page_size: number }>(
      "/articles",
      {
        ...this.auth(token),
        params: { page, page_size: pageSize },
      },
    );
    return res.data;
  }

  async getArticle(id: number, token?: string): Promise<Article> {
    const res = await this.http.get<{ data: Article }>(`/articles/${id}`, this.auth(token));
    return res.data.data;
  }

  async searchArticles(query: string, token?: string) {
    const res = await this.http.get<{ data: Article[]; total: number; query: string }>(
      "/articles/search",
      {
        ...this.auth(token),
        params: { q: query },
      },
    );
    return res.data;
  }

  private auth(token?: string) {
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
