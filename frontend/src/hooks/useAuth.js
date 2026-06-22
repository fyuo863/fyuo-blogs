import { useState } from "react";
import { authStorage } from "../services/authStorage";

export function useAuth() {
  const [user, setUser] = useState(() => authStorage.getUser());

  const login = (profile) => {
    const u = {
      id: profile.id,
      name: profile.name,
      role: profile.role,
      token: profile.token,
    };

    setUser(u);
    authStorage.setUser(u);
  };

  const logout = () => {
    setUser(null);
    authStorage.clear();
  };

  return {
    user,
    login,
    logout,
  };
}