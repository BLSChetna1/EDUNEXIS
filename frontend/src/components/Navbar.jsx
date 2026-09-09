import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { APP_NAME, APP_SUBTITLE, ROUTES } from "../utils/constants";
import OfflineIndicator from "./OfflineIndicator";
import Button from "./Button";

export function Navbar({ variant = "public" }) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="edunexis-navbar">
      <div className="navbar-container">
        <Link to={ROUTES.HOME} className="brand-group" aria-label="EDUNEXIS Home">
          <div className="brand-logo-badge">
            <span className="brand-icon">🌱</span>
          </div>
          <div className="brand-text">
            <span className="brand-title">{APP_NAME}</span>
            <span className="brand-tag">{APP_SUBTITLE}</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="navbar-links" aria-label="Main Navigation">
          <a href="#problem" className="nav-link">
            The Problem
          </a>
          <a href="#capabilities" className="nav-link">
            Capabilities
          </a>
          <a href="#offline" className="nav-link">
            Offline Access
          </a>
          <a href="#languages" className="nav-link">
            Tribal Languages
          </a>
        </nav>

        {/* Right actions */}
        <div className="navbar-actions">
          <OfflineIndicator />

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(ROUTES.STUDENT_LOGIN)}
            icon={<span className="btn-icon">🎓</span>}
          >
            Student Login
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(ROUTES.LOGIN)}
            icon={<span className="btn-icon">👩‍🏫</span>}
          >
            Teacher Login
          </Button>

          {/* Mobile hamburger toggle */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className="hamburger-bar"></span>
            <span className="hamburger-bar"></span>
            <span className="hamburger-bar"></span>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <a
            href="#problem"
            className="mobile-nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            The Problem
          </a>
          <a
            href="#capabilities"
            className="mobile-nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Capabilities
          </a>
          <a
            href="#offline"
            className="mobile-nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Offline Access
          </a>
          <a
            href="#languages"
            className="mobile-nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Tribal Languages
          </a>
          <div className="mobile-nav-cta">
            <Button
              variant="outline"
              fullWidth
              style={{ marginBottom: "0.75rem" }}
              onClick={() => {
                setMobileMenuOpen(false);
                navigate(ROUTES.STUDENT_LOGIN);
              }}
            >
              🎓 Student Login →
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={() => {
                setMobileMenuOpen(false);
                navigate(ROUTES.LOGIN);
              }}
            >
              👩‍🏫 Teacher Login →
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
