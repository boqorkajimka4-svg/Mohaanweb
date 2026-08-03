import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Package, FolderTree, FileText, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../lib/api';
import type { Product, Category, Article } from '../lib/types';

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    Promise.all([api.products.list(), api.categories.list(), api.articles.list()])
      .then(([p, c, a]) => { setProducts(p); setCategories(c); setArticles(a); }).catch(() => {});
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setOpen(true); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 50); }, [open]);

  const lq = q.toLowerCase();
  const results = q.trim() ? {
    products: products.filter(p => p.title.toLowerCase().includes(lq) || p.description?.toLowerCase().includes(lq)).slice(0, 5),
    categories: categories.filter(c => c.name.toLowerCase().includes(lq)).slice(0, 3),
    articles: articles.filter(a => a.title.toLowerCase().includes(lq) || a.excerpt?.toLowerCase().includes(lq)).slice(0, 3),
  } : { products: [], categories: [], articles: [] };
  const total = results.products.length + results.categories.length + results.articles.length;

  const go = (url: string) => { setOpen(false); setQ(''); navigate(url); };
  const close = useCallback(() => { setOpen(false); setQ(''); }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close}
          className="fixed inset-0 z-[300] flex items-start justify-center bg-black/50 backdrop-blur-sm pt-[15vh]">
          <motion.div initial={{ opacity: 0, y: -20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.97 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)]/95 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-3 border-b border-[var(--border-primary)] px-5 py-4">
              <Search size={18} className="text-[var(--text-tertiary)]" />
              <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === 'Escape' && close()}
                placeholder="Search products, categories, articles..."
                className="flex-1 bg-transparent text-[var(--text-primary)] placeholder-[var(--text-tertiary)] outline-none" />
              <kbd className="rounded-md border border-[var(--border-primary)] bg-[var(--bg-card)] px-2 py-0.5 text-xs text-[var(--text-tertiary)]">ESC</kbd>
            </div>
            <div className="max-h-[360px] overflow-y-auto p-3">
              {!q.trim() && <p className="px-3 py-6 text-center text-sm text-[var(--text-tertiary)]">Start typing to search...</p>}
              {q.trim() && total === 0 && <p className="px-3 py-6 text-center text-sm text-[var(--text-tertiary)]">No results for “{q}”</p>}
              {results.products.length > 0 && (
                <div className="mb-2">
                  <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]"><Package size={12}/> Products</div>
                  {results.products.map(p => (
                    <button key={p.id} onClick={() => go(`/product/${p.slug}`)} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-[var(--bg-card-hover)]">
                      <div className="h-8 w-8 shrink-0 overflow-hidden rounded-lg bg-[var(--bg-tertiary)]">{p.image_url && <img src={p.image_url} alt="" className="h-full w-full object-cover"/>}</div>
                      <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-[var(--text-primary)]">{p.title}</p><p className="text-xs text-[var(--text-tertiary)]">{p.price > 0 ? `$${Number(p.price).toFixed(2)}` : 'Free'}</p></div>
                      <ArrowRight size={14} className="text-[var(--text-tertiary)]"/>
                    </button>
                  ))}
                </div>
              )}
              {results.categories.length > 0 && (
                <div className="mb-2">
                  <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]"><FolderTree size={12}/> Categories</div>
                  {results.categories.map(c => (
                    <button key={c.id} onClick={() => go(`/category/${c.slug}`)} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-[var(--bg-card-hover)]">
                      <FolderTree size={16} className="shrink-0 text-indigo-400"/><span className="truncate text-sm font-medium text-[var(--text-primary)]">{c.name}</span><ArrowRight size={14} className="ml-auto text-[var(--text-tertiary)]"/>
                    </button>
                  ))}
                </div>
              )}
              {results.articles.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]"><FileText size={12}/> Articles</div>
                  {results.articles.map(a => (
                    <button key={a.id} onClick={() => go(`/blog/${a.slug}`)} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-[var(--bg-card-hover)]">
                      <FileText size={16} className="shrink-0 text-purple-400"/><span className="truncate text-sm font-medium text-[var(--text-primary)]">{a.title}</span><ArrowRight size={14} className="ml-auto text-[var(--text-tertiary)]"/>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
