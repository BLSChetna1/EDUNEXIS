import React from "react";

export function Button({
  children,
  variant = "primary",
  size = "md",
  icon = null,
  iconPosition = "left",
  fullWidth = false,
  className = "",
  type = "button",
  onClick,
  disabled = false,
  ...props
}) {
  const classes = [
    "edunexis-btn",
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth ? "btn-full" : "",
    disabled ? "btn-disabled" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === "left" && <span className="btn-icon btn-icon-left">{icon}</span>}
      <span className="btn-content">{children}</span>
      {icon && iconPosition === "right" && <span className="btn-icon btn-icon-right">{icon}</span>}
    </button>
  );
}

export default Button;
