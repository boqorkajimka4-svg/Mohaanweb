import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Tag, Eye, Sparkles } from 'lucide-react';
import { api } from '../lib/api';
import type { Product } from '../lib/types';
import { getBadge, badgeColors } from '../lib/badges';
import { addRecentlyViewed, getRecentlyViewed, type RecentItem } from '../lib/recentlyViewed';
import ProductCard from '../components/ProductCard';
import QuickView from '../components/QuickView';
import ScrollReveal from '../components/ScrollReveal';
import Breadcrumbs from '../components/Breadcrumbs';
import Seo from '../components/Seo';
import Spinner from '../components/Spinner';

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [youMayLike, setYouMayLike] = useState<Product[]>([]);
  const [recent, setRecent] = useState<RecentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [quickView, setQuickView] = useState<Product | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true); setNotFound(false);
    api.products.get(slug).then(async (p: Product) => {
      setProduct(p);
      addRecentlyViewed(p);
      setRecent(getRecentlyViewed(p.id));
      const all = await api.products.list();
      const sameCat = all.filter((r: Product) => r.id !== p.id && r.category_id === p.category_id);
      const tagMatch = all.filter((r: Product) => r.id !== p.id && (r.tags || []).some((t: string) => (p.tags || []).includes(t)));
      setRelated([...sameCat, ...tagMatch.filter((t: Product) => !sameCat.includes(t))].slice(0, 3));
      // AI-style recommendations: products from different categories with shared tags or similar price
      const others = all.filter((r: Product) => r.id !== p.id && !sameCat.includes(r));
      setYouMayLike(others.sort((a: Product, b: Product) => {
        const aScore = (a.tags || []).filter((t: string) => (p.tags || []).includes(t)).length + (Math.abs(Number(a.price) - Number(p.price)) < 15 ? 1 : 0);
        const bScore = (b.tags || []).filter((t: string) => (p.tags || []).includes(t)).length + (Math.abs(Number(b.price) - Number(p.price)) < 15 ? 1 : 0);
        return bScore - aScore;
      }).slice(0, 3));
    }).catch(() => setNotFound(true)).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Spinner />;
  if (notFound || !product) return <div className="py-24 text-center text-[var(--text-secondary)]">Product not found.</div>;
  const badge = getBadge(product);
  const bc = badge ? badgeColors[badge.variant] : null;

  return (
    <div className="mx-auto max-w-7xl px-5 py-12">
      <Seo title={product.meta_title || `${product.title} — MohaanWeb`} description={product.meta_description || product.description} image={product.image_url} />
      <Breadcrumbs items={[{ label: 'Store', to: '/store' }, { label: product.title }]} />
      <Link to="/store" className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] transition hover:text-sky-400"><ArrowLeft size={16} /> Back to Store</Link>

      <div className="grid gap-10 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="relative overflow-hidden rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)]">
          <div className="aspect-[4/3] overflow-hidden">
            {product.image_url ? <img src={product.image_url} alt={product.title} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]">No image</div>}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="flex flex-col justify-center">
          {badge && bc && <span className={`mb-3 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${bc.bg} ${bc.text}`}><span className={`h-1.5 w-1.5 rounded-full ${bc.dot}`} />{badge.label}</span>}
          <h1 className="text-3xl font-bold text-[var(--text-primary)] md:text-4xl">{product.title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-[var(--text-secondary)]">{product.description}</p>
          <div className="mt-6 flex items-center gap-4">
            <span className="text-3xl font-bold text-[var(--text-primary)]">{product.price > 0 ? `$${Number(product.price).toFixed(2)}` : 'Free'}</span>
          </div>
          {product.tags && product.tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">{product.tags.map((t, i) => <span key={i} className="flex items-center gap-1 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-card)] px-2.5 py-1 text-xs text-[var(--text-secondary)]"><Tag size={10} />{t}</span>)}</div>
          )}
          <div className="mt-8">
            {product.gumroad_url ? (
              <a href={product.gumroad_url} target="_blank" rel="noreferrer" className="btn-brand inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-semibold text-white">
                <ShoppingCart size={20} /> Buy Now
              </a>
            ) : (
              <div className="text-[var(--text-tertiary)]">Purchase link coming soon</div>
            )}
          </div>
        </motion.div>
      </div>

      {recent.length > 0 && (
        <section className="mt-20">
          <ScrollReveal><h2 className="mb-8 text-2xl font-bold text-[var(--text-primary)]"><Eye size={22} className="mr-2 inline" /> Recently Viewed</h2></ScrollReveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {recent.slice(0, 4).map((r, i) => (
              <ScrollReveal key={r.id} delay={i * 0.06}>
                <Link to={`/product/${r.slug}`} className="group overflow-hidden rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-0 transition hover:border-[var(--border-hover)]">
                  <div className="aspect-[4/3] overflow-hidden">{r.image_url && <img src={r.image_url} alt={r.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />}</div>
                  <div className="p-4"><h3 className="line-clamp-1 text-sm font-semibold text-[var(--text-primary)] group-hover:text-sky-400">{r.title}</h3><p className="mt-1 text-sm font-bold text-[var(--text-primary)]">{r.price > 0 ? `$${Number(r.price).toFixed(2)}` : 'Free'}</p></div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-20">
          <ScrollReveal><h2 className="mb-8 text-2xl font-bold text-[var(--text-primary)]">Related Products</h2></ScrollReveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} onQuickView={setQuickView} />)}
          </div>
        </section>
      )}

      {youMayLike.length > 0 && (
        <section className="mt-20">
          <ScrollReveal>
            <div className="mb-8">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-purple-400"><Sparkles size={16} /> AI Recommendations</div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">You May Also Like</h2>
            </div>
          </ScrollReveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {youMayLike.map((p, i) => <ProductCard key={p.id} product={p} index={i} onQuickView={setQuickView} />)}
          </div>
        </section>
      )}

      {quickView && <QuickView product={quickView} onClose={() => setQuickView(null)} />}
    </div>
  );
}
