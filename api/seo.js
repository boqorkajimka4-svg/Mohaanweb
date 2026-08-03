import supabase from './db-client.js';
import { verifyAdmin } from './auth.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { page } = req.query;
      if (page) {
        const { data, error } = await supabase.from('seo_meta').select('*').eq('page', page).maybeSingle();
        if (error) throw error;
        return res.status(200).json(data || null);
      }
      const { data, error } = await supabase.from('seo_meta').select('*').order('page', { ascending: true });
      if (error) throw error;
      return res.status(200).json(data);
    }

    const admin = await verifyAdmin(req);
    if (!admin) return res.status(401).json({ error: 'Unauthorized — admin access required' });

    if (req.method === 'POST' || req.method === 'PUT') {
      const b = req.body;
      const { data: existing } = await supabase.from('seo_meta').select('id').eq('page', b.page).maybeSingle();
      let result;
      if (existing) {
        result = await supabase.from('seo_meta').update({ title: b.title, description: b.description, keywords: b.keywords, og_image: b.og_image }).eq('id', existing.id).select().single();
      } else {
        result = await supabase.from('seo_meta').insert({ page: b.page, title: b.title, description: b.description, keywords: b.keywords, og_image: b.og_image }).select().single();
      }
      if (result.error) throw result.error;
      return res.status(200).json(result.data);
    }
    if (req.method === 'DELETE') {
      const { id } = req.body;
      const { error } = await supabase.from('seo_meta').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('seo API error:', err);
    res.status(500).json({ error: err.message });
  }
}
