import { useEffect, useState } from "react";
import authApi from "../api/authApi";
import AuthContext from "./authContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      try {
        const response = await authApi.getCurrentPlayer();

        setUser(response.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  async function logout() {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
    }
  }

  const value = {
    user,
    setUser,
    loading,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
