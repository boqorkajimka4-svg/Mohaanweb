import { useState } from 'react';
import { Phone, Mail, Send, CheckCircle } from 'lucide-react';
import { api } from '../lib/api';
import { useSettings } from '../lib/useSettings';
import ScrollReveal from '../components/ScrollReveal';
import Breadcrumbs from '../components/Breadcrumbs';
import Seo from '../components/Seo';

export default function Contact() {
  const s = useSettings();
  const phone = s?.phone || '0795553795';
  const email = s?.email || 'yaqaneahamd@gmail.com';
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState('');

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.message.trim()) e.message = 'Message is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault(); setErr('');
    if (!validate()) return;
    setSending(true);
    try { await api.contact.send(form); setSent(true); setForm({ name: '', email: '', phone: '', message: '' }); }
    catch { setErr('Failed to send message. Please try again.'); }
    finally { setSending(false); }
  };

  const inputCls = 'w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-input)] px-4 py-3 text-[var(--text-primary)] outline-none transition focus:border-[var(--border-hover)]';

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <Seo title="Contact — MohaanWeb" description="Get in touch with the MohaanWeb team." keywords="contact, support, help" />
      <Breadcrumbs items={[{ label: 'Contact' }]} />
      <ScrollReveal>
        <h1 className="text-4xl font-bold md:text-5xl"><span className="text-heading-gradient">Get in Touch</span></h1>
        <p className="mt-3 text-lg text-[var(--text-secondary)]">Have a question or need support? We'd love to hear from you.</p>
      </ScrollReveal>

      <div className="mt-12 grid gap-8 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-2">
          <ScrollReveal delay={0.05}>
            <a href={`tel:${phone}`} className="flex items-center gap-4 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-6 transition hover:border-[var(--border-hover)]">
              <div className="rounded-xl bg-gradient-to-br from-sky-500/15 to-indigo-500/15 p-3 text-sky-400"><Phone size={22} /></div>
              <div><p className="text-sm text-[var(--text-tertiary)]">Phone</p><p className="font-semibold text-[var(--text-primary)]">{phone}</p></div>
            </a>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <a href={`mailto:${email}`} className="flex items-center gap-4 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-6 transition hover:border-[var(--border-hover)]">
              <div className="rounded-xl bg-gradient-to-br from-sky-500/15 to-indigo-500/15 p-3 text-sky-400"><Mail size={22} /></div>
              <div><p className="text-sm text-[var(--text-tertiary)]">Email</p><p className="font-semibold text-[var(--text-primary)] break-all">{email}</p></div>
            </a>
          </ScrollReveal>
        </div>

        <div className="lg:col-span-3">
          {sent ? (
            <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-12 text-center">
              <CheckCircle size={48} className="text-emerald-400" />
              <h3 className="mt-4 text-xl font-semibold text-[var(--text-primary)]">Message sent!</h3>
              <p className="mt-2 text-[var(--text-secondary)]">Thanks for reaching out. We'll get back to you soon.</p>
              <button onClick={() => setSent(false)} className="mt-6 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-card)] px-5 py-2.5 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]">Send another</button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-6 md:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm text-[var(--text-secondary)]">Name *</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inputCls} />
                  {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm text-[var(--text-secondary)]">Email *</label>
                  <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={inputCls} />
                  {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-[var(--text-secondary)]">Phone</label>
                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-[var(--text-secondary)]">Message *</label>
                <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={5} className={inputCls} />
                {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message}</p>}
              </div>
              {err && <p className="text-sm text-red-400">{err}</p>}
              <button type="submit" disabled={sending} className="btn-brand flex items-center gap-2 rounded-xl px-7 py-3.5 font-semibold text-white disabled:opacity-60">
                {sending ? 'Sending...' : <>Send Message <Send size={18} /></>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
