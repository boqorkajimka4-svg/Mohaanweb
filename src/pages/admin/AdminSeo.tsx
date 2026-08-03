import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { api } from '../../lib/api';
import type { SeoMeta } from '../../lib/types';
import { PageHead, Card, Btn, Field, Input, Textarea } from '../../components/admin/ui';
import ImageInput from '../../components/admin/ImageInput';
import Spinner from '../../components/Spinner';

const PAGES = ['home', 'store', 'categories', 'blog', 'contact'];

export default function AdminSeo() {
  const [metas, setMetas] = useState<Record<string, Partial<SeoMeta>>>({});
  const [loading, setLoading] = useState(true);
  const [savingPage, setSavingPage] = useState('');
  const [savedPage, setSavedPage] = useState('');

  useEffect(() => {
    api.seo.list().then((list: SeoMeta[]) => {
      const map: Record<string, Partial<SeoMeta>> = {};
      PAGES.forEach(p => { map[p] = list.find(m => m.page === p) || { page: p, title: '', description: '', keywords: '', og_image: '' }; });
      setMetas(map);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const upd = (page: string, field: string, val: string) => setMetas(m => ({ ...m, [page]: { ...m[page], [field]: val } }));

  const save = async (page: string) => {
    setSavingPage(page);
    try { await api.seo.upsert(metas[page]); setSavedPage(page); setTimeout(() => setSavedPage(''), 1500); }
    catch (err: any) { alert(err.message); } finally { setSavingPage(''); }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <PageHead title="SEO Metadata" subtitle="Customize page titles, descriptions and social images." />
      <div className="grid gap-5">
        {PAGES.map((page) => (
          <Card key={page}>
            <h3 className="mb-4 text-lg font-semibold capitalize text-white">{page} page</h3>
            <div className="grid gap-4">
              <Field label="Meta Title"><Input value={metas[page]?.title || ''} onChange={e => upd(page, 'title', e.target.value)} /></Field>
              <Field label="Meta Description"><Textarea rows={2} value={metas[page]?.description || ''} onChange={e => upd(page, 'description', e.target.value)} /></Field>
              <Field label="Keywords"><Input value={metas[page]?.keywords || ''} onChange={e => upd(page, 'keywords', e.target.value)} /></Field>
              <Field label="Open Graph Image"><ImageInput value={metas[page]?.og_image || ''} onChange={url => upd(page, 'og_image', url)} /></Field>
              <div><Btn onClick={() => save(page)} disabled={savingPage === page}><span className="flex items-center gap-2">{savedPage === page ? 'Saved!' : <><Save size={16} /> Save</>}</span></Btn></div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
