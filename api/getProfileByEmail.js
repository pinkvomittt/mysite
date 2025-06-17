// api/getProfileByEmail.js
export default async function handler(req, res) {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  // Fetch from your Supabase REST endpoint
  const response = await fetch(
    `https://legghxaprgxcxbskvhgh.supabase.co/rest/v1/profiles?email=eq.${encodeURIComponent(email)}`,
    {
      headers: {
        apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlZ2doeGFwcmd4Y3hic2t2aGdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNjQ2NzksImV4cCI6MjA2NDg0MDY3OX0.d8T2APt1hvpgiFS4l_z0_LAOo3--XKQ0y95s_XxSaLw",
        Authorization: `Bearer YOUR_SUPABASE_ANON_KEY`,
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  if (!response.ok || !data.length) {
    return res.status(404).json({ error: "Profile not found" });
  }

  // Return the first (and only) matching profile record
  const profile = data[0];
  return res.status(200).json({ username: profile.username });
}
