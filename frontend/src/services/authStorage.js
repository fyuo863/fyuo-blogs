const STORAGE_KEY = "user";

export const authStorage = {
  getUser() {
    let saved;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch { return null; }
    if (!saved) return null;

    try {
      const parsed = JSON.parse(saved);
      if (parsed?.token) return parsed;
    } catch {
      try { localStorage.removeItem(STORAGE_KEY); } catch { /* sandboxed plugin storage */ }
    }

    return null;
  },

  setUser(user) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(user)); } catch { /* sandboxed plugin storage */ }
  },

  clear() {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* sandboxed plugin storage */ }
  },
};
