export class SessionStore {
    token = null;
    profile = null;
    getToken() {
        return this.token;
    }
    getProfile() {
        return this.profile;
    }
    setSession(data) {
        this.profile = data ?? null;
        this.token = data?.token ?? null;
    }
    clear() {
        this.token = null;
        this.profile = null;
    }
}
export async function ensureLogin(client, session, config) {
    if (config.apiKey) {
        return {
            id: 0,
            name: "api-key",
            role: "agent",
            token: "",
        };
    }
    throw new Error("BLOG_API_KEY is required for remote MCP deployment");
}
