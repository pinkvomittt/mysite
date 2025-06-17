export default async function handler(req, res) {
  console.log("➡️ /api/login called, method:", req.method);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, password } = req.body;
    console.log("📩 Received payload:", { email, password: password ? "******" : null });

    if (!email || !password) {
      console.log("❗ Missing email or password");
      return res.status(400).json({ error: "Email and password are required" });
    }

    const response = await fetch(
      "https://legghxaprgxcxbskvhgh.supabase.co/auth/v1/token?grant_type=password",
      {
        method: "POST",
        headers: {
          apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlZ2doeGFwcmd4Y3hic2t2aGdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNjQ2NzksImV4cCI6MjA2NDg0MDY3OX0.d8T2APt1hvpgiFS4l_z0_LAOo3--XKQ0y95s_XxSaLw",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await response.json();
    console.log("🔁 Supabase response (status " + response.status + "):", data);

    if (!response.ok) {
      console.log("❌ Login failed:", data.error_description || data.error);
      return res.status(response.status).json({ error: data.error_description || data.error });
    }

    console.log("✅ Login successful for", email);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("🔥 Unexpected error in /api/login:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
