import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Eye } from 'lucide-react';
import type { Product } from '../lib/types';
import { getBadge, badgeColors } from '../lib/badges';

export default function ProductCard({ product, index = 0, onQuickView }: { product: Product; index?: number; onQuickView?: (p: Product) => void }) {
  const badge = getBadge(product);
  const bc = badge ? badgeColors[badge.variant] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: (index % 6) * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="group relative block overflow-hidden rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] transition-all duration-350 hover:border-[var(--border-hover)] hover:shadow-[var(--shadow-card-hover)]"
      >
        <Link to={`/product/${product.slug}`} className="block">
          <div className="relative aspect-[4/3] overflow-hidden">
            {product.image_url ? (
              <img src={product.image_url} alt={product.title} loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
            ) : (
              <div className="flex h-full items-center justify-center bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]">No image</div>
            )}
            {badge && bc && (
              <span className={`absolute left-3 top-3 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${bc.bg} ${bc.text}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${bc.dot}`} />{badge.label}
              </span>
            )}
            <div className="absolute right-3 top-3 rounded-full bg-black/40 p-2 opacity-0 backdrop-blur transition group-hover:opacity-100">
              <ArrowUpRight size={14} className="text-white" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-40" />
          </div>
        </Link>
        {onQuickView && (
          <button
            onClick={() => onQuickView(product)}
            className="absolute bottom-[88px] left-1/2 flex -translate-x-1/2 translate-y-2 items-center gap-1.5 rounded-full bg-[var(--bg-glass)] px-4 py-2 text-xs font-semibold text-[var(--text-primary)] opacity-0 backdrop-blur-xl transition-all duration-300 hover:bg-[var(--bg-card-hover)] group-hover:translate-y-0 group-hover:opacity-100"
          >
            <Eye size={13} /> Quick View
          </button>
        )}
        <Link to={`/product/${product.slug}`} className="block p-5">
          <h3 className="line-clamp-1 text-base font-semibold text-[var(--text-primary)] transition-colors group-hover:text-sky-400">{product.title}</h3>
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-[var(--text-secondary)]">{product.description}</p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-lg font-bold text-[var(--text-primary)]">{product.price > 0 ? `$${Number(product.price).toFixed(2)}` : 'Free'}</span>
            <span className="text-xs font-medium text-sky-400 opacity-0 transition-opacity group-hover:opacity-100">View details →</span>
          </div>
        </Link>
      </div>
    </motion.div>
  );
}
