import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { api } from '../lib/api';
import type { Category, Product } from '../lib/types';
import ProductCard from '../components/ProductCard';
import ScrollReveal from '../components/ScrollReveal';
import Breadcrumbs from '../components/Breadcrumbs';
import Seo from '../components/Seo';
import Spinner from '../components/Spinner';

export default function CategoryDetail() {
  const { slug } = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true); setNotFound(false);
    Promise.all([api.categories.get(slug), api.products.list({ category: slug })])
      .then(([c, p]) => { setCategory(c); setProducts(p); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Spinner />;
  if (notFound || !category) return <div className="py-24 text-center text-[var(--text-secondary)]">Category not found.</div>;

  return (
    <div className="mx-auto max-w-7xl px-5 py-12">
      <Seo title={`${category.name} — MohaanWeb`} description={category.description} />
      <Breadcrumbs items={[{ label: 'Categories', to: '/categories' }, { label: category.name }]} />
      <div className="relative overflow-hidden rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-card)]">
        {category.image_url && <img src={category.image_url} alt={category.name} loading="lazy" className="absolute inset-0 h-64 w-full object-cover opacity-25" />}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-primary)] via-[var(--bg-primary)]/80 to-transparent" />
        <div className="relative p-8 md:p-12">
          <Link to="/categories" className="mb-4 inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] transition hover:text-sky-400"><ArrowLeft size={16} /> All Categories</Link>
          <h1 className="text-4xl font-bold md:text-5xl"><span className="text-heading-gradient">{category.name}</span></h1>
          <p className="mt-2 max-w-2xl text-[var(--text-secondary)]">{category.description}</p>
        </div>
      </div>
      {products.length === 0 ? (
        <div className="py-24 text-center text-[var(--text-secondary)]">No products in this category yet.</div>
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      )}
    </div>
  );
}
