import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  console.log(`🔁 [login] HTTP ${req.method} Request Received`);

  if (req.method !== 'POST') {
    console.log('❌ Method Not Allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let email, password;
  try {
    ({ email, password } = req.body);
    console.log('🧾 Payload:', { email, password: password ? '***' : null });
  } catch (e) {
    console.error('📥 Invalid JSON body:', e.message);
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  if (!email || !password) {
    console.log('❗ Missing Fields:', { email, password });
    return res.status(400).json({ error: 'Missing email or password' });
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error('🔐 Supabase auth error:', error.message);
      return res.status(401).json({ error: error.message });
    }

    const user = data.user;
    console.log('✅ Supabase login success:', user.id);

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      console.error('👤 Profile lookup failed:', profileError);
      return res.status(404).json({ error: 'Profile not found' });
    }

    console.log('🎉 Found username:', profile.username);
    return res.status(200).json({ username: profile.username });

  } catch (err) {
    console.error('💥 Server error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

