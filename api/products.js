import supabase from './db-client.js';
import { verifyAdmin } from './auth.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { slug, category, featured, search, id, limit } = req.query;
      if (slug) {
        const { data, error } = await supabase.from('products').select('*').eq('slug', slug).single();
        if (error) throw error;
        return res.status(200).json(data);
      }
      if (id) {
        const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
        if (error) throw error;
        return res.status(200).json(data);
      }
      let query = supabase.from('products').select('*').order('created_at', { ascending: false });
      if (category) query = query.eq('category_id', category);
      if (featured === 'true') query = query.eq('featured', true);
      if (search) query = query.ilike('title', `%${search}%`);
      if (limit) query = query.limit(parseInt(limit));
      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data);
    }

    const admin = await verifyAdmin(req);
    if (!admin) return res.status(401).json({ error: 'Unauthorized — admin access required' });

    if (req.method === 'POST') {
      const body = req.body;
      const { data, error } = await supabase.from('products').insert({
        title: body.title, slug: body.slug, description: body.description,
        price: body.price || 0, category_id: body.category_id || null,
        image_url: body.image_url, gallery: body.gallery || [],
        gumroad_url: body.gumroad_url, featured: body.featured || false,
        tags: body.tags || [], meta_title: body.meta_title, meta_description: body.meta_description,
      }).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    if (req.method === 'PUT') {
      const { id, ...fields } = req.body;
      const { data, error } = await supabase.from('products').update(fields).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'DELETE') {
      const { id } = req.body;
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('products API error:', err);
    res.status(500).json({ error: err.message });
  }
}
