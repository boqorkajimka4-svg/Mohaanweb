import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { api } from '../../lib/api';
import type { SiteSettings } from '../../lib/types';
import { PageHead, Card, Btn, Field, Input, Textarea } from '../../components/admin/ui';
import ImageInput from '../../components/admin/ImageInput';
import Spinner from '../../components/Spinner';

export default function AdminSettings() {
  const [s, setS] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { api.settings.get().then(setS).catch(() => {}).finally(() => setLoading(false)); }, []);

  const upd = (field: keyof SiteSettings, val: string) => setS(prev => prev ? { ...prev, [field]: val } : prev);

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); if (!s) return; setSaving(true);
    try { const updated = await api.settings.update(s); setS(updated); setSaved(true); setTimeout(() => setSaved(false), 1500); }
    catch (err: any) { alert(err.message); } finally { setSaving(false); }
  };

  if (loading || !s) return <Spinner />;

  return (
    <div>
      <PageHead title="Site Settings" subtitle="Configure global site information." />
      <form onSubmit={save} className="grid gap-5">
        <Card>
          <h3 className="mb-4 text-lg font-semibold text-white">Branding</h3>
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Site Name"><Input value={s.site_name || ''} onChange={e => upd('site_name', e.target.value)} /></Field>
              <Field label="Tagline"><Input value={s.tagline || ''} onChange={e => upd('tagline', e.target.value)} /></Field>
            </div>
            <Field label="Hero Title"><Input value={s.hero_title || ''} onChange={e => upd('hero_title', e.target.value)} /></Field>
            <Field label="Hero Subtitle"><Textarea rows={2} value={s.hero_subtitle || ''} onChange={e => upd('hero_subtitle', e.target.value)} /></Field>
            <Field label="Logo Image (optional)"><ImageInput value={s.logo_url || ''} onChange={url => upd('logo_url', url)} /></Field>
          </div>
        </Card>
        <Card>
          <h3 className="mb-4 text-lg font-semibold text-white">Contact</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Phone"><Input value={s.phone || ''} onChange={e => upd('phone', e.target.value)} /></Field>
            <Field label="Email"><Input value={s.email || ''} onChange={e => upd('email', e.target.value)} /></Field>
          </div>
        </Card>
        <Card>
          <h3 className="mb-4 text-lg font-semibold text-white">Social &amp; Footer</h3>
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Twitter URL"><Input value={s.social_twitter || ''} onChange={e => upd('social_twitter', e.target.value)} /></Field>
              <Field label="Instagram URL"><Input value={s.social_instagram || ''} onChange={e => upd('social_instagram', e.target.value)} /></Field>
              <Field label="Facebook URL"><Input value={s.social_facebook || ''} onChange={e => upd('social_facebook', e.target.value)} /></Field>
            </div>
            <Field label="Footer Text"><Input value={s.footer_text || ''} onChange={e => upd('footer_text', e.target.value)} /></Field>
          </div>
        </Card>
        <Card>
          <h3 className="mb-4 text-lg font-semibold text-white">Advertising</h3>
          <Field label="Google AdSense Client ID (ca-pub-xxxxx)"><Input value={s.adsense_client || ''} onChange={e => upd('adsense_client', e.target.value)} placeholder="ca-pub-0000000000000000" /></Field>
        </Card>
        <div><Btn type="submit" disabled={saving}><span className="flex items-center gap-2">{saved ? 'Saved!' : <><Save size={16} /> Save Settings</>}</span></Btn></div>
      </form>
    </div>
  );
}
