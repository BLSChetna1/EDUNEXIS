/**
 * Custom hook: useAuth
 * Manages client-side teacher profile session and authentication state.
 * Interacts with authService, separated cleanly for future FastAPI JWT integration.
 */

import { useState, useEffect } from "react";
import { DEMO_TEACHER } from "../utils/constants";
import authService from "../services/authService";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const sessionUser = authService.getCurrentTeacher();
      if (sessionUser) {
        setUser(sessionUser);
      }
    } catch (err) {
      console.error("Failed to load saved teacher session", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const profile = await authService.loginTeacher(credentials);
      setUser(profile);
      return profile;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (registrationData) => {
    setIsLoading(true);
    try {
      const profile = await authService.registerTeacher(registrationData);
      setUser(profile);
      return profile;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logoutTeacher();
    setUser(null);
  };

  const updateTeacherLanguage = (langCode) => {
    if (!user) return;
    const updated = authService.updateTeacherProfile({ targetLanguage: langCode });
    setUser(updated);
  };

  const updateProfile = (updates) => {
    const updated = authService.updateTeacherProfile(updates);
    setUser(updated);
    return updated;
  };

  return {
    user: user || DEMO_TEACHER, // Fallback to demo teacher for uninterrupted testing
    rawUser: user, // null if no real login occurred
    isAuthenticated: Boolean(user),
    isLoading,
    login,
    register,
    logout,
    updateTeacherLanguage,
    updateProfile,
  };
}

export default useAuth;
