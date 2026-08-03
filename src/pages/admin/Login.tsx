import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../../components/Logo';
import { LogIn } from 'lucide-react';

export default function Login() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (user) nav('/admin'); }, [user, nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(''); setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setErr(error.message);
    else nav('/admin');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070912] px-5">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center"><Logo size={54} /></div>
        <form onSubmit={submit} className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-8">
          <h1 className="text-2xl font-bold text-white">Admin Login</h1>
          <p className="text-sm text-slate-400">Sign in to manage your site.</p>
          <div>
            <label className="mb-1.5 block text-sm text-slate-300">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-sky-500/50" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-slate-300">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-sky-500/50" />
          </div>
          {err && <p className="text-sm text-red-400">{err}</p>}
          <button type="submit" disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-3.5 font-semibold text-white transition hover:shadow-lg hover:shadow-sky-500/30 disabled:opacity-60">
            {loading ? 'Signing in...' : <>Sign In <LogIn size={18} /></>}
          </button>
        </form>
      </div>
    </div>
  );
}
