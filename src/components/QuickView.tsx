import { useState } from 'react';
import { X, ShoppingCart, Tag, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Product } from '../lib/types';
import { getBadge, badgeColors } from '../lib/badges';

export default function QuickView({ product, onClose }: { product: Product; onClose: () => void }) {
  const badge = getBadge(product);
  const bc = badge ? badgeColors[badge.variant] : null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
        className="fixed inset-0 z-[250] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.22,1,0.36,1] }}
          onClick={e => e.stopPropagation()}
          className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-2xl">
          <button onClick={onClose} className="absolute right-4 top-4 z-10 rounded-full bg-[var(--bg-card)] p-2 text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"><X size={18}/></button>
          <div className="grid md:grid-cols-2">
            <div className="aspect-square overflow-hidden md:aspect-auto">
              {product.image_url ? <img src={product.image_url} alt={product.title} className="h-full w-full object-cover"/> : <div className="flex h-full min-h-[200px] items-center justify-center bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]">No image</div>}
            </div>
            <div className="flex flex-col justify-center p-6 md:p-8">
              {badge && bc && <span className={`mb-3 inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${bc.bg} ${bc.text}`}><span className={`h-1.5 w-1.5 rounded-full ${bc.dot}`}/>{badge.label}</span>}
              <h2 className="text-xl font-bold text-[var(--text-primary)] md:text-2xl">{product.title}</h2>
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[var(--text-secondary)]">{product.description}</p>
              <div className="mt-5 flex items-center gap-3">
                <span className="text-2xl font-bold text-[var(--text-primary)]">{product.price > 0 ? `$${Number(product.price).toFixed(2)}` : 'Free'}</span>
              </div>
              {product.tags && product.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">{product.tags.slice(0,4).map((t,i) => <span key={i} className="flex items-center gap-1 rounded-md border border-[var(--border-primary)] bg-[var(--bg-card)] px-2 py-0.5 text-xs text-[var(--text-secondary)]"><Tag size={10}/>{t}</span>)}</div>
              )}
              <div className="mt-6 flex gap-3">
                {product.gumroad_url ? (
                  <a href={product.gumroad_url} target="_blank" rel="noreferrer" className="btn-brand flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white"><ShoppingCart size={16}/> Buy Now</a>
                ) : null}
                <Link to={`/product/${product.slug}`} onClick={onClose} className="flex items-center gap-2 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] px-5 py-2.5 text-sm font-semibold text-[var(--text-primary)] transition hover:bg-[var(--bg-card-hover)]"><ExternalLink size={16}/> Full Details</Link>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
