export default async function handler(req, res) {
  const { username } = req.query;

  const SUPABASE_URL = "YOUR_SUPABASE_URL";
  const SUPABASE_ANON_KEY = "YOUR_ANON_KEY";

  const profileRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles?username=eq.${username}`, {
    headers: {
      apikey: SUPABASE_ANON_KEY
    }
  });

  const profile = await profileRes.json();

  if (!profile.length) return res.status(404).send("User not found");

  res.setHeader("Content-Type", "text/html");
  res.send(`<h1>Profile for ${username}</h1>`);
}
