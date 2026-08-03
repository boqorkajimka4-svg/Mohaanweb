import { useState, useEffect } from 'react';
import { Trash2, Mail, Phone } from 'lucide-react';
import { api } from '../../lib/api';
import type { ContactMessage } from '../../lib/types';
import { PageHead, Card } from '../../components/admin/ui';
import Spinner from '../../components/Spinner';

export default function AdminMessages() {
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => { setLoading(true); api.contact.list().then(setItems).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(load, []);

  const del = async (id: number) => { if (!confirm('Delete message?')) return; await api.contact.remove(id); load(); };

  return (
    <div>
      <PageHead title="Messages" subtitle="Contact form submissions." />
      {loading ? <Spinner /> : items.length === 0 ? (
        <Card><p className="text-slate-400">No messages yet.</p></Card>
      ) : (
        <div className="grid gap-4">
          {items.map((m) => (
            <Card key={m.id}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="font-semibold text-white">{m.name}</h3>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-400">
                    <a href={`mailto:${m.email}`} className="flex items-center gap-1.5 hover:text-sky-400"><Mail size={13} /> {m.email}</a>
                    {m.phone && <a href={`tel:${m.phone}`} className="flex items-center gap-1.5 hover:text-sky-400"><Phone size={13} /> {m.phone}</a>}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-xs text-slate-500">{new Date(m.created_at).toLocaleDateString()}</span>
                  <button onClick={() => del(m.id)} className="rounded-lg bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20"><Trash2 size={15} /></button>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-line text-slate-300">{m.message}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
