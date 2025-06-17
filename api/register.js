import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email, password, username } = req.body;

  if (!email || !password || !username)
    return res.status(400).json({ error: "All fields are required" });

  try {
    const signupRes = await fetch("https://YOUR_PROJECT.supabase.co/auth/v1/signup", {
      method: "POST",
      headers: {
        apikey: "YOUR_SUPABASE_API_KEY",
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

    const insertProfile = await fetch("https://YOUR_PROJECT.supabase.co/rest/v1/profiles", {
      method: "POST",
      headers: {
        apikey: "YOUR_SUPABASE_API_KEY",
        Authorization: `Bearer ${YOUR_SERVICE_ROLE_KEY}`,
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

