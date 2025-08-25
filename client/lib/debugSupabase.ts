// Supabase connection debugger
export const debugSupabaseConnection = async () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  console.log("🔍 SUPABASE CONNECTION DEBUG");
  console.log("================================");

  // 1. Check environment variables
  console.log("1. Environment Variables:");
  console.log("   VITE_SUPABASE_URL:", supabaseUrl ? "✅ Set" : "❌ Missing");
  console.log(
    "   VITE_SUPABASE_ANON_KEY:",
    supabaseKey ? "✅ Set" : "❌ Missing",
  );

  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing environment variables!");
    return false;
  }

  // 2. Check URL format
  console.log("\n2. URL Validation:");
  console.log("   URL:", supabaseUrl);

  if (
    !supabaseUrl.startsWith("https://") ||
    !supabaseUrl.includes(".supabase.co")
  ) {
    console.error("❌ Invalid Supabase URL format!");
    return false;
  }
  console.log("   URL format: ✅ Valid");

  // 3. Test basic connectivity
  console.log("\n3. Basic Connectivity Test:");
  try {
    const response = await fetch(supabaseUrl, {
      method: "GET",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    });

    console.log("   HTTP Status:", response.status);
    console.log("   Response OK:", response.ok ? "✅" : "❌");

    if (response.ok) {
      console.log("   Basic connectivity: ✅ Success");
    } else {
      console.error("   Basic connectivity: ❌ Failed");
      console.log(
        "   Response headers:",
        Object.fromEntries(response.headers.entries()),
      );
    }
  } catch (error) {
    console.error("   Basic connectivity: ❌ Network Error");
    console.error("   Error:", error);
    return false;
  }

  // 4. Test auth endpoint specifically
  console.log("\n4. Auth Endpoint Test:");
  try {
    const authUrl = `${supabaseUrl}/auth/v1/user`;
    const authResponse = await fetch(authUrl, {
      method: "GET",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    });

    console.log("   Auth endpoint status:", authResponse.status);
    console.log("   Auth endpoint OK:", authResponse.ok ? "✅" : "❌");

    if (authResponse.status === 401) {
      console.log(
        "   Auth endpoint: ✅ Reachable (401 is expected without valid token)",
      );
    } else if (authResponse.ok) {
      console.log("   Auth endpoint: ✅ Success");
    }
  } catch (error) {
    console.error("   Auth endpoint: ❌ Failed");
    console.error("   Error:", error);
    return false;
  }

  // 5. Test REST API endpoint
  console.log("\n5. REST API Test:");
  try {
    const restUrl = `${supabaseUrl}/rest/v1/`;
    const restResponse = await fetch(restUrl, {
      method: "GET",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    });

    console.log("   REST API status:", restResponse.status);
    console.log("   REST API OK:", restResponse.ok ? "✅" : "❌");
  } catch (error) {
    console.error("   REST API: ❌ Failed");
    console.error("   Error:", error);
  }

  console.log("\n🏁 Debug Complete");
  console.log("================================");

  return true;
};

// Test if we can reach the Supabase instance at all
export const testSupabaseHealth = async (): Promise<boolean> => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials");
    return false;
  }

  try {
    // Simple health check
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: "HEAD",
      headers: {
        apikey: supabaseKey,
      },
    });

    return response.status < 500; // Accept 4xx as "reachable"
  } catch (error) {
    console.error("Supabase health check failed:", error);
    return false;
  }
};
