import React from "react";
import { useNavigate } from "react-router-dom";

export function FeatureCard({
  icon,
  badge,
  title,
  description,
  to,
  badgeColor = "green",
  highlight = false,
  className = "",
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    }
  };

  return (
    <div
      className={`feature-card ${highlight ? "feature-card-highlight" : ""} ${className}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className="card-top-row">
        <div className="feature-icon-wrapper">{icon}</div>
        {badge && (
          <span className={`feature-badge badge-${badgeColor}`}>
            {badge}
          </span>
        )}
      </div>

      <div className="card-body">
        <h3 className="feature-title">{title}</h3>
        <p className="feature-description">{description}</p>
      </div>

      <div className="card-footer">
        <span className="card-action-text">Open Feature</span>
        <span className="card-arrow" aria-hidden="true">→</span>
      </div>
    </div>
  );
}

export default FeatureCard;
