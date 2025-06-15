export const config = {
  api: {
    bodyParser: false,
  },
};

import formidable from 'formidable';
import fs from 'fs';

export default async function handler(req, res) {
  const SUPABASE_URL = 'https://legghxaprgxcxbskvhgh.supabase.co';
  const SUPABASE_KEY = process.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlZ2doeGFwcmd4Y3hic2t2aGdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNjQ2NzksImV4cCI6MjA2NDg0MDY3OX0.d8T2APt1hvpgiFS4l_z0_LAOo3--XKQ0y95s_XxSaLw;

  const form = new formidable.IncomingForm({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Form parsing error' });

    const file = files.file;
    const email = fields.email;

    if (!file || !email) return res.status(400).json({ error: 'Missing file or email' });

    const fileBuffer = fs.readFileSync(file[0].filepath);
    const fileName = `avatars/${email}_${Date.now()}.jpg`;

    const response = await fetch(`${SUPABASE_URL}/storage/v1/object/${fileName}`, {
      method: 'POST',
      headers: {
        'Content-Type': file[0].mimetype,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'apikey': SUPABASE_KEY,
        'x-upsert': 'true',
      },
      body: fileBuffer
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(500).json({ error: error.message || 'Upload failed' });
    }

    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${fileName}`;
    res.status(200).json({ url: publicUrl });
  });
}
