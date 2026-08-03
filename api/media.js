import supabase from './db-client.js';
import { verifyAdmin } from './auth.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('media').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json(data);
    }

    const admin = await verifyAdmin(req);
    if (!admin) return res.status(401).json({ error: 'Unauthorized — admin access required' });

    if (req.method === 'DELETE') {
      const { id, path } = req.body;
      if (path) { await supabase.storage.from('media').remove([path]); }
      const { error } = await supabase.from('media').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('media API error:', err);
    res.status(500).json({ error: err.message });
  }
}
