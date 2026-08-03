import supabase from './db-client.js';
import { verifyAdmin } from './auth.js';

export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    const admin = await verifyAdmin(req);
    if (!admin) return res.status(401).json({ error: 'Unauthorized — admin access required' });

    if (req.method === 'POST') {
      const { fileName, fileBase64, contentType } = req.body;
      if (!fileName || !fileBase64) return res.status(400).json({ error: 'Missing file data' });
      const buffer = Buffer.from(fileBase64, 'base64');
      const safeName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const { error } = await supabase.storage.from('media').upload(safeName, buffer, {
        contentType: contentType || 'application/octet-stream', upsert: true,
      });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from('media').getPublicUrl(safeName);
      const url = urlData.publicUrl;
      await supabase.from('media').insert({ url, name: fileName, path: safeName, type: contentType || '' });
      return res.status(200).json({ url, path: safeName });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('upload API error:', err);
    res.status(500).json({ error: err.message });
  }
}
