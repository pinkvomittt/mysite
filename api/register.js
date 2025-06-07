
---

### 💾 3. Paste This Code In:

```js
export const config = {
api: {
 bodyParser: true,
},
};

export default async function handler(req, res) {
if (req.method !== "POST") {
 return res.status(405).json({ error: "Method not allowed" });
}

const { email, password } = req.body;

if (!email || !password) {
 return res.status(400).json({ error: "Email and password are required" });
}

try {
 const response = await fetch("https://legghxaprgxcxbskvhgh.supabase.co/auth/v1/signup", {
   method: "POST",
   headers: {
     apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlZ2doeGFwcmd4Y3hic2t2aGdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNjQ2NzksImV4cCI6MjA2NDg0MDY3OX0.d8T2APt1hvpgiFS4l_z0_LAOo3--XKQ0y95s_XxSaLw
",
     "Content-Type": "application/json"
   },
   body: JSON.stringify({ email, password })
 });

 const data = await response.json();

 if (!response.ok) {
   return res.status(response.status).json({ error: data.error_description || data.error });
 }

 res.status(200).json(data);
} catch (err) {
 console.error("Error in /api/register:", err);
 res.status(500).json({ error: "Internal Server Error" });
}
}
