export default async function handler(req, res) {
  const { username } = req.query;

  const SUPABASE_URL = "https://legghxaprgxcxbskvhgh.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlZ2doeGFwcmd4Y3hic2t2aGdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNjQ2NzksImV4cCI6MjA2NDg0MDY3OX0.d8T2APt1hvpgiFS4l_z0_LAOo3--XKQ0y95s_XxSaLw";

  try {
    const profileRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles?username=eq.${username}&select=*`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    const profileData = await profileRes.json();

    if (!profileRes.ok || profileData.length === 0) {
      return res.status(404).send("User not found");
    }

    const profile = profileData[0];

    res.setHeader("Content-Type", "text/html");
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${profile.username}'s Profile</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; background: #ffe6fa; text-align: center; }
          h1 { color: hotpink; }
        </style>
      </head>
      <body>
        <h1>${profile.username}'s Profile 🌸</h1>
        <p>Email: ${profile.email}</p>
        <p>User ID: ${profile.id}</p>
      </body>
      </html>
    `);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).send("Internal Server Error");
  }
}
