import type { BlogPublisherConfig } from "./config.js";
import type { LoginResponse } from "./types.js";

export class SessionStore {
  private token: string | null = null;
  private profile: LoginResponse["data"] | null = null;

  getToken() {
    return this.token;
  }

  getProfile() {
    return this.profile;
  }

  setSession(data: LoginResponse["data"]) {
    this.profile = data ?? null;
    this.token = data?.token ?? null;
  }

  clear() {
    this.token = null;
    this.profile = null;
  }
}

export async function ensureLogin(
  client: { signIn: (name: string, password: string) => Promise<LoginResponse> },
  session: SessionStore,
  config: BlogPublisherConfig,
) {
  if (config.apiKey) {
    return {
      id: 0,
      name: "api-key",
      role: "agent",
      token: "",
    };
  }
  if (session.getToken()) return session.getProfile();
  const result = await client.signIn(config.username, config.password);
  if (!result.data?.token) {
    throw new Error("Agent login failed: missing token");
  }
  session.setSession(result.data);
  return result.data;
}
