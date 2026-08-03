import type { Product } from './types';

export type BadgeVariant = 'new' | 'bestseller' | 'trending';
export interface Badge { label: string; variant: BadgeVariant; }

export function getBadge(product: Product): Badge | null {
  if (product.featured) return { label: 'Best Seller', variant: 'bestseller' };
  if (product.id % 3 === 0) return { label: 'Trending', variant: 'trending' };
  if (product.id % 2 === 0) return { label: 'New', variant: 'new' };
  return null;
}

export const badgeColors: Record<BadgeVariant, { bg: string; text: string; dot: string }> = {
  new: { bg: 'bg-emerald-500/15', text: 'text-emerald-300', dot: 'bg-emerald-400' },
  bestseller: { bg: 'bg-amber-500/15', text: 'text-amber-300', dot: 'bg-amber-400' },
  trending: { bg: 'bg-sky-500/15', text: 'text-sky-300', dot: 'bg-sky-400' },
};
