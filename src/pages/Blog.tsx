import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Clock } from 'lucide-react';
import { api } from '../lib/api';
import type { Article } from '../lib/types';
import ScrollReveal from '../components/ScrollReveal';
import Breadcrumbs from '../components/Breadcrumbs';
import Seo from '../components/Seo';
import { SkeletonCard } from '../components/Skeleton';

function readingTime(content: string) {
  return Math.max(1, Math.ceil(content.split(/\s+/).filter(Boolean).length / 200));
}

export default function Blog() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.articles.list().then(setArticles).catch(() => {}).finally(() => setLoading(false)); }, []);

  return (
    <div className="mx-auto max-w-7xl px-5 py-12">
      <Seo title="Blog — MohaanWeb" description="Insights on design, business and technology from the MohaanWeb team." keywords="blog, design, business, tutorials" />
      <Breadcrumbs items={[{ label: 'Blog' }]} />
      <ScrollReveal>
        <h1 className="text-4xl font-bold md:text-5xl"><span className="text-heading-gradient">Blog</span></h1>
        <p className="mt-3 text-lg text-[var(--text-secondary)]">Insights, guides and stories from the world of digital products.</p>
      </ScrollReveal>
      {loading ? (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{Array.from({length: 3}).map((_,i) => <SkeletonCard key={i} />)}</div>
      ) : articles.length === 0 ? (
        <div className="py-24 text-center text-[var(--text-secondary)]">No articles yet.</div>
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a, i) => (
            <ScrollReveal key={a.id} delay={i * 0.06}>
              <Link to={`/blog/${a.slug}`} className="group overflow-hidden rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] transition hover:border-[var(--border-hover)] hover:bg-[var(--bg-card-hover)]">
                <div className="aspect-video overflow-hidden">{a.cover_image && <img src={a.cover_image} alt={a.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />}</div>
                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs text-[var(--text-tertiary)]">
                    <span className="flex items-center gap-1"><User size={12}/> {a.author}</span>
                    <span className="flex items-center gap-1"><Clock size={12}/> {readingTime(a.content || '')} min</span>
                  </div>
                  <h3 className="mt-3 line-clamp-2 text-lg font-semibold text-[var(--text-primary)] transition group-hover:text-sky-400">{a.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[var(--text-secondary)]">{a.excerpt}</p>
                  <div className="mt-4 flex items-center gap-1.5 text-xs text-[var(--text-tertiary)]"><Calendar size={12} /> {new Date(a.created_at).toLocaleDateString()}</div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      )}
    </div>
  );
}
