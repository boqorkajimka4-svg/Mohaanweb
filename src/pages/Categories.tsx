import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import type { Category } from '../lib/types';
import ScrollReveal from '../components/ScrollReveal';
import Breadcrumbs from '../components/Breadcrumbs';
import Seo from '../components/Seo';
import { SkeletonCard } from '../components/Skeleton';

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.categories.list().then(setCategories).catch(() => {}).finally(() => setLoading(false)); }, []);

  return (
    <div className="mx-auto max-w-7xl px-5 py-12">
      <Seo title="Categories — MohaanWeb" description="Explore product categories at MohaanWeb." keywords="categories, digital products" />
      <Breadcrumbs items={[{ label: 'Categories' }]} />
      <ScrollReveal>
        <h1 className="text-4xl font-bold md:text-5xl"><span className="text-heading-gradient">Categories</span></h1>
        <p className="mt-3 text-lg text-[var(--text-secondary)]">Find the perfect resources for your next project.</p>
      </ScrollReveal>
      {loading ? (
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({length: 3}).map((_,i) => <SkeletonCard key={i} />)}</div>
      ) : (
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => (
            <ScrollReveal key={c.id} delay={i * 0.06}>
              <Link to={`/category/${c.slug}`} className="group relative flex h-52 items-end overflow-hidden rounded-2xl border border-[var(--border-primary)] transition hover:border-[var(--border-hover)]">
                {c.image_url && <img src={c.image_url} alt={c.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-35 transition duration-700 group-hover:scale-110 group-hover:opacity-45" />}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/60 to-transparent" />
                <div className="relative p-6">
                  <h3 className="text-2xl font-bold text-[var(--text-primary)] transition group-hover:text-sky-400">{c.name}</h3>
                  <p className="mt-1.5 line-clamp-2 text-sm text-[var(--text-secondary)]">{c.description}</p>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      )}
    </div>
  );
}
