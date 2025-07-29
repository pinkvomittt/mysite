export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email, password } = req.body;

  const SUPABASE_URL = "YOUR_SUPABASE_URL";
  const SUPABASE_ANON_KEY = "YOUR_ANON_KEY";

  try {
    const loginRes = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const loginData = await loginRes.json();
    if (!loginRes.ok) {
      return res.status(loginRes.status).json({ error: loginData.error_description || loginData.error });
    }

    const { user, access_token } = loginData;

    const profileRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=username&id=eq.${user.id}`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${access_token}`
      }
    });

    const profileData = await profileRes.json();
    const username = profileData[0]?.username;

    return res.status(200).json({ success: true, username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

