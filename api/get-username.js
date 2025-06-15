export default async function handler(req, res) {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Missing email' });
  }

  const SUPABASE_URL = 'https://legghxaprgxcxbskvhgh.supabase.co';
  const SUPABASE_KEY = process.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlZ2doeGFwcmd4Y3hic2t2aGdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNjQ2NzksImV4cCI6MjA2NDg0MDY3OX0.d8T2APt1hvpgiFS4l_z0_LAOo3--XKQ0y95s_XxSaLw; // 🔒 Use .env or Vercel Env Vars

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?email=eq.${encodeURIComponent(email)}&select=username`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      }
    );

    const data = await response.json();

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    if (!data[0].username) {
      return res.status(404).json({ error: 'Username not set yet' });
    }

    res.status(200).json({ username: data[0].username });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
