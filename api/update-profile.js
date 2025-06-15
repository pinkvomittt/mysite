export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, username, bio, profile_pic_url, bg_color } = req.body;
  if (!email) return res.status(400).json({ error: 'Missing email' });

  const SUPABASE_URL = 'https://legghxaprgxcxbskvhgh.supabase.co';
  const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/profiles?email=eq.${encodeURIComponent(email)}`, {
      method: 'PATCH',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify({ username, bio, profile_pic_url, bg_color }),
    });

    const data = await response.json();
    if (!response.ok) return res.status(500).json({ error: data.message || 'Failed to update' });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
