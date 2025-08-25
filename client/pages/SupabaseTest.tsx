import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  debugSupabaseConnection,
  testSupabaseHealth,
} from "@/lib/debugSupabase";
import { supabase } from "@/lib/supabase";

export default function SupabaseTest() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (message: string) => {
    setTestResults((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  const runHealthCheck = async () => {
    setLoading(true);
    addResult("🔍 Starting health check...");

    try {
      const isHealthy = await testSupabaseHealth();
      addResult(
        isHealthy ? "✅ Health check: PASSED" : "❌ Health check: FAILED",
      );
    } catch (error) {
      addResult(`❌ Health check error: ${error}`);
    }

    setLoading(false);
  };

  const runFullDebug = async () => {
    setLoading(true);
    addResult("🔍 Running full debug...");

    try {
      await debugSupabaseConnection();
      addResult("✅ Full debug completed (check console for details)");
    } catch (error) {
      addResult(`❌ Debug error: ${error}`);
    }

    setLoading(false);
  };

  const testAuth = async () => {
    setLoading(true);
    addResult("🔍 Testing auth...");

    try {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        addResult(`⚠️ Auth response: ${error.message}`);
      } else {
        addResult("✅ Auth call succeeded");
        addResult(`User: ${data.user ? "Logged in" : "Not logged in"}`);
      }
    } catch (error) {
      addResult(`❌ Auth error: ${error}`);
    }

    setLoading(false);
  };

  const testDatabase = async () => {
    setLoading(true);
    addResult("🔍 Testing database...");

    try {
      const { data, error } = await supabase
        .from("stories")
        .select("count", { count: "exact", head: true });

      if (error) {
        addResult(`⚠️ Database response: ${error.message}`);
      } else {
        addResult("✅ Database call succeeded");
      }
    } catch (error) {
      addResult(`❌ Database error: ${error}`);
    }

    setLoading(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-tea-pink-50 via-tea-green-50 to-tea-mint-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-tea-neutral-800">
              🔧 Supabase Connection Debugger
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-tea-neutral-600">
                Use these tools to debug Supabase connection issues. Check the
                browser console for detailed logs.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={runHealthCheck}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Health Check
                </Button>

                <Button
                  onClick={runFullDebug}
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Full Debug
                </Button>

                <Button
                  onClick={testAuth}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Test Auth
                </Button>

                <Button
                  onClick={testDatabase}
                  disabled={loading}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Test Database
                </Button>

                <Button
                  onClick={clearResults}
                  variant="outline"
                  disabled={loading}
                >
                  Clear Results
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-tea-neutral-800">
              Test Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {testResults.length === 0 ? (
              <p className="text-tea-neutral-500 italic">
                Run a test to see results here...
              </p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className="text-sm font-mono bg-tea-neutral-100 p-2 rounded"
                  >
                    {result}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg text-tea-neutral-800">
              Environment Variables
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div>
                <strong>VITE_SUPABASE_URL:</strong>{" "}
                {import.meta.env.VITE_SUPABASE_URL
                  ? `✅ ${import.meta.env.VITE_SUPABASE_URL}`
                  : "❌ Not set"}
              </div>
              <div>
                <strong>VITE_SUPABASE_ANON_KEY:</strong>{" "}
                {import.meta.env.VITE_SUPABASE_ANON_KEY
                  ? `✅ ${import.meta.env.VITE_SUPABASE_ANON_KEY.substring(0, 20)}...`
                  : "❌ Not set"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
