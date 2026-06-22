const STORAGE_KEY = "user";

export const authStorage = {
  getUser() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;

    try {
      const parsed = JSON.parse(saved);
      if (parsed?.token) return parsed;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }

    return null;
  },

  setUser(user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  },

  clear() {
    localStorage.removeItem(STORAGE_KEY);
  },
};