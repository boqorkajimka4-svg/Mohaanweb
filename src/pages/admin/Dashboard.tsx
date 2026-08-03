import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, FolderTree, FileText, Mail, ArrowRight, TrendingUp, DollarSign, Eye, Activity, BarChart3, Users, Star } from 'lucide-react';
import { api } from '../../lib/api';
import type { ContactMessage } from '../../lib/types';
import { PageHead, Card } from '../../components/admin/ui';

export default function Dashboard() {
  const [stats, setStats] = useState({ products: 0, categories: 0, articles: 0, messages: 0 });
  const [recentMsgs, setRecentMsgs] = useState<ContactMessage[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      api.products.list(), api.categories.list(), api.articles.list(true), api.contact.list(),
    ]).then(([p, c, a, m]) => {
      setStats({ products: p.length, categories: c.length, articles: a.length, messages: m.length });
      setRecentMsgs(m.slice(0, 3));
      setProducts(p);
    }).catch(() => {});
  }, []);

  const totalValue = products.reduce((s: number, p: any) => s + Number(p.price || 0), 0);
  const avgPrice = products.length > 0 ? totalValue / products.length : 0;
  const featuredCount = products.filter((p: any) => p.featured).length;

  const analyticsCards = [
    { icon: Package, label: 'Total Products', value: stats.products, color: 'from-sky-500 to-cyan-500' },
    { icon: DollarSign, label: 'Catalog Value', value: `$${totalValue.toFixed(0)}`, color: 'from-emerald-500 to-teal-500' },
    { icon: BarChart3, label: 'Avg. Price', value: `$${avgPrice.toFixed(2)}`, color: 'from-violet-500 to-purple-500' },
    { icon: Star, label: 'Featured', value: featuredCount, color: 'from-amber-500 to-orange-500' },
    { icon: FolderTree, label: 'Categories', value: stats.categories, color: 'from-indigo-500 to-blue-500' },
    { icon: FileText, label: 'Articles', value: stats.articles, color: 'from-pink-500 to-rose-500' },
    { icon: Users, label: 'Messages', value: stats.messages, color: 'from-sky-500 to-indigo-500' },
    { icon: Activity, label: 'Active Sections', value: '—', color: 'from-teal-500 to-emerald-500' },
  ];

  return (
    <div>
      <PageHead title="Dashboard" subtitle="Overview of your MohaanWeb store." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {analyticsCards.map((c, i) => (
          <Card key={i} className="relative overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${c.color} opacity-[0.07]`} />
            <div className="relative flex items-center gap-4">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${c.color} text-white`}><c.icon size={20} /></div>
              <div>
                <p className="text-xs font-medium text-slate-400">{c.label}</p>
                <p className="text-xl font-bold text-white">{c.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white"><Mail size={18} /> Recent Messages</h3>
          {recentMsgs.length === 0 ? <p className="text-sm text-slate-400">No messages yet.</p> : (
            <div className="space-y-3">
              {recentMsgs.map(m => (
                <div key={m.id} className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                  <div className="flex items-center justify-between"><span className="text-sm font-medium text-white">{m.name}</span><span className="text-xs text-slate-500">{new Date(m.created_at).toLocaleDateString()}</span></div>
                  <p className="mt-1 line-clamp-1 text-xs text-slate-400">{m.message}</p>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h3 className="mb-4 text-lg font-semibold text-white">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <Link to="/admin/products" className="inline-flex items-center gap-2 rounded-lg border border-white/8 bg-white/[0.03] px-4 py-2.5 text-sm text-slate-200 transition hover:border-sky-500/30 hover:text-sky-400"><Package size={15} /> New Product</Link>
            <Link to="/admin/categories" className="inline-flex items-center gap-2 rounded-lg border border-white/8 bg-white/[0.03] px-4 py-2.5 text-sm text-slate-200 transition hover:border-sky-500/30 hover:text-sky-400"><FolderTree size={15} /> New Category</Link>
            <Link to="/admin/articles" className="inline-flex items-center gap-2 rounded-lg border border-white/8 bg-white/[0.03] px-4 py-2.5 text-sm text-slate-200 transition hover:border-sky-500/30 hover:text-sky-400"><FileText size={15} /> New Article</Link>
            <Link to="/admin/settings" className="inline-flex items-center gap-2 rounded-lg border border-white/8 bg-white/[0.03] px-4 py-2.5 text-sm text-slate-200 transition hover:border-sky-500/30 hover:text-sky-400">Edit Settings</Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
