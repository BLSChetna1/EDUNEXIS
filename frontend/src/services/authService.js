/**
 * EDUNEXIS Authentication Service
 * Clean service layer handling teacher registration, login, logout, and profile session.
 * Built with localStorage prototype persistence, ready for future FastAPI JWT endpoints.
 */

import { DEMO_TEACHER } from "../utils/constants";

const STORAGE_KEY_SESSION = "edunexis_teacher";
const STORAGE_KEY_ACCOUNTS = "edunexis_registered_teachers";

class AuthService {
  /**
   * Get all registered teacher profiles from localStorage
   */
  getRegisteredTeachers() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_ACCOUNTS);
      return data ? JSON.parse(data) : [];
    } catch (err) {
      console.error("[AuthService] Error reading registered teachers", err);
      return [];
    }
  }

  /**
   * Save registered accounts array to localStorage
   */
  saveRegisteredTeachers(teachers) {
    try {
      localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(teachers));
    } catch (err) {
      console.error("[AuthService] Error saving registered teachers", err);
    }
  }

  /**
   * Register a new teacher account
   * Note: For prototype security, sensitive raw passwords are not persisted.
   */
  async registerTeacher(teacherData) {
    // Simulate brief network delay for realism
    await new Promise((resolve) => setTimeout(resolve, 350));

    const {
      name,
      teacherId,
      school,
      district,
      email,
      classesTaught = ["Class 1"],
      avatar = "👩‍🏫",
    } = teacherData;

    const normalizedEmail = email.trim().toLowerCase();
    const existing = this.getRegisteredTeachers();

    // Check if email already registered in prototype store
    const duplicate = existing.find((t) => t.email.toLowerCase() === normalizedEmail);
    if (duplicate) {
      throw new Error("यह ईमेल पहले से पंजीकृत है (This email is already registered).");
    }

    const classesArray = Array.isArray(classesTaught) ? classesTaught : [classesTaught];

    // Create safe teacher profile without raw password
    const newProfile = {
      id: teacherId.trim() || `JH-EDU-${Math.floor(1000 + Math.random() * 9000)}`,
      name: name.trim(),
      teacherId: teacherId.trim(),
      school: school.trim(),
      district: district.trim(),
      email: normalizedEmail,
      role: "Primary Assistant Teacher",
      nativeLanguage: "Hindi",
      targetLanguage: "sat", // Default vernacular pedagogical language
      classesTaught: classesArray,
      assignedGrades: classesArray.join(", "),
      avatar,
      isRegistered: true,
      registeredAt: new Date().toISOString(),
      loginTimestamp: new Date().toISOString(),
    };

    // Persist to registered accounts list
    existing.push(newProfile);
    this.saveRegisteredTeachers(existing);

    // Save as active teacher session
    this.setActiveSession(newProfile);

    return newProfile;
  }

  /**
   * Login existing teacher with email / ID and password
   */
  async loginTeacher({ emailOrId, password, rememberMe = true }) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const query = emailOrId.trim().toLowerCase();
    const existing = this.getRegisteredTeachers();

    // Check registered accounts
    let matchedProfile = existing.find(
      (t) => t.email.toLowerCase() === query || t.teacherId.toLowerCase() === query
    );

    // Fallback: Check if it's the demo account
    if (!matchedProfile) {
      if (
        query.includes("sunita") ||
        query.includes("demo") ||
        query.includes("jh-edu") ||
        query === DEMO_TEACHER.name.toLowerCase()
      ) {
        matchedProfile = {
          ...DEMO_TEACHER,
          email: query.includes("@") ? query : "sunita.murmu@jharkhand.edu.in",
          teacherId: "JH-EDU-1048",
          isDemo: true,
        };
      } else {
        // Create an ad-hoc session for quick evaluation
        matchedProfile = {
          ...DEMO_TEACHER,
          name: query.includes("@") ? query.split("@")[0] : query,
          email: query.includes("@") ? query : `${query}@jharkhand.edu.in`,
          teacherId: `JH-EDU-${Math.floor(1000 + Math.random() * 9000)}`,
        };
      }
    }

    const sessionData = {
      ...matchedProfile,
      rememberMe,
      loginTimestamp: new Date().toISOString(),
    };

    this.setActiveSession(sessionData);
    return sessionData;
  }

  /**
   * Set active teacher session in localStorage
   */
  setActiveSession(profile) {
    try {
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(profile));
    } catch (err) {
      console.error("[AuthService] Error setting active session", err);
    }
  }

  /**
   * Get current authenticated teacher session
   */
  getCurrentTeacher() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_SESSION);
      if (data) {
        return JSON.parse(data);
      }
    } catch (err) {
      console.error("[AuthService] Error reading active session", err);
    }
    return null;
  }

  /**
   * Logout current teacher session
   */
  logoutTeacher() {
    try {
      localStorage.removeItem(STORAGE_KEY_SESSION);
    } catch (err) {
      console.error("[AuthService] Error during logout", err);
    }
  }

  /**
   * Update active teacher profile
   */
  updateTeacherProfile(updates) {
    const current = this.getCurrentTeacher() || DEMO_TEACHER;
    const updated = { ...current, ...updates, updatedAt: new Date().toISOString() };
    this.setActiveSession(updated);

    // Also update in registered list if found
    const all = this.getRegisteredTeachers();
    const idx = all.findIndex((t) => t.email === current.email);
    if (idx !== -1) {
      all[idx] = { ...all[idx], ...updates };
      this.saveRegisteredTeachers(all);
    }

    return updated;
  }
}

export const authService = new AuthService();
export default authService;
