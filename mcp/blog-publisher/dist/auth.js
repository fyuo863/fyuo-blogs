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
    if (session.getToken())
        return session.getProfile();
    const result = await client.signIn(config.username, config.password);
    if (!result.data?.token) {
        throw new Error("Agent login failed: missing token");
    }
    session.setSession(result.data);
    return result.data;
}
