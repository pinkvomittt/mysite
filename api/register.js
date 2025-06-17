import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email, password, username } = req.body;

  if (!email || !password || !username)
    return res.status(400).json({ error: "All fields are required" });

  try {
    const signupRes = await fetch("https://legghxaprgxcxbskvhgh.supabase.co/auth/v1/signup", {
      method: "POST",
      headers: {
        apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlZ2doeGFwcmd4Y3hic2t2aGdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNjQ2NzksImV4cCI6MjA2NDg0MDY3OX0.d8T2APt1hvpgiFS4l_z0_LAOo3--XKQ0y95s_XxSaLw",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password }),
    });

    const signupData = await signupRes.json();

    if (!signupRes.ok) {
      return res.status(signupRes.status).json({ error: signupData.error_description || signupData.error });
    }

    const user_id = signupData.user?.id;
    if (!user_id) return res.status(500).json({ error: "User ID not returned" });

    const insertProfile = await fetch("https://legghxaprgxcxbskvhgh.supabase.co/rest/v1/profiles", {
      method: "POST",
      headers: {
        apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlZ2doeGFwcmd4Y3hic2t2aGdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNjQ2NzksImV4cCI6MjA2NDg0MDY3OX0.d8T2APt1hvpgiFS4l_z0_LAOo3--XKQ0y95s_XxSaLw",
        Authorization: `Bearer ${eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlZ2doeGFwcmd4Y3hic2t2aGdoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTI2NDY3OSwiZXhwIjoyMDY0ODQwNjc5fQ.0xvR0B85ylHoZ1yh6CJHsqj_rPG9k0LIeUCOGbM6Iho}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal"
      },
      body: JSON.stringify({ id: user_id, email, username }),
    });

    if (!insertProfile.ok) {
      return res.status(insertProfile.status).json({ error: "Failed to create profile" });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

