import { useState, useEffect } from 'react';
import { Trash2, Copy, Check } from 'lucide-react';
import { api } from '../../lib/api';
import { PageHead, Card } from '../../components/admin/ui';
import ImageInput from '../../components/admin/ImageInput';
import Spinner from '../../components/Spinner';

interface Media { id: number; url: string; name: string; path: string; }

export default function AdminMedia() {
  const [items, setItems] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<number | null>(null);
  const [dummy, setDummy] = useState('');

  const load = () => { setLoading(true); api.media.list().then(setItems).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(load, []);

  const del = async (m: Media) => { if (!confirm('Delete this file?')) return; await api.media.remove(m.id, m.path); load(); };
  const copy = (m: Media) => { navigator.clipboard.writeText(m.url); setCopied(m.id); setTimeout(() => setCopied(null), 1500); };

  return (
    <div>
      <PageHead title="Media Library" subtitle="Upload and manage images." />
      <Card className="mb-6">
        <p className="mb-3 text-sm font-medium text-slate-300">Upload new image</p>
        <ImageInput value={dummy} onChange={(url) => { setDummy(''); if (url) load(); void url; }} />
      </Card>
      {loading ? <Spinner /> : items.length === 0 ? (
        <Card><p className="text-slate-400">No media uploaded yet.</p></Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((m) => (
            <div key={m.id} className="overflow-hidden rounded-xl border border-white/8 bg-white/[0.03]">
              <div className="aspect-square bg-slate-900"><img src={m.url} alt={m.name} className="h-full w-full object-cover" /></div>
              <div className="flex items-center justify-between gap-2 p-3">
                <span className="truncate text-xs text-slate-400">{m.name}</span>
                <div className="flex shrink-0 gap-1">
                  <button onClick={() => copy(m)} className="rounded bg-white/5 p-1.5 text-slate-300 hover:bg-white/10">{copied === m.id ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}</button>
                  <button onClick={() => del(m)} className="rounded bg-red-500/10 p-1.5 text-red-400 hover:bg-red-500/20"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
