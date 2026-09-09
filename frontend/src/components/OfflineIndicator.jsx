import React from "react";
import { useOfflineStatus } from "../hooks/useOfflineStatus";

export function OfflineIndicator({ compact = false, showLabel = true, className = "" }) {
  const { isOnline } = useOfflineStatus();

  return (
    <div
      className={`offline-indicator-badge ${isOnline ? "is-online" : "is-offline"} ${className}`}
      title={
        isOnline
          ? "Connected to cloud server • Real-time AI services available"
          : "Offline Mode Active • Using synchronized local classroom resources"
      }
      aria-label={isOnline ? "System Online" : "System Offline"}
    >
      <span className="indicator-dot"></span>
      {showLabel && (
        <span className="indicator-text">
          {isOnline ? (compact ? "Online" : "🟢 Online") : (compact ? "Offline" : "🟠 Offline Mode")}
        </span>
      )}
    </div>
  );
}

export default OfflineIndicator;
