/**
 * EDUNEXIS Student Portal Layout
 * Two-column workspace layout with:
 * - Clean, minimal Top Header (Logo + Language + Online Status + Profile Pill)
 * - Left-Aligned Navigation Sidebar (Home, Today's Learning, Topics We Learned, My Syllabus, Ask EDU AI, Logout)
 * - Generous, distraction-free Main Content Area
 */

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { APP_NAME, ROUTES, SUPPORTED_LANGUAGES } from "../utils/constants";
import OfflineIndicator from "./OfflineIndicator";
import StudentSidebar from "./StudentSidebar";
import { useStudentAuth } from "../hooks/useStudentAuth";

export function StudentLayout({ children }) {
  const { student, logout, setLanguage } = useStudentAuth();
  const navigate = useNavigate();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const selectedLang = student?.preferredLanguage || "sat";

  const handleLanguageChange = (e) => {
    const langCode = e.target.value;
    setLanguage(langCode);
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES.STUDENT_LOGIN);
  };

  return (
    <div className={`student-portal-layout ${isCollapsed ? "student-layout-collapsed" : ""}`}>
      {/* 1. TOP HEADER - Clean, minimal, no horizontal navigation crowding */}
      <header className="student-top-header">
        <div className="student-top-header-left">
          {/* Mobile / Tablet Drawer Toggle */}
          <button
            type="button"
            className="student-mobile-hamburger-btn"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Open Navigation Sidebar"
          >
            ☰
          </button>

          {/* Logo & Portal Identity */}
          <Link to={ROUTES.STUDENT_DASHBOARD} className="student-header-brand-link">
            <div className="student-header-logo-badge">
              <span>🌱</span>
            </div>
            <div className="student-header-brand-text">
              <span className="student-header-app-name">{APP_NAME}</span>
              <span className="student-header-tagline">Student Learning Portal</span>
            </div>
          </Link>
        </div>

        {/* Right Controls: 1. Language, 2. Online/Offline, 3. Student Profile */}
        <div className="student-top-header-right">
          {/* 1. Learning Language Selector */}
          <div className="student-header-lang-box" title="Choose your learning language">
            <span className="header-lang-icon" aria-hidden="true">🌐</span>
            <label htmlFor="header-student-lang-select" className="sr-only">Learning Language</label>
            <select
              id="header-student-lang-select"
              className="student-header-lang-select"
              value={selectedLang}
              onChange={handleLanguageChange}
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Online / Offline Indicator */}
          <div className="student-header-status-box">
            <OfflineIndicator />
          </div>

          {/* 3. Student Profile Avatar & Pill */}
          <div className="student-header-profile-box">
            <button
              type="button"
              className="student-header-profile-pill"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              aria-label="Student Profile Menu"
              aria-expanded={profileDropdownOpen}
            >
              <span className="profile-pill-avatar">{student?.avatar || "👧"}</span>
              <div className="profile-pill-text">
                <span className="profile-pill-name">{student?.name || "Student"}</span>
                <span className="profile-pill-class">
                  {student?.class || "Class 3"} • Sec {student?.section || "A"}
                </span>
              </div>
              <span className="profile-pill-caret">▾</span>
            </button>

            {/* Profile Dropdown Card */}
            {profileDropdownOpen && (
              <div className="student-header-dropdown-menu">
                <div className="dropdown-menu-header">
                  <span className="dropdown-menu-avatar">{student?.avatar || "👧"}</span>
                  <div>
                    <h4 className="dropdown-menu-title">{student?.name || "Student"}</h4>
                    <p className="dropdown-menu-school">{student?.schoolName || "Rajkiya Prathmik Vidyalaya"}</p>
                    <p className="dropdown-menu-meta">
                      Roll No: <strong>{student?.rollNumber || "14"}</strong> • {student?.class} ({student?.section})
                    </p>
                  </div>
                </div>

                <div className="dropdown-menu-body">
                  <div className="dropdown-menu-row">
                    <span className="row-key">Learning Medium:</span>
                    <span className="row-val">
                      {SUPPORTED_LANGUAGES.find((l) => l.code === selectedLang)?.name || "Santali"}
                    </span>
                  </div>
                  <div className="dropdown-menu-row">
                    <span className="row-key">Account Type:</span>
                    <span className="row-val">{student?.isDemo ? "⚡ Demo Student" : "Registered"}</span>
                  </div>
                </div>

                <div className="dropdown-menu-footer">
                  <button
                    type="button"
                    className="dropdown-menu-logout-btn"
                    onClick={handleLogout}
                  >
                    🚪 Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. BODY LAYOUT: LEFT SIDEBAR + MAIN CONTENT */}
      <div className="student-body-container">
        {/* Left-Aligned Sidebar Navigation */}
        <StudentSidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          isMobileOpen={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
        />

        {/* Main Workspace Content Area */}
        <div className="student-main-content-shell">
          <main className="student-content-viewport" id="student-main">
            {children}
          </main>

          {/* Footer */}
          <footer className="student-workspace-footer">
            <div className="student-footer-inner">
              <p className="student-footer-brand-text">
                🌱 <strong>EDUNEXIS Student Learning Portal</strong> — Learn and revise in your mother tongue.
              </p>
              <span className="student-footer-privacy-pill">
                🔒 Child-Safe &amp; Privacy-Protected Learning Space
              </span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default StudentLayout;
