import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    // Log input
    console.log('Login attempt:', email);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.log('Supabase login error:', error.message);
      return res.status(401).json({ error: 'Supabase login error: ' + error.message });
    }

    const user = data.user;
    console.log('User signed in:', user.id);

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      console.log('Profile error:', profileError);
      return res.status(404).json({ error: 'Profile not found for user ID ' + user.id });
    }

    return res.status(200).json({ username: profile.username });

  } catch (err) {
    console.log('Unexpected server error:', err.message);
    // ⚠️ Return the actual error so you can see it in the browser
    return res.status(500).json({ error: 'Server crash: ' + err.message });
  }
}

