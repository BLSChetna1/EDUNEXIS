import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { APP_NAME, ROUTES } from "../utils/constants";
import { useAuth } from "../hooks/useAuth";
import TeacherProfileModal from "./TeacherProfileModal";

export function Sidebar({ isCollapsed, onToggleCollapse, isMobileOpen, onCloseMobile }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const navItems = [
    {
      to: ROUTES.DASHBOARD,
      icon: "📊",
      label: "Dashboard",
      badge: null,
    },
    {
      to: ROUTES.MY_LESSONS,
      icon: "📚",
      label: "My Lessons",
      badge: "Saved",
    },
    {
      to: ROUTES.LIVE_CLASSROOM,
      icon: "🎙️",
      label: "Live Classroom",
      badge: "Voice",
    },
    {
      to: ROUTES.TRANSLATE,
      icon: "🌐",
      label: "Translate Content",
      badge: null,
    },
    {
      to: ROUTES.LESSON_GENERATOR,
      icon: "📖",
      label: "AI Lesson Generator",
      badge: "FLN",
    },
    {
      to: ROUTES.WORKSHEET_GENERATOR,
      icon: "📝",
      label: "Worksheet Generator",
      badge: "Print",
    },
    {
      to: ROUTES.FLASHCARDS,
      icon: "🎴",
      label: "AI Flashcards",
      badge: "Visual",
    },
    {
      to: ROUTES.OFFLINE_LIBRARY,
      icon: "💾",
      label: "Offline Library",
      badge: "Local",
    },
  ];

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
  };

  return (
    <>
      {/* Mobile / Tablet overlay backdrop */}
      {isMobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Teacher Profile Dialog */}
      <TeacherProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      <aside
        className={`dashboard-sidebar ${isCollapsed ? "sidebar-collapsed" : ""} ${
          isMobileOpen ? "sidebar-mobile-open" : ""
        }`}
        aria-label="Teacher Dashboard Navigation"
      >
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="sidebar-brand-link" onClick={() => navigate(ROUTES.DASHBOARD)}>
            <div className="sidebar-brand-badge">
              <span>🌱</span>
            </div>
            {!isCollapsed && (
              <div className="sidebar-brand-text">
                <span className="sidebar-app-name">{APP_NAME}</span>
                <span className="sidebar-tagline">Teacher Workspace</span>
              </div>
            )}
          </div>

          <button
            className="sidebar-collapse-toggle"
            onClick={onToggleCollapse}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            aria-label="Toggle Sidebar width"
          >
            {isCollapsed ? "→" : "←"}
          </button>
        </div>

        {/* Navigation list */}
        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            {navItems.map((item) => (
              <li key={item.to} className="sidebar-menu-item">
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
                  }
                  onClick={onCloseMobile}
                  title={isCollapsed ? item.label : undefined}
                >
                  <span className="sidebar-icon">{item.icon}</span>
                  {!isCollapsed && (
                    <>
                      <span className="sidebar-label">{item.label}</span>
                      {item.badge && (
                        <span className="sidebar-item-badge">{item.badge}</span>
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Footer / Teacher Profile */}
        <div className="sidebar-footer">
          <div
            className="sidebar-profile-card clickable-profile-card"
            onClick={() => setIsProfileModalOpen(true)}
            title="Click to view full teacher profile"
          >
            <div className="teacher-avatar-circle" title={user?.name}>
              {user?.avatar || "👩‍🏫"}
            </div>
            {!isCollapsed && (
              <div className="teacher-info">
                <div className="teacher-name">{user?.name || "Teacher"}</div>
                <div className="teacher-school">
                  {user?.district ? `${user.district}` : "Khunti, JH"}
                </div>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <div className="sidebar-footer-actions">
              <button
                type="button"
                className="sidebar-action-btn"
                onClick={() => setIsProfileModalOpen(true)}
                title="View and edit profile details"
              >
                👤 Profile
              </button>
              <button
                type="button"
                className="sidebar-action-btn"
                onClick={() => navigate(ROUTES.MY_LESSONS)}
                title="View your saved lessons"
              >
                📚 Lessons
              </button>
              <button
                type="button"
                className="sidebar-action-btn logout-action-btn"
                onClick={handleLogout}
                title="Log Out Teacher Session"
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
