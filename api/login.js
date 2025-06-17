export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const loginRes = await fetch("https://legghxaprgxcxbskvhgh.supabase.co.supabase.co/auth/v1/token?grant_type=password", {
      method: "POST",
      headers: {
        apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlZ2doeGFwcmd4Y3hic2t2aGdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNjQ2NzksImV4cCI6MjA2NDg0MDY3OX0.d8T2APt1hvpgiFS4l_z0_LAOo3--XKQ0y95s_XxSaLw",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password }),
    });

    const loginData = await loginRes.json();

    if (!loginRes.ok) {
      return res.status(loginRes.status).json({ error: loginData.error_description || loginData.error });
    }

    const { access_token, user } = loginData;
    const userId = user?.id;

    // Now get the user's profile
    const profileRes = await fetch(`https://legghxaprgxcxbskvhgh.supabase.co/rest/v1/profiles?select=username&user_id=eq.${userId}`, {
      headers: {
        apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlZ2doeGFwcmd4Y3hic2t2aGdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNjQ2NzksImV4cCI6MjA2NDg0MDY3OX0.d8T2APt1hvpgiFS4l_z0_LAOo3--XKQ0y95s_XxSaLw",
        Authorization: `Bearer ${access_token}`
      }
    });

    const profileData = await profileRes.json();

    if (!profileRes.ok || !profileData.length || !profileData[0].username) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const username = profileData[0].username;
    return res.status(200).json({ success: true, username });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
