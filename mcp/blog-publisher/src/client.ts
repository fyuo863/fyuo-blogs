import axios, { type AxiosInstance } from "axios";
import type { BlogPublisherConfig } from "./config.js";
import type { Article, ArticlePayload, LoginResponse, UploadImageResponse } from "./types.js";

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
    return this.wrap("sign in", async () => {
      const res = await this.http.post<LoginResponse>("/signin", { name, password });
      return res.data;
    });
  }

  async createArticle(payload: ArticlePayload, token?: string): Promise<Article> {
    return this.wrap("create article", async () => {
      const res = await this.http.post<{ data: Article }>(`/articles`, payload, this.auth(token));
      return res.data.data;
    });
  }

  async updateArticle(id: number, payload: Partial<ArticlePayload>, token?: string): Promise<Article> {
    return this.wrap("update article", async () => {
      const res = await this.http.put<{ data: Article }>(`/articles/${id}`, payload, this.auth(token));
      return res.data.data;
    });
  }

  async listArticles(page = 1, pageSize = 10, token?: string) {
    return this.wrap("list articles", async () => {
      const res = await this.http.get<{ data: Article[]; total: number; page: number; page_size: number }>(
        "/articles",
        {
          ...this.auth(token),
          params: { page, page_size: pageSize },
        },
      );
      return res.data;
    });
  }

  async getArticle(id: number, token?: string): Promise<Article> {
    return this.wrap("get article", async () => {
      const res = await this.http.get<{ data: Article }>(`/articles/${id}`, this.auth(token));
      return res.data.data;
    });
  }

  async searchArticles(query: string, token?: string) {
    return this.wrap("search articles", async () => {
      const res = await this.http.get<{ data: Article[]; total: number; query: string }>(
        "/articles/search",
        {
          ...this.auth(token),
          params: { q: query },
        },
      );
      return res.data;
    });
  }

  async uploadImage(filename: string, mimeType: string, bytes: Uint8Array, token?: string) {
    return this.wrap("upload image", async () => {
      const form = new FormData();
      const blob = new Blob([toArrayBuffer(bytes)], { type: mimeType || "application/octet-stream" });
      form.append("file", blob, filename);

      const res = await this.http.post<UploadImageResponse>("/uploads/images", form, {
        ...this.auth(token),
        headers: {
          ...this.auth(token).headers,
        },
      });
      return res.data.data;
    });
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

  private async wrap<T>(action: string, fn: () => Promise<T>): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      throw new Error(formatClientError(action, error));
    }
  }
}

function formatClientError(action: string, error: unknown): string {
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

function extractResponseDetails(data: unknown): string {
  if (!data) {
    return "";
  }
  if (typeof data === "string") {
    return data;
  }
  if (typeof data === "object") {
    const record = data as Record<string, unknown>;
    if (typeof record.error === "string") {
      return record.error;
    }
    if (typeof record.message === "string") {
      return record.message;
    }
    try {
      return JSON.stringify(data);
    } catch {
      return "";
    }
  }
  return String(data);
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}
