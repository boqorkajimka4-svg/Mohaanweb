import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { api } from '../../lib/api';
import type { HomeSection } from '../../lib/types';
import { PageHead, Card, Btn, Field, Input, Textarea, Select } from '../../components/admin/ui';
import Spinner from '../../components/Spinner';

const empty = { type: 'cta', title: '', subtitle: '', sort_order: 0, active: true };

export default function AdminSections() {
  const [items, setItems] = useState<HomeSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<any>(empty);
  const [saving, setSaving] = useState(false);

  const load = () => { setLoading(true); api.sections.list(true).then(setItems).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(load, []);

  const openNew = () => { setEditId(null); setForm(empty); setModal(true); };
  const openEdit = (s: HomeSection) => { setEditId(s.id); setForm(s); setModal(true); };

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const payload = { ...form, sort_order: Number(form.sort_order) || 0 };
    try {
      if (editId) await api.sections.update({ id: editId, ...payload });
      else await api.sections.create(payload);
      setModal(false); load();
    } catch (err: any) { alert(err.message); } finally { setSaving(false); }
  };
  const del = async (id: number) => { if (!confirm('Delete section?')) return; await api.sections.remove(id); load(); };

  return (
    <div>
      <PageHead title="Home Sections" subtitle="Customize call-to-action blocks on the home page." action={<Btn onClick={openNew}><span className="flex items-center gap-2"><Plus size={16} /> New Section</span></Btn>} />
      {loading ? <Spinner /> : (
        <div className="grid gap-4">
          {items.length === 0 && <Card><p className="text-slate-400">No sections yet.</p></Card>}
          {items.map((s) => (
            <Card key={s.id} className="flex items-center gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2"><h3 className="truncate font-semibold text-white">{s.title}</h3><span className="rounded bg-white/10 px-2 py-0.5 text-xs text-slate-300">{s.type}</span>{!s.active && <span className="rounded bg-amber-500/20 px-2 py-0.5 text-xs text-amber-300">Hidden</span>}</div>
                <p className="truncate text-sm text-slate-400">{s.subtitle}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(s)} className="rounded-lg bg-white/5 p-2.5 text-slate-300 hover:bg-white/10"><Pencil size={16} /></button>
                <button onClick={() => del(s.id)} className="rounded-lg bg-red-500/10 p-2.5 text-red-400 hover:bg-red-500/20"><Trash2 size={16} /></button>
              </div>
            </Card>
          ))}
        </div>
      )}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur">
          <form onSubmit={save} className="my-8 w-full max-w-lg space-y-4 rounded-2xl border border-white/10 bg-[#0b0e1a] p-6">
            <div className="flex items-center justify-between"><h2 className="text-xl font-bold text-white">{editId ? 'Edit' : 'New'} Section</h2><button type="button" onClick={() => setModal(false)} className="text-slate-400 hover:text-white"><X size={22} /></button></div>
            <Field label="Type"><Select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}><option value="cta">Call to Action</option></Select></Field>
            <Field label="Title"><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></Field>
            <Field label="Subtitle"><Textarea rows={3} value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} /></Field>
            <Field label="Sort Order"><Input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: e.target.value })} /></Field>
            <label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} className="h-4 w-4 accent-sky-500" /> Active (visible on site)</label>
            <div className="flex justify-end gap-3 pt-2"><Btn type="button" variant="ghost" onClick={() => setModal(false)}>Cancel</Btn><Btn type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Btn></div>
          </form>
        </div>
      )}
    </div>
  );
}
