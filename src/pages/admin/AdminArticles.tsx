import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { api } from '../../lib/api';
import type { Article } from '../../lib/types';
import { PageHead, Card, Btn, Field, Input, Textarea } from '../../components/admin/ui';
import ImageInput from '../../components/admin/ImageInput';
import Spinner from '../../components/Spinner';

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const empty = { title: '', slug: '', excerpt: '', content: '', cover_image: '', author: 'MohaanWeb', published: true, tags: '', meta_title: '', meta_description: '' };

export default function AdminArticles() {
  const [items, setItems] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<any>(empty);
  const [saving, setSaving] = useState(false);

  const load = () => { setLoading(true); api.articles.list(true).then(setItems).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(load, []);

  const openNew = () => { setEditId(null); setForm(empty); setModal(true); };
  const openEdit = (a: Article) => { setEditId(a.id); setForm({ ...a, tags: (a.tags || []).join(', ') }); setModal(true); };

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const payload = { ...form, slug: form.slug || slugify(form.title), tags: form.tags ? form.tags.split(',').map((s: string) => s.trim()).filter(Boolean) : [] };
    try {
      if (editId) await api.articles.update({ id: editId, ...payload });
      else await api.articles.create(payload);
      setModal(false); load();
    } catch (err: any) { alert(err.message); } finally { setSaving(false); }
  };
  const del = async (id: number) => { if (!confirm('Delete article?')) return; await api.articles.remove(id); load(); };

  return (
    <div>
      <PageHead title="Articles" subtitle="Write and manage blog posts." action={<Btn onClick={openNew}><span className="flex items-center gap-2"><Plus size={16} /> New Article</span></Btn>} />
      {loading ? <Spinner /> : (
        <div className="grid gap-4">
          {items.length === 0 && <Card><p className="text-slate-400">No articles yet.</p></Card>}
          {items.map((a) => (
            <Card key={a.id} className="flex items-center gap-4">
              <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-800">{a.cover_image && <img src={a.cover_image} alt="" className="h-full w-full object-cover" />}</div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2"><h3 className="truncate font-semibold text-white">{a.title}</h3>{!a.published && <span className="rounded bg-amber-500/20 px-2 py-0.5 text-xs text-amber-300">Draft</span>}</div>
                <p className="truncate text-sm text-slate-400">{a.excerpt}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(a)} className="rounded-lg bg-white/5 p-2.5 text-slate-300 hover:bg-white/10"><Pencil size={16} /></button>
                <button onClick={() => del(a.id)} className="rounded-lg bg-red-500/10 p-2.5 text-red-400 hover:bg-red-500/20"><Trash2 size={16} /></button>
              </div>
            </Card>
          ))}
        </div>
      )}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur">
          <form onSubmit={save} className="my-8 w-full max-w-2xl space-y-4 rounded-2xl border border-white/10 bg-[#0b0e1a] p-6">
            <div className="flex items-center justify-between"><h2 className="text-xl font-bold text-white">{editId ? 'Edit' : 'New'} Article</h2><button type="button" onClick={() => setModal(false)} className="text-slate-400 hover:text-white"><X size={22} /></button></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Title"><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value, slug: editId ? form.slug : slugify(e.target.value) })} required /></Field>
              <Field label="Slug"><Input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} required /></Field>
            </div>
            <Field label="Excerpt"><Textarea rows={2} value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} /></Field>
            <Field label="Content (supports # heading, ## subheading, - bullets, blank line = paragraph)">
              <Textarea rows={10} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} className="font-mono text-sm" />
            </Field>
            <Field label="Cover Image"><ImageInput value={form.cover_image} onChange={url => setForm({ ...form, cover_image: url })} /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Author"><Input value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} /></Field>
              <Field label="Tags (comma separated)"><Input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} /></Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Meta Title (SEO)"><Input value={form.meta_title} onChange={e => setForm({ ...form, meta_title: e.target.value })} /></Field>
              <Field label="Meta Description (SEO)"><Input value={form.meta_description} onChange={e => setForm({ ...form, meta_description: e.target.value })} /></Field>
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} className="h-4 w-4 accent-sky-500" /> Published</label>
            <div className="flex justify-end gap-3 pt-2"><Btn type="button" variant="ghost" onClick={() => setModal(false)}>Cancel</Btn><Btn type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Article'}</Btn></div>
          </form>
        </div>
      )}
    </div>
  );
}
