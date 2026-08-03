import type { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, FolderTree, FileText, Layers, Navigation, Image, Search, Settings, Mail, LogOut, ExternalLink } from 'lucide-react';
import supabase from '../../lib/supabase';
import Logo from '../Logo';

const nav = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: FolderTree },
  { to: '/admin/articles', label: 'Articles', icon: FileText },
  { to: '/admin/sections', label: 'Home Sections', icon: Layers },
  { to: '/admin/navigation', label: 'Navigation', icon: Navigation },
  { to: '/admin/media', label: 'Media', icon: Image },
  { to: '/admin/seo', label: 'SEO', icon: Search },
  { to: '/admin/messages', label: 'Messages', icon: Mail },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const loc = useLocation();
  const navigate = useNavigate();
  const logout = async () => { await supabase.auth.signOut(); navigate('/admin/login'); };

  return (
    <div className="flex min-h-screen bg-[#070912] text-slate-200">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-white/8 bg-[#05060d] p-4 md:flex">
        <div className="mb-6 px-2 pt-2"><Logo size={34} /></div>
        <nav className="flex-1 space-y-1 overflow-y-auto">
          {nav.map((n) => {
            const active = n.exact ? loc.pathname === n.to : loc.pathname.startsWith(n.to);
            return (
              <Link key={n.to} to={n.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${active ? 'bg-sky-500/15 text-sky-300' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                <n.icon size={18} /> {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="space-y-1 border-t border-white/8 pt-3">
          <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400 hover:bg-white/5 hover:text-white"><ExternalLink size={18} /> View Site</a>
          <button onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10"><LogOut size={18} /> Logout</button>
        </div>
      </aside>
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/8 px-4 py-3 md:hidden">
          <Logo size={30} />
          <button onClick={logout} className="text-red-400"><LogOut size={20} /></button>
        </div>
        <div className="flex gap-1 overflow-x-auto border-b border-white/8 px-3 py-2 md:hidden">
          {nav.map(n => (
            <Link key={n.to} to={n.to} className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs ${(n.exact ? loc.pathname === n.to : loc.pathname.startsWith(n.to)) ? 'bg-sky-500/15 text-sky-300' : 'text-slate-400'}`}>{n.label}</Link>
          ))}
        </div>
        <div className="p-5 md:p-8">{children}</div>
      </div>
    </div>
  );
}
