/**
 * EDUNEXIS Student Authentication Service
 * Clean service layer handling student registration, login, demo login, and session persistence.
 * Designed for primary school students with privacy safeguards (masked contact details).
 * Ready for future FastAPI endpoints (POST /api/v1/student/login, POST /api/v1/student/register).
 */

import { DEMO_STUDENT_PROFILE } from "./studentMockData";

const STORAGE_KEY_SESSION = "edunexis_student";
const STORAGE_KEY_ACCOUNTS = "edunexis_registered_students";

/**
 * Mask sensitive phone number for child privacy
 * e.g. "9876543210" -> "+91 ******3210"
 */
function maskPhoneNumber(phone) {
  if (!phone) return "+91 ******0000";
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length < 4) return "+91 ******" + cleaned;
  const lastFour = cleaned.slice(-4);
  return `+91 ******${lastFour}`;
}

/**
 * Simple hash representation for prototype pin/password (avoids plain text storage)
 */
function mockHashPin(pin) {
  if (!pin) return "hash_0000";
  let hash = 0;
  for (let i = 0; i < pin.length; i++) {
    hash = (hash << 5) - hash + pin.charCodeAt(i);
    hash |= 0;
  }
  return `hash_${Math.abs(hash).toString(16)}`;
}

class StudentAuthService {
  /**
   * Retrieve all registered student accounts from localStorage
   */
  getRegisteredStudents() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_ACCOUNTS);
      return data ? JSON.parse(data) : [];
    } catch (err) {
      console.error("[StudentAuthService] Error reading accounts", err);
      return [];
    }
  }

  /**
   * Save registered students array to localStorage
   */
  saveRegisteredStudents(students) {
    try {
      localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(students));
    } catch (err) {
      console.error("[StudentAuthService] Error saving accounts", err);
    }
  }

  /**
   * Register a new student profile
   * Enforces privacy: raw phone number is masked, password is tokenized.
   */
  async registerStudent(formData) {
    await new Promise((resolve) => setTimeout(resolve, 350)); // Realistic network delay

    const {
      name,
      schoolName,
      contactNumber,
      studentClass = "Class 3",
      rollNumber,
      section = "A",
      pin = "1234",
      preferredLanguage = "sat",
    } = formData;

    if (!name?.trim()) throw new Error("विद्यार्थी का नाम आवश्यक है (Student Name is required)");
    if (!schoolName?.trim()) throw new Error("विद्यालय का नाम आवश्यक है (School Name is required)");
    if (!rollNumber?.trim()) throw new Error("रोल नंबर आवश्यक है (Roll Number is required)");

    const registered = this.getRegisteredStudents();
    const maskedContact = maskPhoneNumber(contactNumber);
    const studentId = `JH-STU-${Math.floor(2000 + Math.random() * 8000)}`;

    const newStudent = {
      id: studentId,
      name: name.trim(),
      schoolName: schoolName.trim(),
      contactNumber: maskedContact, // Strictly masked
      class: studentClass,
      rollNumber: rollNumber.trim(),
      section: section.trim().toUpperCase(),
      preferredLanguage,
      avatar: "🎒",
      pinHash: mockHashPin(pin),
      isRegistered: true,
      createdAt: new Date().toISOString(),
      loginTimestamp: new Date().toISOString(),
    };

    registered.push(newStudent);
    this.saveRegisteredStudents(registered);
    this.setActiveSession(newStudent);

    return newStudent;
  }

  /**
   * Login existing student by ID, roll number, or phone
   */
  async loginStudent({ identifier, pin = "" }) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const query = (identifier || "").trim().toLowerCase();
    if (!query) throw new Error("कृपया छात्र आईडी या रोल नंबर दर्ज करें (Enter Student ID or Roll Number)");

    // Check if it's the demo shortcut
    if (query === "demo" || query.includes("asha") || query === "14" || query.includes("3014")) {
      return this.loginDemoStudent();
    }

    const registered = this.getRegisteredStudents();
    const matched = registered.find(
      (s) =>
        s.id.toLowerCase() === query ||
        s.rollNumber.toLowerCase() === query ||
        (s.name && s.name.toLowerCase().includes(query))
    );

    if (matched) {
      const session = {
        ...matched,
        loginTimestamp: new Date().toISOString(),
      };
      this.setActiveSession(session);
      return session;
    }

    // Fallback: Create ad-hoc demo session for seamless hackathon testing
    const adHocStudent = {
      id: `JH-STU-${Math.floor(1000 + Math.random() * 9000)}`,
      name: query.length > 2 ? query.charAt(0).toUpperCase() + query.slice(1) : "Student",
      schoolName: "Rajkiya Prathmik Vidyalaya, Torpa",
      class: "Class 3",
      section: "A",
      rollNumber: query.length <= 3 ? query : "01",
      contactNumber: "+91 ******3210",
      preferredLanguage: "sat",
      avatar: "🎒",
      loginTimestamp: new Date().toISOString(),
    };

    this.setActiveSession(adHocStudent);
    return adHocStudent;
  }

  /**
   * 1-Click Demo Student Login (Asha Murmu, Class 3-A)
   */
  loginDemoStudent() {
    const session = {
      ...DEMO_STUDENT_PROFILE,
      loginTimestamp: new Date().toISOString(),
    };
    this.setActiveSession(session);
    return session;
  }

  /**
   * Set active student session in localStorage
   */
  setActiveSession(profile) {
    try {
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(profile));
    } catch (err) {
      console.error("[StudentAuthService] Error storing active session", err);
    }
  }

  /**
   * Get active student session
   */
  getCurrentStudent() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_SESSION);
      if (data) {
        return JSON.parse(data);
      }
    } catch (err) {
      console.error("[StudentAuthService] Error reading active session", err);
    }
    return null;
  }

  /**
   * Logout current student
   */
  logoutStudent() {
    try {
      localStorage.removeItem(STORAGE_KEY_SESSION);
    } catch (err) {
      console.error("[StudentAuthService] Error logging out student", err);
    }
  }

  /**
   * Update student preferences (e.g. target language)
   */
  updateStudentProfile(updates) {
    const current = this.getCurrentStudent() || DEMO_STUDENT_PROFILE;
    const updated = { ...current, ...updates, updatedAt: new Date().toISOString() };
    this.setActiveSession(updated);

    const registered = this.getRegisteredStudents();
    const idx = registered.findIndex((s) => s.id === current.id);
    if (idx !== -1) {
      registered[idx] = { ...registered[idx], ...updates };
      this.saveRegisteredStudents(registered);
    }

    return updated;
  }
}

export const studentAuthService = new StudentAuthService();
export default studentAuthService;
