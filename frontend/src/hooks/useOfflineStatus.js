/**
 * Custom Hook: useOfflineStatus
 * Listens for browser online and offline events and reports current connectivity.
 */

import { useState, useEffect } from "react";

export function useOfflineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" && typeof navigator.onLine === "boolean"
      ? navigator.onLine
      : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return {
    isOnline,
    isOffline: !isOnline,
    statusText: isOnline ? "Online" : "Offline Mode",
    statusBadge: isOnline ? "🟢 Online" : "🟠 Offline Mode",
  };
}

export default useOfflineStatus;
