import supabase from './db-client.js';
import { verifyAdmin } from './auth.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).single();
      if (error) throw error;
      return res.status(200).json(data);
    }

    const admin = await verifyAdmin(req);
    if (!admin) return res.status(401).json({ error: 'Unauthorized — admin access required' });

    if (req.method === 'PUT') {
      const { id, ...fields } = req.body;
      const { data, error } = await supabase.from('site_settings').update(fields).eq('id', 1).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('settings API error:', err);
    res.status(500).json({ error: err.message });
  }
}
