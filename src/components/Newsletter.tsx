import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { api } from '../lib/api';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { setError('Enter a valid email'); return; }
    setError(''); setLoading(true);
    try {
      await api.contact.send({ name: 'Newsletter', email, phone: '', message: 'Newsletter subscription' });
      setDone(true);
    } catch { setError('Failed to subscribe. Try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-8">
      <h3 className="text-xl font-bold text-[var(--text-primary)]">Stay in the loop</h3>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">Get the latest products and articles delivered to your inbox.</p>
      {done ? (
        <div className="mt-4 flex items-center gap-2 text-sm text-emerald-400"><CheckCircle size={16} /> You're subscribed!</div>
      ) : (
        <form onSubmit={submit} className="mt-4 flex gap-2">
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@example.com"
            className="flex-1 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-input)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] outline-none transition focus:border-[var(--border-hover)]" />
          <button type="submit" disabled={loading} className="btn-brand shrink-0 rounded-xl px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
            {loading ? '...' : <Send size={16} />}
          </button>
        </form>
      )}
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
}
