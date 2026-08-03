import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, X, GripVertical } from 'lucide-react';
import { api } from '../../lib/api';
import { PageHead, Card, Btn, Field, Input } from '../../components/admin/ui';
import Spinner from '../../components/Spinner';

interface NavItem { id: number; label: string; url: string; sort_order: number; active: boolean; }

export default function AdminNav() {
  const [items, setItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ label: '', url: '', sort_order: 0, active: true });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api.nav.listAll().then((data: NavItem[]) => setItems(data)).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openNew = () => { setEditId(null); setForm({ label: '', url: '', sort_order: items.length, active: true }); setModal(true); };
  const openEdit = (item: NavItem) => { setEditId(item.id); setForm(item); setModal(true); };

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editId) await api.nav.update({ id: editId, ...form, sort_order: Number(form.sort_order) });
      else await api.nav.create({ ...form, sort_order: Number(form.sort_order) });
      setModal(false); load();
    } catch (err: any) { alert(err.message); } finally { setSaving(false); }
  };
  const del = async (id: number) => { if (!confirm('Delete this nav item?')) return; await api.nav.remove(id); load(); };

  return (
    <div>
      <PageHead title="Navigation" subtitle="Manage menu links and footer settings." action={<Btn onClick={openNew}><span className="flex items-center gap-2"><Plus size={16} /> New Link</span></Btn>} />
      {loading ? <Spinner /> : (
        <div className="grid gap-4">
          {items.length === 0 && <Card><p className="text-slate-400">No nav items yet.</p></Card>}
          {items.map((item) => (
            <Card key={item.id} className="flex items-center gap-4">
              <GripVertical size={18} className="shrink-0 text-slate-600" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate font-semibold text-white">{item.label}</h3>
                  {!item.active && <span className="rounded bg-amber-500/20 px-2 py-0.5 text-xs text-amber-300">Hidden</span>}
                </div>
                <p className="truncate text-sm text-slate-400">{item.url}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(item)} className="rounded-lg bg-white/5 p-2.5 text-slate-300 hover:bg-white/10"><Pencil size={16} /></button>
                <button onClick={() => del(item.id)} className="rounded-lg bg-red-500/10 p-2.5 text-red-400 hover:bg-red-500/20"><Trash2 size={16} /></button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Card className="mt-6">
        <h3 className="mb-2 font-semibold text-white">Footer Settings</h3>
        <p className="text-sm text-slate-400">Footer text, social links and contact info are managed in <Link to="/admin/settings" className="text-sky-400 hover:underline">Site Settings</Link>.</p>
      </Card>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur">
          <form onSubmit={save} className="my-8 w-full max-w-md space-y-4 rounded-2xl border border-white/10 bg-[#0b0e1a] p-6">
            <div className="flex items-center justify-between"><h2 className="text-xl font-bold text-white">{editId ? 'Edit' : 'New'} Nav Link</h2><button type="button" onClick={() => setModal(false)} className="text-slate-400 hover:text-white"><X size={22} /></button></div>
            <Field label="Label"><Input value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} required /></Field>
            <Field label="URL"><Input value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="/store" required /></Field>
            <Field label="Sort Order"><Input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })} /></Field>
            <label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} className="h-4 w-4 accent-sky-500" /> Active (visible in nav)</label>
            <div className="flex justify-end gap-3 pt-2"><Btn type="button" variant="ghost" onClick={() => setModal(false)}>Cancel</Btn><Btn type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Btn></div>
          </form>
        </div>
      )}
    </div>
  );
}
