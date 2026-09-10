/**
 * Custom hook: useAuth (Placeholder)
 * Manages client-side user context and role-based permissions
 */

import { useState, useEffect } from "react";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Placeholder: Initialize session / profile from local state or backend
    const savedUser = localStorage.getItem("edunexis_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("edunexis_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("edunexis_user");
  };

  return {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    login,
    logout,
  };
}
