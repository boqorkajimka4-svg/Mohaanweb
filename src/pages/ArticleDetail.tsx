import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Clock, Twitter, Facebook, Linkedin, Link2, Check } from 'lucide-react';
import { api } from '../lib/api';
import type { Article } from '../lib/types';
import ReadingProgress from '../components/ReadingProgress';
import ScrollReveal from '../components/ScrollReveal';
import Breadcrumbs from '../components/Breadcrumbs';
import Seo from '../components/Seo';
import Spinner from '../components/Spinner';

function readingTime(content: string) {
  return Math.max(1, Math.ceil(content.split(/\s+/).filter(Boolean).length / 200));
}

export default function ArticleDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true); setNotFound(false);
    api.articles.get(slug).then(async (a: Article) => {
      setArticle(a);
      const all = await api.articles.list();
      const byTags = all.filter((r: Article) => r.id !== a.id && (r.tags || []).some(t => (a.tags || []).includes(t))).slice(0, 3);
      setRelated(byTags.length > 0 ? byTags : all.filter((r: Article) => r.id !== a.id).slice(0, 3));
    }).catch(() => setNotFound(true)).finally(() => setLoading(false));
  }, [slug]);

  const share = (platform: string) => {
    if (!article) return;
    const u = encodeURIComponent(window.location.href);
    const t = encodeURIComponent(article.title);
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?url=${u}&text=${t}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
    };
    if (platform === 'copy') { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); return; }
    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  if (loading) return <Spinner />;
  if (notFound || !article) return <div className="py-24 text-center text-[var(--text-secondary)]">Article not found.</div>;
  const rt = readingTime(article.content || '');

  return (
    <>
      <ReadingProgress />
      <article className="mx-auto max-w-3xl px-5 py-12">
        <Seo title={article.meta_title || `${article.title} — MohaanWeb`} description={article.meta_description || article.excerpt} image={article.cover_image} type="article" />
        <Breadcrumbs items={[{ label: 'Blog', to: '/blog' }, { label: article.title }]} />
        <Link to="/blog" className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] transition hover:text-sky-400"><ArrowLeft size={16} /> Back to Blog</Link>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {article.cover_image && <div className="mb-8 overflow-hidden rounded-2xl border border-[var(--border-primary)]"><img src={article.cover_image} alt={article.title} className="w-full object-cover" /></div>}
          <h1 className="text-3xl font-bold text-[var(--text-primary)] md:text-4xl lg:text-5xl">{article.title}</h1>
          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-[var(--text-tertiary)]">
            <span className="flex items-center gap-1.5"><User size={15}/> {article.author}</span>
            <span className="flex items-center gap-1.5"><Calendar size={15}/> {new Date(article.created_at).toLocaleDateString()}</span>
            <span className="flex items-center gap-1.5"><Clock size={15}/> {rt} min read</span>
          </div>

          <div className="mt-6 flex items-center gap-2">
            <span className="text-xs text-[var(--text-tertiary)]">Share:</span>
            {[{icon: Twitter, key: 'twitter'}, {icon: Facebook, key: 'facebook'}, {icon: Linkedin, key: 'linkedin'}].map(s => (
              <button key={s.key} onClick={() => share(s.key)} className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-card)] p-2 text-[var(--text-secondary)] transition hover:border-[var(--border-hover)] hover:text-sky-400"><s.icon size={14}/></button>
            ))}
            <button onClick={() => share('copy')} className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-card)] p-2 text-[var(--text-secondary)] transition hover:border-[var(--border-hover)] hover:text-sky-400">
              {copied ? <Check size={14} className="text-emerald-400"/> : <Link2 size={14}/>}
            </button>
          </div>

          <div className="prose-custom mt-10 space-y-4 leading-relaxed text-[var(--text-secondary)]">
            {(article.content || '').split('\n').filter(Boolean).map((para, i) => {
              if (para.startsWith('## ')) return <h2 key={i} className="pt-6 text-2xl font-bold text-[var(--text-primary)]">{para.replace('## ', '')}</h2>;
              if (para.startsWith('- ')) return <li key={i} className="ml-5 list-disc">{para.replace('- ', '')}</li>;
              return <p key={i}>{para}</p>;
            })}
          </div>

          {article.tags && article.tags.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2">
              {article.tags.map((t, i) => <span key={i} className="rounded-full border border-[var(--border-primary)] bg-[var(--bg-card)] px-3 py-1 text-xs text-[var(--text-secondary)]">#{t}</span>)}
            </div>
          )}
        </motion.div>

        {related.length > 0 && (
          <section className="mt-20">
            <ScrollReveal><h2 className="mb-8 text-2xl font-bold text-[var(--text-primary)]">Related Articles</h2></ScrollReveal>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((a, i) => (
                <ScrollReveal key={a.id} delay={i * 0.08}>
                  <Link to={`/blog/${a.slug}`} className="group overflow-hidden rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] transition hover:border-[var(--border-hover)]">
                    <div className="aspect-video overflow-hidden">{a.cover_image && <img src={a.cover_image} alt={a.title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />}</div>
                    <div className="p-5"><h3 className="line-clamp-2 text-base font-semibold text-[var(--text-primary)] group-hover:text-sky-400">{a.title}</h3><p className="mt-2 line-clamp-2 text-sm text-[var(--text-secondary)]">{a.excerpt}</p></div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
