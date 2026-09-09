/**
 * Custom Hook: useStudentAuth
 * Manages client-side student session, demo login, language preference, and registration.
 * Clean abstraction separating React UI from storage and future FastAPI endpoints.
 */

import { useState, useEffect } from "react";
import studentAuthService from "../services/studentAuthService";
import { DEMO_STUDENT_PROFILE } from "../services/studentMockData";

export function useStudentAuth() {
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const active = studentAuthService.getCurrentStudent();
      if (active) {
        setStudent(active);
      }
    } catch (err) {
      console.error("[useStudentAuth] Error restoring session", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const profile = await studentAuthService.loginStudent(credentials);
      setStudent(profile);
      return profile;
    } finally {
      setIsLoading(false);
    }
  };

  const loginDemo = () => {
    const profile = studentAuthService.loginDemoStudent();
    setStudent(profile);
    return profile;
  };

  const register = async (formData) => {
    setIsLoading(true);
    try {
      const profile = await studentAuthService.registerStudent(formData);
      setStudent(profile);
      return profile;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    studentAuthService.logoutStudent();
    setStudent(null);
  };

  const setLanguage = (langCode) => {
    const updated = studentAuthService.updateStudentProfile({ preferredLanguage: langCode });
    setStudent(updated);
    return updated;
  };

  return {
    student: student || DEMO_STUDENT_PROFILE, // Fallback to demo student for uninterrupted review
    rawStudent: student,
    isAuthenticated: Boolean(student),
    isLoading,
    login,
    loginDemo,
    register,
    logout,
    setLanguage,
  };
}

export default useStudentAuth;
