import { useState, useEffect } from "react";
import { Coffee, CheckCircle, X, AlertCircle, Wifi, WifiOff } from "lucide-react";
import { checkSupabaseConnection } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

export default function SupabaseStatus() {
  const [showNotice, setShowNotice] = useState(true);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  
  const { connectionMode } = useAuth();

  useEffect(() => {
    const checkConnection = async () => {
      setIsChecking(true);
      try {
        const connected = await checkSupabaseConnection();
        setIsConnected(connected);
      } catch (error) {
        setIsConnected(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkConnection();
    
    // Check connection status every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const hideNotice = () => {
    setShowNotice(false);
  };

  if (!showNotice || isChecking) return null;

  const isOnline = connectionMode === 'online' && isConnected;

  return (
    <div className={`fixed top-4 left-4 z-50 border rounded-lg p-4 shadow-lg max-w-sm ${
      isOnline 
        ? 'bg-tea-green-50 border-tea-green-200' 
        : 'bg-tea-pink-50 border-tea-pink-200'
    }`}>
      <div className="flex items-start gap-3">
        {isOnline ? (
          <Wifi className="w-5 h-5 text-tea-green-600 mt-0.5 flex-shrink-0" />
        ) : (
          <Coffee className="w-5 h-5 text-tea-pink-600 mt-0.5 flex-shrink-0" />
        )}
        <div className="flex-1">
          <div className={`font-medium mb-1 ${isOnline ? 'text-tea-green-800' : 'text-tea-pink-800'}`}>
            {isOnline ? '🟢 Connected to Database' : '☕ Tea Time Demo Mode'}
          </div>
          <div className={`text-sm ${isOnline ? 'text-tea-green-700' : 'text-tea-pink-700'}`}>
            {isOnline 
              ? 'Real-time database is working perfectly!'
              : 'App is working smoothly with sample data. All features available!'
            }
          </div>
        </div>
        <button
          onClick={hideNotice}
          className="text-gray-600 hover:text-gray-800 ml-2"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
