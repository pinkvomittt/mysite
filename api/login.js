import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.https://legghxaprgxcxbskvhgh.supabase.co,
  process.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlZ2doeGFwcmd4Y3hic2t2aGdoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTI2NDY3OSwiZXhwIjoyMDY0ODQwNjc5fQ.0xvR0B85ylHoZ1yh6CJHsqj_rPG9k0LIeUCOGbM6Iho // Do NOT expose this in frontend!
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) return res.status(401).json({ error: error.message });

    const user = data.user;

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    return res.status(200).json({ username: profile.username });

  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

