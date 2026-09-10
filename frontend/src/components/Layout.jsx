import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import OfflineIndicator from "./OfflineIndicator";
import { SUPPORTED_LANGUAGES, ROUTES } from "../utils/constants";
import { useAuth } from "../hooks/useAuth";

export function Layout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, updateTeacherLanguage } = useAuth();
  const [selectedLang, setSelectedLang] = useState(user?.targetLanguage || "sat");
  const navigate = useNavigate();

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLang(newLang);
    updateTeacherLanguage(newLang);
  };

  const currentLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === selectedLang) ||
    SUPPORTED_LANGUAGES[0];

  return (
    <div className={`edunexis-dashboard-layout ${isCollapsed ? "layout-sidebar-collapsed" : ""}`}>
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Container */}
      <div className="dashboard-main-shell">
        {/* Top Header */}
        <header className="dashboard-topbar">
          <div className="topbar-left">
            <button
              className="topbar-mobile-menu-btn"
              onClick={() => setIsMobileOpen(true)}
              aria-label="Open Sidebar"
            >
              ☰
            </button>
            <div className="topbar-welcome">
              <span className="welcome-greeting">
                नमस्ते, <strong className="teacher-display-name">{user?.name || "शिक्षक"}</strong>
              </span>
              <span className="welcome-school-meta">
                {user?.school || "Rajkiya Prathmik Vidyalaya"} • {user?.assignedGrades || "Class 1-3"}
              </span>
            </div>
          </div>

          <div className="topbar-right">
            {/* Tribal Language Selector */}
            <div className="language-selector-box" title="Active Classroom Target Language">
              <label htmlFor="topbar-lang-select" className="lang-select-label">
                <span className="lang-icon">🗣️</span>
                <span className="lang-label-text">Target Language:</span>
              </label>
              <select
                id="topbar-lang-select"
                className="topbar-lang-dropdown"
                value={selectedLang}
                onChange={handleLanguageChange}
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Offline Indicator */}
            <OfflineIndicator />

            {/* Quick Live Classroom Button */}
            <button
              className="topbar-quick-action-btn"
              onClick={() => navigate(ROUTES.LIVE_CLASSROOM)}
              title="Launch Live Classroom Voice Assistant"
            >
              <span>🎙️ Live Mic</span>
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="dashboard-content-area" id="main-content">
          {children}
        </main>

        {/* Dashboard Minimal Footer */}
        <footer className="dashboard-footer">
          <div className="footer-meta-row">
            <span>EDUNEXIS — AI-Powered Vernacular Education</span>
            <span className="footer-bullet">•</span>
            <span>Breaking language barriers. Enabling every child to learn.</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Layout;
