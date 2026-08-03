export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  sort_order: number;
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  description: string;
  price: number;
  category_id: number | null;
  image_url: string;
  gallery: string[];
  gumroad_url: string;
  featured: boolean;
  tags: string[];
  meta_title: string;
  meta_description: string;
  created_at: string;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  author: string;
  published: boolean;
  tags: string[];
  meta_title: string;
  meta_description: string;
  created_at: string;
}

export interface HomeSection {
  id: number;
  type: string;
  title: string;
  subtitle: string;
  content: Record<string, unknown>;
  sort_order: number;
  active: boolean;
}

export interface SiteSettings {
  id: number;
  site_name: string;
  tagline: string;
  hero_title: string;
  hero_subtitle: string;
  phone: string;
  email: string;
  logo_url: string;
  primary_color: string;
  footer_text: string;
  social_twitter: string;
  social_instagram: string;
  social_facebook: string;
  adsense_client: string;
}

export interface SeoMeta {
  id: number;
  page: string;
  title: string;
  description: string;
  keywords: string;
  og_image: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
}
