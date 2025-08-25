import { useState, useEffect } from "react";
import { Wifi, WifiOff, AlertCircle } from "lucide-react";

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Show initial notification if offline
    if (!navigator.onLine) {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!showNotification) return null;

  return (
    <div
      className={`fixed top-4 left-4 z-50 rounded-lg p-3 shadow-lg max-w-sm transition-all duration-300 ${
        isOnline
          ? "bg-green-100 border border-green-300"
          : "bg-orange-100 border border-orange-300"
      }`}
    >
      <div className="flex items-center gap-2">
        {isOnline ? (
          <Wifi className="w-5 h-5 text-green-600" />
        ) : (
          <WifiOff className="w-5 h-5 text-orange-600" />
        )}
        <div>
          <div
            className={`font-medium ${isOnline ? "text-green-800" : "text-orange-800"}`}
          >
            {isOnline ? "Back Online" : "Demo Mode"}
          </div>
          <div
            className={`text-sm ${isOnline ? "text-green-700" : "text-orange-700"}`}
          >
            {isOnline
              ? "Connection restored. All features available."
              : "App is running with demo data. All features still work!"}
          </div>
        </div>
      </div>
    </div>
  );
}
