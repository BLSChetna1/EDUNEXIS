import React from "react";
import { APP_NAME, SIH_EDITION } from "../utils/constants";

export function Navbar() {
  return (
    <header className="edunexis-navbar">
      <div className="navbar-container">
        <div className="brand-group">
          <div className="brand-logo-badge">🎓</div>
          <div>
            <span className="brand-title">{APP_NAME}</span>
            <span className="brand-tag">{SIH_EDITION}</span>
          </div>
        </div>

        <div className="navbar-status-badge">
          <span className="status-dot"></span>
          <span>System Initialized</span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
