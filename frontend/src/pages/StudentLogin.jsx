/**
 * EDUNEXIS Student Login & Account Creation Page
 * Route: /student-login
 * Designed for primary-school students: friendly, simple, secure, touch-friendly.
 */

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { APP_NAME, ROUTES, AVAILABLE_CLASSES, STUDENT_SECTIONS } from "../utils/constants";
import { useStudentAuth } from "../hooks/useStudentAuth";
import Button from "../components/Button";

export function StudentLogin() {
  const navigate = useNavigate();
  const { login, loginDemo, register } = useStudentAuth();

  const [activeTab, setActiveTab] = useState("signin"); // "signin" | "register"
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Sign In state
  const [signInForm, setSignInForm] = useState({
    identifier: "JH-STU-3014", // Pre-filled with demo for convenience
    pin: "1234",
  });

  // Create Account state
  const [regForm, setRegForm] = useState({
    name: "",
    schoolName: "Rajkiya Prathmik Vidyalaya, Torpa",
    contactNumber: "",
    studentClass: "Class 3",
    rollNumber: "",
    section: "A",
    pin: "",
    confirmPin: "",
    preferredLanguage: "sat",
  });

  // Handle Demo Login
  const handleDemoLogin = () => {
    setLoading(true);
    setErrorMessage("");
    try {
      loginDemo();
      navigate(ROUTES.STUDENT_DASHBOARD);
    } catch (err) {
      setErrorMessage("डेमो लॉगिन लोड नहीं हो सका। कृपया पुनः प्रयास करें।");
    } finally {
      setLoading(false);
    }
  };

  // Handle Sign In Submit
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    try {
      await login({
        identifier: signInForm.identifier,
        pin: signInForm.pin,
      });
      navigate(ROUTES.STUDENT_DASHBOARD);
    } catch (err) {
      setErrorMessage(err.message || "लॉगिन विफल रहा। कृपया सही जानकारी भरें।");
    } finally {
      setLoading(false);
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    if (!regForm.name.trim()) {
      setErrorMessage("कृपया विद्यार्थी का नाम लिखें (Student Name is required)");
      setLoading(false);
      return;
    }
    if (!regForm.rollNumber.trim()) {
      setErrorMessage("कृपया रोल नंबर लिखें (Roll Number is required)");
      setLoading(false);
      return;
    }
    if (regForm.pin && regForm.pin !== regForm.confirmPin) {
      setErrorMessage("पिन और पुष्टि पिन मेल नहीं खाते (PINs do not match)");
      setLoading(false);
      return;
    }

    try {
      await register({
        name: regForm.name,
        schoolName: regForm.schoolName,
        contactNumber: regForm.contactNumber,
        studentClass: regForm.studentClass,
        rollNumber: regForm.rollNumber,
        section: regForm.section,
        pin: regForm.pin || "1234",
        preferredLanguage: regForm.preferredLanguage,
      });
      setSuccessMessage("खाता सफलतापूर्वक बन गया! डैशबोर्ड लोड हो रहा है...");
      setTimeout(() => {
        navigate(ROUTES.STUDENT_DASHBOARD);
      }, 700);
    } catch (err) {
      setErrorMessage(err.message || "पंजीकरण में त्रुटि हुई।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-auth-page">
      {/* Background Ambience */}
      <div className="student-auth-bg-glow glow-top-left" aria-hidden="true"></div>
      <div className="student-auth-bg-glow glow-bottom-right" aria-hidden="true"></div>

      <div className="student-auth-card-container">
        {/* Top Header */}
        <header className="student-auth-header">
          <Link to={ROUTES.HOME} className="student-auth-brand" aria-label="Back to Home">
            <span className="brand-leaf-icon">🌱</span>
            <span className="brand-logo-name">{APP_NAME}</span>
          </Link>
          <div className="student-badge-pill">
            <span>🎓 Student Learning Portal</span>
          </div>
          <h1 className="student-auth-title">विद्यार्थी पोर्टल</h1>
          <p className="student-auth-subtitle">
            "Learn, revise, and ask questions in a language you understand."
          </p>
        </header>

        {/* 1-Click Demo Shortcut Banner (Prominent Secondary Action) */}
        <div className="student-demo-callout-box">
          <div className="demo-callout-content">
            <div className="demo-callout-text">
              <span className="demo-sparkle">⚡</span>
              <div>
                <strong>Explore as Demo Student</strong>
                <p>Loads Asha Murmu (Class 3-A, Santhali Medium) instantly.</p>
              </div>
            </div>
            <button
              type="button"
              className="student-demo-btn"
              onClick={handleDemoLogin}
              disabled={loading}
            >
              ⚡ Try Demo Student Account
            </button>
          </div>
        </div>

        {/* Form Mode Tabs */}
        <div className="student-auth-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "signin"}
            className={`student-tab-btn ${activeTab === "signin" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("signin");
              setErrorMessage("");
            }}
          >
            🔑 Student Sign In
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "register"}
            className={`student-tab-btn ${activeTab === "register" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("register");
              setErrorMessage("");
            }}
          >
            📝 Create Student Account
          </button>
        </div>

        {/* Feedback Alerts */}
        {errorMessage && (
          <div className="student-alert-banner alert-error" role="alert">
            <span className="alert-icon">⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="student-alert-banner alert-success" role="status">
            <span className="alert-icon">✅</span>
            <span>{successMessage}</span>
          </div>
        )}

        {/* TAB 1: STUDENT SIGN IN */}
        {activeTab === "signin" && (
          <form className="student-form" onSubmit={handleSignInSubmit}>
            <div className="form-group-student">
              <label htmlFor="student-id-input" className="student-form-label">
                <span>Student ID / Roll Number or Phone</span>
                <span className="hindi-hint">छात्र आईडी या रोल नंबर</span>
              </label>
              <input
                id="student-id-input"
                type="text"
                className="student-input"
                placeholder="e.g. JH-STU-3014 or 14"
                value={signInForm.identifier}
                onChange={(e) => setSignInForm({ ...signInForm, identifier: e.target.value })}
                required
              />
            </div>

            <div className="form-group-student">
              <label htmlFor="student-pin-input" className="student-form-label">
                <span>Student Security PIN / Password</span>
                <span className="hindi-hint">सरल पिन या पासवर्ड</span>
              </label>
              <input
                id="student-pin-input"
                type="password"
                className="student-input"
                placeholder="e.g. 1234"
                value={signInForm.pin}
                onChange={(e) => setSignInForm({ ...signInForm, pin: e.target.value })}
              />
              <span className="student-field-note">
                💡 For demo access, use default PIN: <strong>1234</strong>
              </span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              icon={<span className="btn-icon">🚀</span>}
              iconPosition="right"
            >
              Sign In to Learning Portal
            </Button>
          </form>
        )}

        {/* TAB 2: CREATE STUDENT ACCOUNT */}
        {activeTab === "register" && (
          <form className="student-form" onSubmit={handleRegisterSubmit}>
            <div className="form-group-student">
              <label htmlFor="reg-name" className="student-form-label">
                <span>Student Name *</span>
                <span className="hindi-hint">विद्यार्थी का पूरा नाम</span>
              </label>
              <input
                id="reg-name"
                type="text"
                className="student-input"
                placeholder="e.g. Birsa Hembram"
                value={regForm.name}
                onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group-student">
              <label htmlFor="reg-school" className="student-form-label">
                <span>School Name *</span>
                <span className="hindi-hint">विद्यालय का नाम</span>
              </label>
              <input
                id="reg-school"
                type="text"
                className="student-input"
                placeholder="e.g. Rajkiya Prathmik Vidyalaya, Torpa"
                value={regForm.schoolName}
                onChange={(e) => setRegForm({ ...regForm, schoolName: e.target.value })}
                required
              />
            </div>

            <div className="form-group-student">
              <label htmlFor="reg-phone" className="student-form-label">
                <span>Parent / Guardian Contact Number</span>
                <span className="hindi-hint">अभिभावक का मोबाइल नंबर</span>
              </label>
              <input
                id="reg-phone"
                type="tel"
                className="student-input"
                placeholder="e.g. 9876543210"
                value={regForm.contactNumber}
                onChange={(e) => setRegForm({ ...regForm, contactNumber: e.target.value })}
              />
              <span className="student-privacy-note">
                🔒 <strong>Child Privacy Protection:</strong> Phone number is private and will be masked (+91 ******XXXX) across all dashboards.
              </span>
            </div>

            <div className="form-row-2col">
              <div className="form-group-student">
                <label htmlFor="reg-class" className="student-form-label">
                  <span>Student Class *</span>
                  <span className="hindi-hint">कक्षा</span>
                </label>
                <select
                  id="reg-class"
                  className="student-select"
                  value={regForm.studentClass}
                  onChange={(e) => setRegForm({ ...regForm, studentClass: e.target.value })}
                >
                  {AVAILABLE_CLASSES.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group-student">
                <label htmlFor="reg-section" className="student-form-label">
                  <span>Section</span>
                  <span className="hindi-hint">वर्ग / सेक्शन</span>
                </label>
                <select
                  id="reg-section"
                  className="student-select"
                  value={regForm.section}
                  onChange={(e) => setRegForm({ ...regForm, section: e.target.value })}
                >
                  {STUDENT_SECTIONS.map((sec) => (
                    <option key={sec} value={sec}>
                      Section {sec}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row-2col">
              <div className="form-group-student">
                <label htmlFor="reg-roll" className="student-form-label">
                  <span>Roll Number *</span>
                  <span className="hindi-hint">क्रमांक</span>
                </label>
                <input
                  id="reg-roll"
                  type="text"
                  className="student-input"
                  placeholder="e.g. 18"
                  value={regForm.rollNumber}
                  onChange={(e) => setRegForm({ ...regForm, rollNumber: e.target.value })}
                  required
                />
              </div>

              <div className="form-group-student">
                <label htmlFor="reg-lang" className="student-form-label">
                  <span>Mother Tongue</span>
                  <span className="hindi-hint">सीखने की भाषा</span>
                </label>
                <select
                  id="reg-lang"
                  className="student-select"
                  value={regForm.preferredLanguage}
                  onChange={(e) => setRegForm({ ...regForm, preferredLanguage: e.target.value })}
                >
                  <option value="sat">Santhali (संथाली)</option>
                  <option value="hoc">Ho (हो)</option>
                  <option value="unr">Mundari (मुंडारी)</option>
                  <option value="hi">Hindi (हिन्दी)</option>
                </select>
              </div>
            </div>

            <div className="form-row-2col">
              <div className="form-group-student">
                <label htmlFor="reg-pin" className="student-form-label">
                  <span>Create Easy PIN (4 digits)</span>
                  <span className="hindi-hint">4 अंकों का सरल पिन</span>
                </label>
                <input
                  id="reg-pin"
                  type="password"
                  maxLength={6}
                  className="student-input"
                  placeholder="e.g. 1234"
                  value={regForm.pin}
                  onChange={(e) => setRegForm({ ...regForm, pin: e.target.value })}
                />
              </div>

              <div className="form-group-student">
                <label htmlFor="reg-pin-confirm" className="student-form-label">
                  <span>Confirm PIN</span>
                  <span className="hindi-hint">पिन दोबारा लिखें</span>
                </label>
                <input
                  id="reg-pin-confirm"
                  type="password"
                  maxLength={6}
                  className="student-input"
                  placeholder="e.g. 1234"
                  value={regForm.confirmPin}
                  onChange={(e) => setRegForm({ ...regForm, confirmPin: e.target.value })}
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              icon={<span className="btn-icon">✨</span>}
              iconPosition="right"
            >
              Complete Student Registration
            </Button>
          </form>
        )}

        {/* Portal Switcher Footer */}
        <footer className="student-auth-footer-nav">
          <p className="teacher-switch-text">
            Are you a school teacher?{" "}
            <Link to={ROUTES.LOGIN} className="teacher-link-highlight">
              Go to Teacher Portal →
            </Link>
          </p>
          <div className="student-prototype-note">
            ℹ️ EDUNEXIS Student Prototype • Client persistence active, ready for FastAPI integration.
          </div>
        </footer>
      </div>
    </div>
  );
}

export default StudentLogin;
