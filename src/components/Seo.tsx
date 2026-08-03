import { useEffect } from 'react';

interface SeoProps {
  title: string;
  description?: string;
  image?: string;
  keywords?: string;
  type?: string;
  jsonLd?: Record<string, unknown>;
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export default function Seo({ title, description = '', image = '', keywords = '', type = 'website', jsonLd }: SeoProps) {
  useEffect(() => {
    document.title = title;
    setMeta('name', 'description', description);
    setMeta('name', 'keywords', keywords);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:image', image);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    if (image) setMeta('name', 'twitter:image', image);

    let ld = document.getElementById('page-jsonld') as HTMLScriptElement | null;
    if (jsonLd) {
      if (!ld) {
        ld = document.createElement('script');
        ld.id = 'page-jsonld';
        ld.type = 'application/ld+json';
        document.head.appendChild(ld);
      }
      ld.textContent = JSON.stringify(jsonLd);
    } else if (ld) {
      ld.remove();
    }
  }, [title, description, image, keywords, type, jsonLd]);
  return null;
}
