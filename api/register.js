import { createClient } from '@supabase/supabase-js'

export const config = {
  api: {
    bodyParser: true,
  },
}

// Initialize Supabase client with Service Role key (for server-side operations)
const supabaseUrl = "https://legghxaprgxcxbskvhgh.supabase.co"
const supabaseServiceKey = process.env."eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlZ2doeGFwcmd4Y3hic2t2aGdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNjQ2NzksImV4cCI6MjA2NDg0MDY3OX0.d8T2APt1hvpgiFS4l_z0_LAOo3--XKQ0y95s_XxSaLw" // Set this in your env securely
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export default async function handler(req, res) {
  console.log("Incoming request method:", req.method)

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const { email, password, username } = req.body
    console.log("Email:", email)
    console.log("Password:", password)
    console.log("Username:", username)

    if (!email || !password || !username) {
      return res.status(400).json({ error: "Email, password and username are required" })
    }

    // 1. Create user in Supabase Auth
    const { user, error: signUpError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // optional: skip confirmation step
    })

    if (signUpError) {
      console.error("Sign up error:", signUpError)
      return res.status(400).json({ error: signUpError.message })
    }

    // 2. Insert user profile into profiles table
    const { error: profileError } = await supabase
      .from("profiles")
      .insert([{ id: user.id, username }])

    if (profileError) {
      console.error("Profile insert error:", profileError)
      return res.status(400).json({ error: profileError.message })
    }

    console.log("User registered and profile created:", user)
    res.status(200).json({ userId: user.id, email: user.email, username })
  } catch (err) {
    console.error("Unexpected error in /api/register:", err)
    res.status(500).json({ error: "Internal Server Error" })
  }
}

