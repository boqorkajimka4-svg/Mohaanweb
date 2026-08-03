import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { api } from '../../lib/api';
import type { Product, Category } from '../../lib/types';
import { PageHead, Card, Btn, Field, Input, Textarea, Select } from '../../components/admin/ui';
import ImageInput from '../../components/admin/ImageInput';
import Spinner from '../../components/Spinner';

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const empty = { title: '', slug: '', description: '', price: 0, category_id: '', image_url: '', gallery: '', gumroad_url: '', featured: false, tags: '', meta_title: '', meta_description: '' };

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<any>(empty);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([api.products.list(), api.categories.list()])
      .then(([p, c]) => { setProducts(p); setCategories(c); })
      .catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openNew = () => { setEditId(null); setForm(empty); setModal(true); };
  const openEdit = (p: Product) => {
    setEditId(p.id);
    setForm({ ...p, category_id: p.category_id ?? '', gallery: (p.gallery || []).join(', '), tags: (p.tags || []).join(', ') });
    setModal(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      slug: form.slug || slugify(form.title),
      price: Number(form.price) || 0,
      category_id: form.category_id ? Number(form.category_id) : null,
      gallery: form.gallery ? form.gallery.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
      tags: form.tags ? form.tags.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
    };
    try {
      if (editId) await api.products.update({ id: editId, ...payload });
      else await api.products.create(payload);
      setModal(false); load();
    } catch (err: any) { alert(err.message); }
    finally { setSaving(false); }
  };

  const del = async (id: number) => {
    if (!confirm('Delete this product?')) return;
    await api.products.remove(id); load();
  };

  return (
    <div>
      <PageHead title="Products" subtitle="Manage your digital products." action={<Btn onClick={openNew}><span className="flex items-center gap-2"><Plus size={16} /> New Product</span></Btn>} />
      {loading ? <Spinner /> : (
        <div className="grid gap-4">
          {products.length === 0 && <Card><p className="text-slate-400">No products yet. Create your first one.</p></Card>}
          {products.map((p) => (
            <Card key={p.id} className="flex items-center gap-4">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-800">
                {p.image_url && <img src={p.image_url} alt="" className="h-full w-full object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate font-semibold text-white">{p.title}</h3>
                  {p.featured && <span className="rounded bg-sky-500/20 px-2 py-0.5 text-xs text-sky-300">Featured</span>}
                </div>
                <p className="truncate text-sm text-slate-400">${Number(p.price).toFixed(2)} · {p.slug}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(p)} className="rounded-lg bg-white/5 p-2.5 text-slate-300 hover:bg-white/10"><Pencil size={16} /></button>
                <button onClick={() => del(p.id)} className="rounded-lg bg-red-500/10 p-2.5 text-red-400 hover:bg-red-500/20"><Trash2 size={16} /></button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur">
          <form onSubmit={save} className="my-8 w-full max-w-2xl space-y-4 rounded-2xl border border-white/10 bg-[#0b0e1a] p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">{editId ? 'Edit' : 'New'} Product</h2>
              <button type="button" onClick={() => setModal(false)} className="text-slate-400 hover:text-white"><X size={22} /></button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Title"><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value, slug: editId ? form.slug : slugify(e.target.value) })} required /></Field>
              <Field label="Slug"><Input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} required /></Field>
            </div>
            <Field label="Description"><Textarea rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Price (USD)"><Input type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} /></Field>
              <Field label="Category">
                <Select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })}>
                  <option value="">— None —</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </Select>
              </Field>
            </div>
            <Field label="Main Image"><ImageInput value={form.image_url} onChange={url => setForm({ ...form, image_url: url })} /></Field>
            <Field label="Gallery Image URLs (comma separated)"><Input value={form.gallery} onChange={e => setForm({ ...form, gallery: e.target.value })} /></Field>
            <Field label="Gumroad Purchase URL"><Input value={form.gumroad_url} onChange={e => setForm({ ...form, gumroad_url: e.target.value })} placeholder="https://gumroad.com/l/..." /></Field>
            <Field label="Tags (comma separated)"><Input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Meta Title (SEO)"><Input value={form.meta_title} onChange={e => setForm({ ...form, meta_title: e.target.value })} /></Field>
              <Field label="Meta Description (SEO)"><Input value={form.meta_description} onChange={e => setForm({ ...form, meta_description: e.target.value })} /></Field>
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="h-4 w-4 accent-sky-500" /> Featured product
            </label>
            <div className="flex justify-end gap-3 pt-2">
              <Btn type="button" variant="ghost" onClick={() => setModal(false)}>Cancel</Btn>
              <Btn type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Product'}</Btn>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
