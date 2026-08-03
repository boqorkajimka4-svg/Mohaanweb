import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Package, FolderTree, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../lib/api';
import type { Product, Category, Article } from '../lib/types';

export default function SearchBar({ onClose }: { onClose?: () => void }) {
  const [q, setQ] = useState('');
  const [focused, setFocused] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    Promise.all([api.products.list(), api.categories.list(), api.articles.list()])
      .then(([p, c, a]) => { setProducts(p); setCategories(c); setArticles(a); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); inputRef.current?.focus(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setFocused(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const results = useMemo(() => {
    if (!q.trim()) return { products: [] as Product[], categories: [] as Category[], articles: [] as Article[] };
    const lq = q.toLowerCase();
    return {
      products: products.filter(p => p.title.toLowerCase().includes(lq) || (p.description || '').toLowerCase().includes(lq)).slice(0, 4),
      categories: categories.filter(c => c.name.toLowerCase().includes(lq) || (c.description || '').toLowerCase().includes(lq)).slice(0, 3),
      articles: articles.filter(a => a.title.toLowerCase().includes(lq) || (a.excerpt || '').toLowerCase().includes(lq)).slice(0, 3),
    };
  }, [q, products, categories, articles]);

  const total = results.products.length + results.categories.length + results.articles.length;
  const isOpen = focused && q.trim().length > 0;
  const go = (url: string) => { setQ(''); setFocused(false); navigate(url); onClose?.(); };

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
        <input
          ref={inputRef} value={q} onChange={e => setQ(e.target.value)} onFocus={() => setFocused(true)}
          onKeyDown={e => e.key === 'Escape' && setFocused(false)} placeholder="Search..."
          className="w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-input)] py-2 pl-9 pr-8 text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] outline-none transition focus:border-[var(--border-hover)]"
        />
        {q && <button onClick={() => setQ('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"><X size={14} /></button>}
        <kbd className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-[var(--border-primary)] bg-[var(--bg-card)] px-1.5 py-0.5 text-[10px] text-[var(--text-tertiary)] lg:block">⌘K</kbd>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: -8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.98 }} transition={{ duration: 0.2 }}
            className="absolute left-0 top-full z-50 mt-2 w-[360px] overflow-hidden rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)]/95 backdrop-blur-xl shadow-2xl"
          >
            {total === 0 ? (
              <div className="p-6 text-center text-sm text-[var(--text-tertiary)]">No results for “{q}”</div>
            ) : (
              <div className="max-h-[420px] overflow-y-auto p-2">
                {results.products.length > 0 && (
                  <div className="mb-1">
                    <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]"><Package size={12} /> Products</div>
                    {results.products.map(p => (
                      <button key={p.id} onClick={() => go(`/product/${p.slug}`)} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-[var(--bg-card-hover)]">
                        <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-[var(--bg-tertiary)]">{p.image_url && <img src={p.image_url} alt="" className="h-full w-full object-cover"/>}</div>
                        <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-[var(--text-primary)]">{p.title}</p><p className="text-xs text-[var(--text-tertiary)]">{p.price > 0 ? `$${Number(p.price).toFixed(2)}` : 'Free'}</p></div>
                      </button>
                    ))}
                  </div>
                )}
                {results.categories.length > 0 && (
                  <div className="mb-1">
                    <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]"><FolderTree size={12} /> Categories</div>
                    {results.categories.map(c => (
                      <button key={c.id} onClick={() => go(`/category/${c.slug}`)} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-[var(--bg-card-hover)]">
                        <FolderTree size={16} className="shrink-0 text-indigo-400"/><span className="truncate text-sm font-medium text-[var(--text-primary)]">{c.name}</span>
                      </button>
                    ))}
                  </div>
                )}
                {results.articles.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]"><FileText size={12} /> Articles</div>
                    {results.articles.map(a => (
                      <button key={a.id} onClick={() => go(`/blog/${a.slug}`)} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-[var(--bg-card-hover)]">
                        <FileText size={16} className="shrink-0 text-purple-400"/><span className="truncate text-sm font-medium text-[var(--text-primary)]">{a.title}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
