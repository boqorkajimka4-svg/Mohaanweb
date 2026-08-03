import type { Product } from './types';

const KEY = 'mohaanweb_recent';

export interface RecentItem {
  id: number;
  title: string;
  slug: string;
  image_url: string;
  price: number;
}

export function getRecentlyViewed(excludeId?: number): RecentItem[] {
  try {
    const items: RecentItem[] = JSON.parse(localStorage.getItem(KEY) || '[]');
    return excludeId ? items.filter(i => i.id !== excludeId) : items;
  } catch { return []; }
}

export function addRecentlyViewed(product: Product) {
  try {
    const items = getRecentlyViewed();
    const filtered = items.filter(i => i.id !== product.id);
    filtered.unshift({ id: product.id, title: product.title, slug: product.slug, image_url: product.image_url, price: product.price });
    localStorage.setItem(KEY, JSON.stringify(filtered.slice(0, 8)));
  } catch {}
}
