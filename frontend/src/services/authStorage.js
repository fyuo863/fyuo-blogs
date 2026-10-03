import { isPublicOrigin, isAdminOrigin } from "./origins";
const storage = () => isAdminOrigin ? sessionStorage : localStorage;
const STORAGE_KEY = "user";

export const authStorage = {
  getUser() {
    if (isPublicOrigin) { try { storage().removeItem(STORAGE_KEY); } catch { /* unavailable storage */ } return null; }
    let saved;
    try { saved = storage().getItem(STORAGE_KEY); } catch { return null; }
    if (!saved) return null;

    try {
      const parsed = JSON.parse(saved);
      if (parsed?.token) return parsed;
    } catch {
      try { storage().removeItem(STORAGE_KEY); } catch { /* sandboxed plugin storage */ }
    }

    return null;
  },

  setUser(user) {
    if (isPublicOrigin) return;
    try { storage().setItem(STORAGE_KEY, JSON.stringify(user)); } catch { /* sandboxed plugin storage */ }
  },

  clear() {
    try { storage().removeItem(STORAGE_KEY); } catch { /* sandboxed plugin storage */ }
  },
};
