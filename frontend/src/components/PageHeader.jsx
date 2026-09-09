import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../utils/constants";

export function PageHeader({
  title,
  subtitle,
  badge = null,
  backTo = ROUTES.DASHBOARD,
  backLabel = "Back to Dashboard",
  actions = null,
}) {
  const navigate = useNavigate();

  return (
    <div className="page-header-wrapper">
      <div className="page-header-breadcrumb">
        <button
          className="back-btn"
          onClick={() => navigate(backTo)}
          aria-label={backLabel}
        >
          <span className="back-arrow">←</span>
          <span>{backLabel}</span>
        </button>
      </div>

      <div className="page-header-main">
        <div className="page-header-title-group">
          <div className="page-header-title-row">
            <h1 className="page-title">{title}</h1>
            {badge && <span className="page-badge">{badge}</span>}
          </div>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>

        {actions && <div className="page-header-actions">{actions}</div>}
      </div>
    </div>
  );
}

export default PageHeader;
