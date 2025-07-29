export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email, password, username } = req.body;

  const SUPABASE_URL = "YOUR_SUPABASE_URL";
  const SUPABASE_ANON_KEY = "YOUR_ANON_KEY";
  const SUPABASE_SERVICE_ROLE_KEY = "YOUR_SERVICE_ROLE_KEY";

  try {
    const signupRes = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const signupData = await signupRes.json();
    if (!signupRes.ok) {
      return res.status(signupRes.status).json({ error: signupData.error_description || signupData.error });
    }

    const user_id = signupData.user.id;

    const insertProfile = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id: user_id, email, username })
    });

    if (!insertProfile.ok) {
      const errorText = await insertProfile.text();
      return res.status(insertProfile.status).json({ error: errorText });
    }

    return res.status(200).json({ success: true, username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

