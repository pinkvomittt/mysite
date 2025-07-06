export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const SUPABASE_URL = "https://legghxaprgxcxbskvhgh.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlZ2doeGFwcmd4Y3hic2t2aGdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNjQ2NzksImV4cCI6MjA2NDg0MDY3OX0.d8T2APt1hvpgiFS4l_z0_LAOo3--XKQ0y95s_XxSaLw";
  const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlZ2doeGFwcmd4Y3hic2t2aGdoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTI2NDY3OSwiZXhwIjoyMDY0ODQwNjc5fQ.0xvR0B85ylHoZ1yh6CJHsqj_rPG9k0LIeUCOGbM6Iho";

  try {
    // STEP 1: Create user in Supabase Auth
    const signupRes = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const signupData = await signupRes.json();
    console.log("🔐 AUTH RESPONSE:", signupData);

    if (!signupRes.ok) {
      return res.status(signupRes.status).json({ error: signupData.error_description || signupData.error });
    }

    const userId = signupData.user?.id;
    if (!userId) {
      return res.status(500).json({ error: "User ID not returned" });
    }

    // STEP 2: Insert into profiles table
    const profileRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal"
      },
      body: JSON.stringify({
        id: userId,
        email,
        username
      })
    });

    const profileText = await profileRes.text();
    console.log("📄 PROFILE RESPONSE:", profileRes.status, profileText);

    if (!profileRes.ok) {
      return res.status(profileRes.status).json({ error: "Failed to create profile" });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("🔥 REGISTER ERROR:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
