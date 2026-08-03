import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { api } from '../../lib/api';
import type { Category } from '../../lib/types';
import { PageHead, Card, Btn, Field, Input, Textarea } from '../../components/admin/ui';
import ImageInput from '../../components/admin/ImageInput';
import Spinner from '../../components/Spinner';

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const empty = { name: '', slug: '', description: '', image_url: '', sort_order: 0 };

export default function AdminCategories() {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<any>(empty);
  const [saving, setSaving] = useState(false);

  const load = () => { setLoading(true); api.categories.list().then(setItems).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(load, []);

  const openNew = () => { setEditId(null); setForm(empty); setModal(true); };
  const openEdit = (c: Category) => { setEditId(c.id); setForm(c); setModal(true); };

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const payload = { ...form, slug: form.slug || slugify(form.name), sort_order: Number(form.sort_order) || 0 };
    try {
      if (editId) await api.categories.update({ id: editId, ...payload });
      else await api.categories.create(payload);
      setModal(false); load();
    } catch (err: any) { alert(err.message); } finally { setSaving(false); }
  };
  const del = async (id: number) => { if (!confirm('Delete category?')) return; await api.categories.remove(id); load(); };

  return (
    <div>
      <PageHead title="Categories" subtitle="Organize your products." action={<Btn onClick={openNew}><span className="flex items-center gap-2"><Plus size={16} /> New Category</span></Btn>} />
      {loading ? <Spinner /> : (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.length === 0 && <Card><p className="text-slate-400">No categories yet.</p></Card>}
          {items.map((c) => (
            <Card key={c.id} className="flex items-center gap-4">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-800">{c.image_url && <img src={c.image_url} alt="" className="h-full w-full object-cover" />}</div>
              <div className="min-w-0 flex-1"><h3 className="truncate font-semibold text-white">{c.name}</h3><p className="truncate text-sm text-slate-400">{c.slug}</p></div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(c)} className="rounded-lg bg-white/5 p-2.5 text-slate-300 hover:bg-white/10"><Pencil size={16} /></button>
                <button onClick={() => del(c.id)} className="rounded-lg bg-red-500/10 p-2.5 text-red-400 hover:bg-red-500/20"><Trash2 size={16} /></button>
              </div>
            </Card>
          ))}
        </div>
      )}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur">
          <form onSubmit={save} className="my-8 w-full max-w-lg space-y-4 rounded-2xl border border-white/10 bg-[#0b0e1a] p-6">
            <div className="flex items-center justify-between"><h2 className="text-xl font-bold text-white">{editId ? 'Edit' : 'New'} Category</h2><button type="button" onClick={() => setModal(false)} className="text-slate-400 hover:text-white"><X size={22} /></button></div>
            <Field label="Name"><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value, slug: editId ? form.slug : slugify(e.target.value) })} required /></Field>
            <Field label="Slug"><Input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} required /></Field>
            <Field label="Description"><Textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></Field>
            <Field label="Image"><ImageInput value={form.image_url} onChange={url => setForm({ ...form, image_url: url })} /></Field>
            <Field label="Sort Order"><Input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: e.target.value })} /></Field>
            <div className="flex justify-end gap-3 pt-2"><Btn type="button" variant="ghost" onClick={() => setModal(false)}>Cancel</Btn><Btn type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Btn></div>
          </form>
        </div>
      )}
    </div>
  );
}
