import { Link } from 'react-router-dom';
import { Phone, Mail, Twitter, Instagram, Facebook, ArrowUpRight } from 'lucide-react';
import Logo from './Logo';
import { useSettings } from '../lib/useSettings';

export default function Footer() {
  const s = useSettings();
  const phone = s?.phone || '0795553795';
  const email = s?.email || 'yaqaneahamd@gmail.com';
  const year = new Date().getFullYear();

  const cols = [
    {
      title: 'Products',
      links: [
        { label: 'All Products', to: '/store' },
        { label: 'Categories', to: '/categories' },
        { label: 'UI Kits', to: '/category/ui-kits' },
        { label: 'Templates', to: '/category/templates' },
        { label: 'Ebooks', to: '/category/ebooks' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Blog', to: '/blog' },
        { label: 'Privacy Policy', to: '/privacy-policy' },
        { label: 'Terms & Conditions', to: '/terms' },
        { label: 'Cookie Policy', to: '/cookie-policy' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', to: '/' },
        { label: 'Contact Us', to: '/contact' },
        { label: 'Support', to: '/contact' },
      ],
    },
  ];

  return (
    <footer className="relative border-t border-[var(--border-primary)] bg-[var(--bg-secondary)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-500/30 to-transparent" />
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-2 lg:grid-cols-5">
        {/* Brand column */}
        <div className="lg:col-span-2">
          <Logo size={38} />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--text-secondary)]">
            {s?.tagline || 'Premium digital products, templates and resources crafted for modern creators.'}
          </p>
          <div className="mt-6 flex gap-3">
            {s?.social_twitter && <a href={s.social_twitter} target="_blank" rel="noreferrer" className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-card)] p-2.5 text-[var(--text-secondary)] transition hover:border-[var(--border-hover)] hover:text-sky-400"><Twitter size={16} /></a>}
            {s?.social_instagram && <a href={s.social_instagram} target="_blank" rel="noreferrer" className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-card)] p-2.5 text-[var(--text-secondary)] transition hover:border-[var(--border-hover)] hover:text-sky-400"><Instagram size={16} /></a>}
            {s?.social_facebook && <a href={s.social_facebook} target="_blank" rel="noreferrer" className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-card)] p-2.5 text-[var(--text-secondary)] transition hover:border-[var(--border-hover)] hover:text-sky-400"><Facebook size={16} /></a>}
          </div>
          <div className="mt-6 space-y-2.5 text-sm text-[var(--text-secondary)]">
            <a href={`tel:${phone}`} className="flex items-center gap-2.5 transition hover:text-sky-400"><Phone size={15} /> {phone}</a>
            <a href={`mailto:${email}`} className="flex items-center gap-0.5 transition hover:text-sky-400"><Mail size={15} /> <span className="break-all">{email}</span></a>
          </div>
        </div>
        {/* Link columns */}
        {cols.map(col => (
          <div key={col.title}>
            <h4 className="mb-4 text-sm font-semibold text-[var(--text-primary)]">{col.title}</h4>
            <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
              {col.links.map(l => (
                <li key={l.label}><Link to={l.to} className="transition hover:text-sky-400">{l.label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-[var(--border-primary)] py-6 text-center text-xs text-[var(--text-tertiary)]">
        {s?.footer_text || `© ${year} MohaanWeb. All rights reserved.`}
      </div>
    </footer>
  );
}
