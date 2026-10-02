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

  const logout = async () => {
    if (user?.token) {
      const response = await fetch('/api/v1/signout', {method:'POST', headers:{Authorization:`Bearer ${user.token}`}});
      if (!response.ok && response.status !== 401) throw new Error('退出失败，请重试');
    }
    setUser(null);
    authStorage.clear();
  };

  return {
    user,
    login,
    logout,
  };
}