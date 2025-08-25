import { useState, useEffect } from "react";
import { WifiOff } from "lucide-react";
import { checkSupabaseConnection } from "@/lib/supabase";

export default function ConnectionStatus() {
  const [isConnected, setIsConnected] = useState(true);
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      const connected = await checkSupabaseConnection();
      setIsConnected(connected);

      if (!connected) {
        setShowStatus(true);
        // Auto-hide after 5 seconds
        setTimeout(() => setShowStatus(false), 5000);
      } else {
        setShowStatus(false);
      }
    };

    checkConnection();

    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);

    return () => clearInterval(interval);
  }, []);

  if (!showStatus || isConnected) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-yellow-100 border border-yellow-300 rounded-lg p-3 shadow-lg max-w-sm">
      <div className="flex items-center gap-2">
        <WifiOff className="w-5 h-5 text-yellow-600" />
        <div>
          <div className="font-medium text-yellow-800">Connection Issue</div>
          <div className="text-sm text-yellow-700">
            Some features may not work. Please check your connection.
          </div>
        </div>
      </div>
    </div>
  );
}
