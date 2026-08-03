import { useState, useEffect, useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { api } from '../lib/api';
import type { Product, Category } from '../lib/types';
import ProductCard from '../components/ProductCard';
import QuickView from '../components/QuickView';
import ScrollReveal from '../components/ScrollReveal';
import Breadcrumbs from '../components/Breadcrumbs';
import Seo from '../components/Seo';
import { SkeletonCard } from '../components/Skeleton';

type SortKey = 'newest' | 'trending' | 'bestselling';

export default function Store() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<number | 'all'>('all');
  const [sort, setSort] = useState<SortKey>('newest');
  const [quickView, setQuickView] = useState<Product | null>(null);

  useEffect(() => {
    Promise.all([api.products.list(), api.categories.list()])
      .then(([p, c]) => { setProducts(p); setCategories(c); })
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = products.filter(p =>
      (cat === 'all' || p.category_id === cat) &&
      (q === '' || p.title.toLowerCase().includes(q.toLowerCase()) || p.description.toLowerCase().includes(q.toLowerCase()))
    );
    if (sort === 'newest') result = [...result].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    else if (sort === 'bestselling') result = [...result].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    else if (sort === 'trending') result = [...result].sort((a, b) => (b.id % 3 === 0 ? 1 : 0) - (a.id % 3 === 0 ? 1 : 0));
    return result;
  }, [products, q, cat, sort]);

  const sortOptions: { key: SortKey; label: string }[] = [
    { key: 'newest', label: 'Newest' },
    { key: 'trending', label: 'Trending' },
    { key: 'bestselling', label: 'Best Selling' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-5 py-12">
      <Seo title="Store — MohaanWeb" description="Browse all premium digital products available at MohaanWeb." keywords="digital store, products, downloads" />
      <Breadcrumbs items={[{ label: 'Store' }]} />
      <ScrollReveal>
        <h1 className="text-4xl font-bold md:text-5xl"><span className="text-heading-gradient">Digital Store</span></h1>
        <p className="mt-3 text-lg text-[var(--text-secondary)]">Explore our complete collection of premium products.</p>
      </ScrollReveal>

      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 md:max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search products..."
            className="w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-input)] py-3 pl-11 pr-4 text-[var(--text-primary)] placeholder-[var(--text-tertiary)] outline-none transition focus:border-[var(--border-hover)]" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-sm text-[var(--text-tertiary)]"><SlidersHorizontal size={15} /> Sort:</div>
          {sortOptions.map(o => (
            <button key={o.key} onClick={() => setSort(o.key)} className={`rounded-lg px-3.5 py-2 text-sm font-medium transition ${sort === o.key ? 'btn-brand text-white' : 'border border-[var(--border-primary)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]'}`}>{o.label}</button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={() => setCat('all')} className={`rounded-lg px-4 py-2 text-sm font-medium transition ${cat === 'all' ? 'bg-sky-500/15 text-sky-300' : 'border border-[var(--border-primary)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]'}`}>All</button>
        {categories.map(c => (
          <button key={c.id} onClick={() => setCat(c.id)} className={`rounded-lg px-4 py-2 text-sm font-medium transition ${cat === c.id ? 'bg-sky-500/15 text-sky-300' : 'border border-[var(--border-primary)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]'}`}>{c.name}</button>
        ))}
      </div>

      {loading ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{Array.from({length: 6}).map((_,i) => <SkeletonCard key={i} />)}</div>
      ) : filtered.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-xl text-[var(--text-primary)]">No products found.</p>
          <p className="mt-2 text-[var(--text-tertiary)]">Try a different search or category.</p>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} onQuickView={setQuickView} />)}
        </div>
      )}

      {quickView && <QuickView product={quickView} onClose={() => setQuickView(null)} />}
    </div>
  );
}
