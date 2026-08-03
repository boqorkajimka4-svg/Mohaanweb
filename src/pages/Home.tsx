import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, ShieldCheck, Sparkles, Download, Star, TrendingUp, Clock, Award } from 'lucide-react';
import { api } from '../lib/api';
import { useSettings } from '../lib/useSettings';
import type { Product, Category, HomeSection } from '../lib/types';
import FloatingObjects from '../components/FloatingObjects';
import Particles from '../components/Particles';
import ProductCard from '../components/ProductCard';
import QuickView from '../components/QuickView';
import ScrollReveal from '../components/ScrollReveal';
import Testimonials from '../components/Testimonials';
import Newsletter from '../components/Newsletter';
import TrustedBrands from '../components/TrustedBrands';
import FAQ from '../components/FAQ';
import Seo from '../components/Seo';
import { SkeletonCard } from '../components/Skeleton';
import type { Product as P } from '../lib/types';

const perks = [
  { icon: Zap, title: 'Instant Delivery', desc: 'Download your digital products immediately after purchase.' },
  { icon: ShieldCheck, title: 'Secure Checkout', desc: 'Payments handled safely through Gumroad.' },
  { icon: Sparkles, title: 'Premium Quality', desc: 'Carefully crafted, production-ready resources.' },
  { icon: Download, title: 'Lifetime Access', desc: 'Re-download your files any time you need.' },
];

const stats = [
  { value: '10K+', label: 'Happy Customers' },
  { value: '50+', label: 'Premium Products' },
  { value: '4.9', label: 'Average Rating' },
  { value: '24/7', label: 'Support' },
];

export default function Home() {
  const settings = useSettings();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sections, setSections] = useState<HomeSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickView, setQuickView] = useState<P | null>(null);

  useEffect(() => {
    Promise.all([api.products.list(), api.categories.list(), api.sections.list()])
      .then(([p, c, s]) => { setAllProducts(p); setCategories(c); setSections(s); })
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  const bestSellers = allProducts.filter(p => p.featured).slice(0, 6);
  const newArrivals = [...allProducts].sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 3);
  const trending = allProducts.filter(p => p.id % 3 === 0).slice(0, 3);

  return (
    <>
      <Seo
        title={`${settings?.site_name || 'MohaanWeb'} — ${settings?.tagline || 'Premium Digital Products'}`}
        description={settings?.hero_subtitle || 'Discover premium digital products, templates and creative resources at MohaanWeb.'}
        keywords="digital products, templates, MohaanWeb, downloads, creative resources"
        jsonLd={{ '@context': 'https://schema.org', '@type': 'WebSite', name: 'MohaanWeb', url: typeof window !== 'undefined' ? window.location.origin : '' }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden mesh-bg">
        <FloatingObjects />
        <Particles />
        <div className="relative mx-auto max-w-7xl px-5 py-28 md:py-40">
          <motion.div initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }} className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-primary)] bg-[var(--bg-card)] px-4 py-1.5 text-sm text-sky-300 backdrop-blur-sm">
              <Sparkles size={14} /> {settings?.tagline || 'Premium Digital Marketplace'}
            </span>
            <h1 className="mt-7 text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
              <span className="text-heading-gradient">{settings?.hero_title || 'Digital products that move your work forward.'}</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-[var(--text-secondary)]">
              {settings?.hero_subtitle || 'Explore a curated collection of templates, assets and tools — crafted with precision and ready to download instantly.'}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/store" className="btn-brand group inline-flex items-center gap-2 rounded-xl px-7 py-3.5 font-semibold text-white">
                Explore Store <ArrowRight size={18} className="transition group-hover:translate-x-1" />
              </Link>
              <Link to="/categories" className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] px-7 py-3.5 font-semibold text-[var(--text-primary)] backdrop-blur-sm transition hover:bg-[var(--bg-card-hover)]">
                Browse Categories
              </Link>
            </div>
            <div className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {stats.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.1 }}>
                  <div className="text-3xl font-bold text-[var(--text-primary)]">{s.value}</div>
                  <div className="mt-1 text-sm text-[var(--text-tertiary)]">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <TrustedBrands />

      {/* Perks */}
      <section className="mx-auto max-w-7xl px-5 py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map((p, i) => (
            <ScrollReveal key={i} delay={i * 0.08}>
              <div className="group h-full rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-6 transition hover:border-[var(--border-hover)]">
                <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-sky-500/15 to-indigo-500/15 p-3 text-sky-400 transition group-hover:scale-110"><p.icon size={22} /></div>
                <h3 className="font-semibold text-[var(--text-primary)]">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-secondary)]">{p.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {loading ? (
        <div className="mx-auto max-w-7xl px-5 py-20"><div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{Array.from({length: 3}).map((_,i) => <SkeletonCard key={i} />)}</div></div>
      ) : (
        <>
          {categories.length > 0 && (
            <section className="mx-auto max-w-7xl px-5 py-20">
              <ScrollReveal>
                <div className="mb-10 flex items-end justify-between">
                  <div>
                    <h2 className="text-3xl font-bold md:text-4xl"><span className="text-heading-gradient">Shop by Category</span></h2>
                    <p className="mt-2 text-[var(--text-secondary)]">Find exactly what you're looking for.</p>
                  </div>
                  <Link to="/categories" className="hidden text-sm font-medium text-sky-400 transition hover:text-sky-300 sm:block">View all →</Link>
                </div>
              </ScrollReveal>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categories.slice(0, 6).map((c, i) => (
                  <ScrollReveal key={c.id} delay={i * 0.06}>
                    <Link to={`/category/${c.slug}`} className="group relative flex h-48 items-end overflow-hidden rounded-2xl border border-[var(--border-primary)]">
                      {c.image_url && <img src={c.image_url} alt={c.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-35 transition duration-700 group-hover:scale-110 group-hover:opacity-45" />}
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/70 to-transparent" />
                      <div className="relative p-6">
                        <h3 className="text-xl font-bold text-[var(--text-primary)] transition group-hover:text-sky-400">{c.name}</h3>
                        <p className="mt-1 line-clamp-1 text-sm text-[var(--text-secondary)]">{c.description}</p>
                      </div>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            </section>
          )}

          {bestSellers.length > 0 && (
            <section className="mx-auto max-w-7xl px-5 py-20">
              <ScrollReveal>
                <div className="mb-10 flex items-end justify-between">
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-sky-400"><Award size={16} /> Best Sellers</div>
                    <h2 className="text-3xl font-bold md:text-4xl"><span className="text-heading-gradient">Most Popular Products</span></h2>
                  </div>
                  <Link to="/store" className="hidden text-sm font-medium text-sky-400 transition hover:text-sky-300 sm:block">Shop all →</Link>
                </div>
              </ScrollReveal>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {bestSellers.map((p, i) => <ProductCard key={p.id} product={p} index={i} onQuickView={setQuickView} />)}
              </div>
            </section>
          )}

          {newArrivals.length > 0 && (
            <section className="mx-auto max-w-7xl px-5 py-20">
              <ScrollReveal>
                <div className="mb-10 flex items-end justify-between">
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-emerald-400"><Clock size={16} /> New Arrivals</div>
                    <h2 className="text-3xl font-bold md:text-4xl"><span className="text-heading-gradient">Fresh from the Studio</span></h2>
                  </div>
                  <Link to="/store" className="hidden text-sm font-medium text-sky-400 transition hover:text-sky-300 sm:block">Shop all →</Link>
                </div>
              </ScrollReveal>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {newArrivals.map((p, i) => <ProductCard key={p.id} product={p} index={i} onQuickView={setQuickView} />)}
              </div>
            </section>
          )}

          {trending.length > 0 && (
            <section className="mx-auto max-w-7xl px-5 py-20">
              <ScrollReveal>
                <div className="mb-10 flex items-end justify-between">
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-purple-400"><TrendingUp size={16} /> Trending Now</div>
                    <h2 className="text-3xl font-bold md:text-4xl"><span className="text-heading-gradient">What Everyone's Buying</span></h2>
                  </div>
                  <Link to="/store" className="hidden text-sm font-medium text-sky-400 transition hover:text-sky-300 sm:block">Shop all →</Link>
                </div>
              </ScrollReveal>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {trending.map((p, i) => <ProductCard key={p.id} product={p} index={i} onQuickView={setQuickView} />)}
              </div>
            </section>
          )}

          {sections.filter(s => s.type === 'cta').map((s) => (
            <section key={s.id} className="mx-auto max-w-7xl px-5 py-20">
              <ScrollReveal>
                <div className="relative overflow-hidden rounded-3xl border border-[var(--border-primary)] bg-gradient-to-br from-sky-600/15 via-indigo-600/10 to-purple-600/15 p-10 md:p-16">
                  <FloatingObjects />
                  <div className="relative max-w-2xl">
                    <h2 className="text-3xl font-bold md:text-4xl"><span className="text-heading-gradient">{s.title}</span></h2>
                    <p className="mt-3 text-lg text-[var(--text-secondary)]">{s.subtitle}</p>
                    <Link to="/store" className="btn-brand mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 font-semibold text-slate-900">
                      Get Started <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            </section>
          ))}
        </>
      )}

      <Testimonials />
      <FAQ />
      <section className="mx-auto max-w-7xl px-5 py-20"><Newsletter /></section>

      {quickView && <QuickView product={quickView} onClose={() => setQuickView(null)} />}
    </>
  );
}
