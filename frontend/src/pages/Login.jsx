import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import OfflineIndicator from "../components/OfflineIndicator";
import {
  APP_NAME,
  ROUTES,
  JHARKHAND_DISTRICTS,
  AVAILABLE_CLASSES,
} from "../utils/constants";
import { useAuth } from "../hooks/useAuth";

export function Login() {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  // Active Tab: 'signin' | 'register'
  const [activeTab, setActiveTab] = useState("signin");

  // Sign In state
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Registration state
  const [regFullName, setRegFullName] = useState("");
  const [regTeacherId, setRegTeacherId] = useState("");
  const [regSchool, setRegSchool] = useState("");
  const [regDistrict, setRegDistrict] = useState(JHARKHAND_DISTRICTS[0] || "Khunti");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Classes Taught Multi-select state
  const [selectedClasses, setSelectedClasses] = useState(["Class 1", "Class 2"]);
  const [isClassesDropdownOpen, setIsClassesDropdownOpen] = useState(false);
  const classesDropdownRef = useRef(null);

  // Status & Feedback
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Close classes dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        classesDropdownRef.current &&
        !classesDropdownRef.current.contains(event.target)
      ) {
        setIsClassesDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Switch tab helper
  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setErrorMessage("");
    setSuccessMessage("");
    setIsClassesDropdownOpen(false);
  };

  // Toggle individual class
  const handleToggleClass = (cls) => {
    setSelectedClasses((prev) =>
      prev.includes(cls) ? prev.filter((c) => c !== cls) : [...prev, cls]
    );
    if (errorMessage) setErrorMessage("");
  };

  // Quick Action: Select All / Clear All
  const handleSelectAllOrClear = (e) => {
    e.preventDefault();
    if (selectedClasses.length === AVAILABLE_CLASSES.length) {
      setSelectedClasses([]);
    } else {
      setSelectedClasses([...AVAILABLE_CLASSES]);
    }
    if (errorMessage) setErrorMessage("");
  };

  // Classes summary label
  const getClassesDisplaySummary = () => {
    if (selectedClasses.length === 0) {
      return "चुनें (Select classes taught...)";
    }
    if (selectedClasses.length === AVAILABLE_CLASSES.length) {
      return "All Primary Classes (Class 1-5)";
    }
    if (selectedClasses.length >= 4) {
      return `${selectedClasses.length} Classes Selected (${[...selectedClasses].sort().join(", ")})`;
    }
    return [...selectedClasses].sort().join(", ");
  };

  // Sign In Handler
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!signInEmail.trim()) {
      setErrorMessage("कृपया शिक्षक ईमेल या शिक्षक आईडी दर्ज करें (Please enter teacher email or ID).");
      return;
    }

    if (!signInPassword.trim()) {
      setErrorMessage("कृपया पासवर्ड दर्ज करें (Please enter your password).");
      return;
    }

    setIsSubmitting(true);
    try {
      await login({
        emailOrId: signInEmail.trim(),
        password: signInPassword.trim(),
        rememberMe,
      });
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      setErrorMessage(err.message || "लॉगिन विफल रहा (Login failed. Please check credentials).");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Create Account Handler
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Required fields validation
    if (!regFullName.trim()) {
      setErrorMessage("कृपया अपना पूरा नाम दर्ज करें (Full Name is required).");
      return;
    }

    if (!regTeacherId.trim()) {
      setErrorMessage("कृपया शिक्षक / कर्मचारी आईडी दर्ज करें (Teacher ID is required).");
      return;
    }

    if (!regSchool.trim()) {
      setErrorMessage("कृपया विद्यालय का नाम दर्ज करें (School Name is required).");
      return;
    }

    if (!regDistrict) {
      setErrorMessage("कृपया अपना जिला चुनें (District is required).");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regEmail.trim() || !emailRegex.test(regEmail.trim())) {
      setErrorMessage("कृपया एक वैध ईमेल पता दर्ज करें (Please enter a valid email address).");
      return;
    }

    // Classes Taught validation (at least one class required)
    if (!selectedClasses || selectedClasses.length === 0) {
      setErrorMessage("Please select at least one class (कृपया कम से कम एक कक्षा चुनें).");
      return;
    }

    // Password length validation
    if (!regPassword || regPassword.length < 6) {
      setErrorMessage("पासवर्ड कम से कम 6 अक्षरों का होना चाहिए (Password must be at least 6 characters).");
      return;
    }

    // Password match validation
    if (regPassword !== regConfirmPassword) {
      setErrorMessage("पासवर्ड और पुष्टि पासवर्ड मेल नहीं खाते (Passwords do not match).");
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        name: regFullName.trim(),
        teacherId: regTeacherId.trim(),
        school: regSchool.trim(),
        district: regDistrict,
        email: regEmail.trim(),
        classesTaught: [...selectedClasses].sort(),
        avatar: "👩‍🏫",
      });

      setSuccessMessage("खाता सफलतापूर्वक बनाया गया! डैशबोर्ड पर पुनर्निर्देशित किया जा रहा है...");
      setTimeout(() => {
        navigate(ROUTES.DASHBOARD);
      }, 700);
    } catch (err) {
      setErrorMessage(err.message || "खाता निर्माण विफल रहा (Registration failed).");
      setIsSubmitting(false);
    }
  };

  // Quick Demo Auto-fill Helper for Sign-In Testing
  const handleQuickDemoFill = () => {
    setSignInEmail("sunita.murmu@jharkhand.edu.in");
    setSignInPassword("Teacher@123");
    setErrorMessage("");
  };

  return (
    <div className="login-page-wrapper">
      {/* Top minimal bar */}
      <header className="login-header-bar">
        <Link to={ROUTES.HOME} className="login-brand-link" aria-label="Return to Home">
          <div className="brand-logo-badge">
            <span>🌱</span>
          </div>
          <div className="brand-text">
            <span className="brand-title">{APP_NAME}</span>
            <span className="brand-tag">Teacher Workspace</span>
          </div>
        </Link>

        <div className="login-header-right">
          <OfflineIndicator compact />
          <Link to={ROUTES.HOME} className="back-to-home-link">
            <span>← मुख्य पृष्ठ (Home)</span>
          </Link>
        </div>
      </header>

      {/* Main Login Card Container */}
      <main className="login-main-container">
        <div className="login-card">
          {/* Card header */}
          <div className="login-card-header">
            <div className="login-icon-bubble">
              <span>{activeTab === "signin" ? "👩‍🏫" : "📝"}</span>
            </div>
            <h1 className="login-card-title">
              {activeTab === "signin" ? "Welcome to EDUNEXIS" : "Create Teacher Account"}
            </h1>
            <p className="login-card-subtitle">
              {activeTab === "signin"
                ? "Sign in to access your multilingual teaching workspace."
                : "Register your teacher profile for vernacular classroom pedagogy in Jharkhand."}
            </p>
          </div>

          {/* Dual Tab Navigation */}
          <div className="auth-tab-bar" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "signin"}
              className={`auth-tab-btn ${activeTab === "signin" ? "auth-tab-active" : ""}`}
              onClick={() => handleTabSwitch("signin")}
            >
              <span>🔑 प्रवेश करें (Sign In)</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "register"}
              className={`auth-tab-btn ${activeTab === "register" ? "auth-tab-active" : ""}`}
              onClick={() => handleTabSwitch("register")}
            >
              <span>✨ नया खाता बनाएं (Create Account)</span>
            </button>
          </div>

          {/* Feedback alerts */}
          {errorMessage && (
            <div className="login-error-alert" role="alert">
              <span className="error-icon">⚠️</span>
              <span className="error-text">{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="login-success-alert" role="alert">
              <span className="success-icon">✅</span>
              <span className="success-text">{successMessage}</span>
            </div>
          )}

          {/* TAB 1: SIGN IN FORM */}
          {activeTab === "signin" && (
            <>
              {/* Distinct Demo Credentials Box */}
              <div className="demo-credentials-callout">
                <div className="demo-callout-text">
                  <strong>⚡ Demo Access:</strong>
                  <span> Fast evaluation with preconfigured teacher credentials</span>
                </div>
                <button
                  type="button"
                  className="demo-fill-btn"
                  onClick={handleQuickDemoFill}
                  title="Auto-fill sample credentials"
                >
                  Auto-Fill Demo
                </button>
              </div>

              <form className="login-form" onSubmit={handleSignInSubmit} noValidate>
                {/* Teacher ID / Email Input */}
                <div className="form-group">
                  <label htmlFor="teacher-email" className="form-label">
                    शिक्षक ईमेल / शिक्षक आईडी (Teacher Email / ID) <span className="req-star">*</span>
                  </label>
                  <div className="input-wrapper">
                    <span className="input-prefix-icon">📧</span>
                    <input
                      id="teacher-email"
                      type="text"
                      className="form-input"
                      placeholder="e.g. sunita.murmu@jharkhand.edu.in or JH-EDU-1048"
                      value={signInEmail}
                      onChange={(e) => {
                        setSignInEmail(e.target.value);
                        if (errorMessage) setErrorMessage("");
                      }}
                      autoComplete="username"
                      required
                    />
                  </div>
                </div>

                {/* Password Input with Show/Hide toggle */}
                <div className="form-group">
                  <div className="label-row">
                    <label htmlFor="teacher-password" className="form-label">
                      पासवर्ड (Password) <span className="req-star">*</span>
                    </label>
                    <span className="password-hint">Demo: any password</span>
                  </div>
                  <div className="input-wrapper">
                    <span className="input-prefix-icon">🔒</span>
                    <input
                      id="teacher-password"
                      type={showSignInPassword ? "text" : "password"}
                      className="form-input password-input"
                      placeholder="••••••••"
                      value={signInPassword}
                      onChange={(e) => {
                        setSignInPassword(e.target.value);
                        if (errorMessage) setErrorMessage("");
                      }}
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowSignInPassword(!showSignInPassword)}
                      aria-label={showSignInPassword ? "Hide password" : "Show password"}
                    >
                      {showSignInPassword ? "👁️ Hide" : "👁️‍🗨️ Show"}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Local Storage Tag */}
                <div className="form-extras-row">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      className="custom-checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span className="checkbox-text">याद रखें (Remember me on this tablet)</span>
                  </label>

                  <span className="offline-ready-tag" title="Logins are cached locally for offline teaching">
                    💾 Offline Ready
                  </span>
                </div>

                {/* Submit Button */}
                <div className="form-submit-row">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    disabled={isSubmitting}
                    icon={isSubmitting ? <span>⏳</span> : <span>→</span>}
                    iconPosition="right"
                  >
                    {isSubmitting ? "सत्यापन हो रहा है (Signing In)..." : "प्रवेश करें (Login to Dashboard)"}
                  </Button>
                </div>
              </form>
            </>
          )}

          {/* TAB 2: CREATE ACCOUNT FORM */}
          {activeTab === "register" && (
            <form className="login-form registration-form" onSubmit={handleRegisterSubmit} noValidate>
              {/* Row 1: Name & Teacher ID */}
              <div className="form-grid-2col">
                <div className="form-group">
                  <label htmlFor="reg-name" className="form-label">
                    पूरा नाम (Full Name) <span className="req-star">*</span>
                  </label>
                  <div className="input-wrapper">
                    <span className="input-prefix-icon">👤</span>
                    <input
                      id="reg-name"
                      type="text"
                      className="form-input"
                      placeholder="e.g. Birsa Hansda"
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="reg-id" className="form-label">
                    शिक्षक आईडी (Teacher ID / Emp Code) <span className="req-star">*</span>
                  </label>
                  <div className="input-wrapper">
                    <span className="input-prefix-icon">🆔</span>
                    <input
                      id="reg-id"
                      type="text"
                      className="form-input"
                      placeholder="e.g. JH-EDU-3092"
                      value={regTeacherId}
                      onChange={(e) => setRegTeacherId(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: School Name & District */}
              <div className="form-grid-2col">
                <div className="form-group">
                  <label htmlFor="reg-school" className="form-label">
                    विद्यालय का नाम (School Name) <span className="req-star">*</span>
                  </label>
                  <div className="input-wrapper">
                    <span className="input-prefix-icon">🏫</span>
                    <input
                      id="reg-school"
                      type="text"
                      className="form-input"
                      placeholder="e.g. Rajkiya Utkramit Prathmik Vidyalaya, Torpa"
                      value={regSchool}
                      onChange={(e) => setRegSchool(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="reg-district" className="form-label">
                    जिला (District in Jharkhand) <span className="req-star">*</span>
                  </label>
                  <div className="input-wrapper select-wrapper">
                    <span className="input-prefix-icon">📍</span>
                    <select
                      id="reg-district"
                      className="form-input form-select"
                      value={regDistrict}
                      onChange={(e) => setRegDistrict(e.target.value)}
                      required
                    >
                      {JHARKHAND_DISTRICTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Row 3: Email Address & Classes Taught (Multi-select) */}
              <div className="form-grid-2col">
                <div className="form-group">
                  <label htmlFor="reg-email" className="form-label">
                    ईमेल पता (Email Address) <span className="req-star">*</span>
                  </label>
                  <div className="input-wrapper">
                    <span className="input-prefix-icon">📧</span>
                    <input
                      id="reg-email"
                      type="email"
                      className="form-input"
                      placeholder="e.g. teacher@jharkhand.edu.in"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Redesigned Multi-select Classes Taught */}
                <div className="form-group classes-multiselect-group" ref={classesDropdownRef}>
                  <label
                    htmlFor="classes-taught-trigger"
                    className="form-label"
                    onClick={() => setIsClassesDropdownOpen(!isClassesDropdownOpen)}
                  >
                    कक्षा स्तर (Classes Taught) <span className="req-star">*</span>
                  </label>
                  <div className="multiselect-trigger-wrap">
                    <button
                      type="button"
                      id="classes-taught-trigger"
                      className={`form-input multiselect-trigger-btn ${
                        isClassesDropdownOpen ? "trigger-btn-open" : ""
                      } ${selectedClasses.length === 0 ? "trigger-placeholder" : ""}`}
                      onClick={() => setIsClassesDropdownOpen(!isClassesDropdownOpen)}
                      aria-haspopup="listbox"
                      aria-expanded={isClassesDropdownOpen}
                    >
                      <span className="multiselect-prefix-icon">🎒</span>
                      <span className="multiselect-selected-text">
                        {getClassesDisplaySummary()}
                      </span>
                      <span className="multiselect-arrow-icon">
                        {isClassesDropdownOpen ? "▲" : "▼"}
                      </span>
                    </button>

                    {/* Expandable Checkbox Dropdown Panel */}
                    {isClassesDropdownOpen && (
                      <div className="multiselect-dropdown-panel" role="listbox">
                        <div className="multiselect-quick-actions">
                          <button
                            type="button"
                            className="quick-select-all-btn"
                            onClick={handleSelectAllOrClear}
                          >
                            {selectedClasses.length === AVAILABLE_CLASSES.length
                              ? "✕ Deselect All"
                              : "✓ Select All Primary Classes"}
                          </button>
                          <span className="selection-count-badge">
                            {selectedClasses.length}/{AVAILABLE_CLASSES.length} Selected
                          </span>
                        </div>

                        <div className="multiselect-checkbox-list">
                          {AVAILABLE_CLASSES.map((cls) => {
                            const isChecked = selectedClasses.includes(cls);
                            return (
                              <label
                                key={cls}
                                className={`multiselect-option-row ${
                                  isChecked ? "option-row-selected" : ""
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  className="custom-checkbox multiselect-check"
                                  checked={isChecked}
                                  onChange={() => handleToggleClass(cls)}
                                />
                                <span className="option-class-label">{cls}</span>
                                {isChecked && <span className="option-check-indicator">✓</span>}
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Row 4: Password & Confirm Password */}
              <div className="form-grid-2col">
                <div className="form-group">
                  <label htmlFor="reg-password" className="form-label">
                    पासवर्ड (Password) <span className="req-star">*</span>
                  </label>
                  <div className="input-wrapper">
                    <span className="input-prefix-icon">🔒</span>
                    <input
                      id="reg-password"
                      type={showRegPassword ? "text" : "password"}
                      className="form-input password-input"
                      placeholder="Min 6 characters"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="reg-confirm" className="form-label">
                    पासवर्ड पुष्टि (Confirm Password) <span className="req-star">*</span>
                  </label>
                  <div className="input-wrapper">
                    <span className="input-prefix-icon">🔒</span>
                    <input
                      id="reg-confirm"
                      type={showRegPassword ? "text" : "password"}
                      className="form-input password-input"
                      placeholder="Repeat password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Show password toggle */}
              <div className="reg-checkbox-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    className="custom-checkbox"
                    checked={showRegPassword}
                    onChange={(e) => setShowRegPassword(e.target.checked)}
                  />
                  <span className="checkbox-text">पासवर्ड दिखाएं (Show Passwords)</span>
                </label>
              </div>

              {/* Registration prototype note */}
              <div className="prototype-storage-note">
                <span>💾 <strong>Local Storage Prototype:</strong> Your teacher profile and class assignments will be securely saved locally on this tablet and can sync with state education servers when connected.</span>
              </div>

              {/* Submit Button */}
              <div className="form-submit-row">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={isSubmitting}
                  icon={isSubmitting ? <span>⏳</span> : <span>✨</span>}
                  iconPosition="right"
                >
                  {isSubmitting ? "खाता बन रहा है (Creating Account)..." : "खाता बनाएं और डैशबोर्ड खोलें (Create Account & Open Dashboard)"}
                </Button>
              </div>
            </form>
          )}

          {/* Footer Navigation */}
          <div className="login-card-footer">
            <Link to={ROUTES.HOME} className="footer-back-link">
              ← मुख्य पृष्ठ पर वापस जाएं (Back to Home)
            </Link>
          </div>
        </div>

        {/* Informational sidebar card for teachers */}
        <div className="login-info-box">
          <div className="info-box-header">
            <span className="info-badge">ℹ️ शिक्षक सहायता (Teacher Help Desk)</span>
          </div>
          <p className="info-box-text">
            EDUNEXIS झारखंड के प्राथमिक विद्यालयों में संथाली, हो और मुंडारी माध्यम के बच्चों को मातृभाषा में शिक्षण सहायता और वास्तविक समय अनुवाद प्रदान करता है।
          </p>
          <div className="info-contact-line">
            <span>District Hubs: Khunti • West Singhbhum • Ranchi • Dumka</span>
          </div>
          <div className="info-prototype-tag">
            <span>Prototype Edition: Ready for State Portal Integration</span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;
