export default async function handler(req, res) {
  const { email } = req.query;

  if (!email) return res.status(400).json({ error: 'Missing email' });

  const SUPABASE_URL = 'https://legghxaprgxcxbskvhgh.supabase.co';
  const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?email=eq.${encodeURIComponent(email)}&select=username,bio,profile_pic_url,bg_color`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      }
    );

    const data = await response.json();
    if (!data || data.length === 0) return res.status(404).json({ error: 'User not found' });

    res.status(200).json(data[0]);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
