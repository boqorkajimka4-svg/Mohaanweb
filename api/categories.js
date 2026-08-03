import supabase from './db-client.js';
import { verifyAdmin } from './auth.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { slug } = req.query;
      if (slug) {
        const { data, error } = await supabase.from('categories').select('*').eq('slug', slug).single();
        if (error) throw error;
        return res.status(200).json(data);
      }
      const { data, error } = await supabase.from('categories').select('*').order('sort_order', { ascending: true });
      if (error) throw error;
      return res.status(200).json(data);
    }

    const admin = await verifyAdmin(req);
    if (!admin) return res.status(401).json({ error: 'Unauthorized — admin access required' });

    if (req.method === 'POST') {
      const { name, slug, description, image_url, sort_order } = req.body;
      const { data, error } = await supabase.from('categories')
        .insert({ name, slug, description, image_url, sort_order: sort_order || 0 })
        .select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    if (req.method === 'PUT') {
      const { id, ...fields } = req.body;
      const { data, error } = await supabase.from('categories').update(fields).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'DELETE') {
      const { id } = req.body;
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('categories API error:', err);
    res.status(500).json({ error: err.message });
  }
}
