/**
 * EDUNEXIS Student Portal Left-Aligned Sidebar Navigation
 * Vertical navigation adhering to EDUNEXIS design system:
 * - Warm, light background with nature-inspired green accents
 * - Rounded, touch-friendly items (min 48px height)
 * - Clear visual active state
 * - Bottom section with student profile overview and separated logout
 */

import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../utils/constants";
import { useStudentAuth } from "../hooks/useStudentAuth";

export function StudentSidebar({
  isCollapsed = false,
  onToggleCollapse,
  isMobileOpen = false,
  onCloseMobile,
}) {
  const { student, logout } = useStudentAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showProfileCard, setShowProfileCard] = useState(false);

  const currentPath = location.pathname;
  const currentHash = location.hash;

  const navItems = [
    {
      id: "home",
      label: "Home",
      hindiLabel: "मुख्य पृष्ठ",
      path: ROUTES.STUDENT_DASHBOARD,
      exact: true,
      icon: "🏠",
    },
    {
      id: "todays-learning",
      label: "Today's Learning",
      hindiLabel: "आज का पाठ",
      path: `${ROUTES.STUDENT_DASHBOARD}#todays-learning`,
      hash: "#todays-learning",
      icon: "📖",
      badge: "Today",
    },
    {
      id: "topics-learned",
      label: "Topics We Learned",
      hindiLabel: "सीखे गए विषय",
      path: `${ROUTES.STUDENT_DASHBOARD}#topics-learned`,
      hash: "#topics-learned",
      icon: "📚",
    },
    {
      id: "syllabus",
      label: "My Syllabus",
      hindiLabel: "पाठ्यक्रम",
      path: ROUTES.STUDENT_SYLLABUS,
      icon: "📋",
    },
    {
      id: "ai-assistant",
      label: "Ask EDU AI",
      hindiLabel: "एआई सहायक",
      path: ROUTES.STUDENT_AI_ASSISTANT,
      icon: "🤖",
      badge: "AI",
    },
  ];

  const handleNavClick = (item) => {
    if (onCloseMobile) onCloseMobile();
    if (item.hash) {
      if (currentPath === ROUTES.STUDENT_DASHBOARD) {
        const el = document.getElementById(item.hash.replace("#", ""));
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } else {
        navigate(item.path);
      }
    } else {
      navigate(item.path);
    }
  };

  const handleLogout = () => {
    if (onCloseMobile) onCloseMobile();
    logout();
    navigate(ROUTES.STUDENT_LOGIN);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="student-sidebar-backdrop"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={`student-sidebar ${isCollapsed ? "sidebar-collapsed" : ""} ${
          isMobileOpen ? "sidebar-mobile-open" : ""
        }`}
        aria-label="Student Learning Navigation"
      >
        {/* Sidebar Header / Quick Brand or Toggle */}
        <div className="student-sidebar-header">
          <div className="sidebar-section-badge">
            <span className="badge-spark">🌱</span>
            {!isCollapsed && <span>Learning Hub</span>}
          </div>

          {onToggleCollapse && (
            <button
              type="button"
              className="student-sidebar-collapse-btn"
              onClick={onToggleCollapse}
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              aria-label="Toggle Sidebar"
            >
              {isCollapsed ? "→" : "←"}
            </button>
          )}
        </div>

        {/* Main Vertical Navigation Menu */}
        <nav className="student-sidebar-nav" aria-label="Student Main Menu">
          <ul className="student-sidebar-menu">
            {navItems.map((item) => {
              let isActive = false;
              if (item.hash) {
                isActive = currentPath === ROUTES.STUDENT_DASHBOARD && currentHash === item.hash;
              } else if (item.exact) {
                isActive = currentPath === ROUTES.STUDENT_DASHBOARD && !currentHash;
              } else {
                isActive = currentPath.startsWith(item.path);
              }

              return (
                <li key={item.id} className="student-sidebar-item">
                  <button
                    type="button"
                    className={`student-sidebar-link ${isActive ? "active" : ""}`}
                    onClick={() => handleNavClick(item)}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <span className="sidebar-link-icon">{item.icon}</span>
                    {!isCollapsed && (
                      <div className="sidebar-link-text-group">
                        <span className="sidebar-link-title">{item.label}</span>
                        <span className="sidebar-link-sub">{item.hindiLabel}</span>
                      </div>
                    )}
                    {!isCollapsed && item.badge && (
                      <span className={`sidebar-link-badge badge-${item.badge.toLowerCase()}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Section: Student Profile & Logout */}
        <div className="student-sidebar-footer">
          {/* Profile overview card */}
          <div
            className="student-sidebar-profile-card"
            onClick={() => setShowProfileCard(!showProfileCard)}
            role="button"
            tabIndex={0}
            title="Student Profile Overview"
          >
            <div className="student-profile-avatar-circle">
              {student?.avatar || "👧"}
            </div>
            {!isCollapsed && (
              <div className="student-profile-texts">
                <span className="student-profile-name">{student?.name || "Asha Murmu"}</span>
                <span className="student-profile-sub">
                  {student?.class || "Class 3"} • Sec {student?.section || "A"}
                </span>
              </div>
            )}
          </div>

          {/* Quick Profile Popover (if opened) */}
          {showProfileCard && !isCollapsed && (
            <div className="student-quick-profile-popover">
              <div className="popover-row">
                <span className="popover-label">School:</span>
                <span className="popover-val">{student?.schoolName || "Rajkiya Prathmik Vidyalaya"}</span>
              </div>
              <div className="popover-row">
                <span className="popover-label">Roll No:</span>
                <span className="popover-val">{student?.rollNumber || "14"}</span>
              </div>
              <div className="popover-row">
                <span className="popover-label">Status:</span>
                <span className="popover-val">{student?.isDemo ? "⚡ Demo Account" : "Registered"}</span>
              </div>
            </div>
          )}

          {/* Visually Separated Logout Action */}
          <button
            type="button"
            className="student-sidebar-logout-btn"
            onClick={handleLogout}
            title="Logout from Student Portal"
          >
            <span className="logout-icon">🚪</span>
            {!isCollapsed && <span>Logout / बाहर निकलें</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

export default StudentSidebar;
