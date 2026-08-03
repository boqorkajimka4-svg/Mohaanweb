import supabase from './db-client.js';
import { verifyAdmin } from './auth.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { all } = req.query;
      let query = supabase.from('nav_items').select('*').order('sort_order', { ascending: true });
      if (all !== 'true') query = query.eq('active', true);
      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(all === 'true' ? data : data.map(i => ({ label: i.label, url: i.url })));
    }

    const admin = await verifyAdmin(req);
    if (!admin) return res.status(401).json({ error: 'Unauthorized — admin access required' });

    if (req.method === 'POST') {
      const { label, url, sort_order, active } = req.body;
      const { data, error } = await supabase.from('nav_items')
        .insert({ label, url, sort_order: sort_order || 0, active: active !== false }).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    if (req.method === 'PUT') {
      const { id, ...fields } = req.body;
      const { data, error } = await supabase.from('nav_items').update(fields).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'DELETE') {
      const { id } = req.body;
      const { error } = await supabase.from('nav_items').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('nav API error:', err);
    res.status(500).json({ error: err.message });
  }
}
