import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import SearchBar from './SearchBar';
import { useTheme } from '../contexts/ThemeContext';
import { api } from '../lib/api';

interface NavItem { label: string; url: string; }
const DEFAULT_NAV: NavItem[] = [
  { label: 'Home', url: '/' },
  { label: 'Store', url: '/store' },
  { label: 'Categories', url: '/categories' },
  { label: 'Blog', url: '/blog' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navItems, setNavItems] = useState<NavItem[]>(DEFAULT_NAV);
  const { theme, toggle } = useTheme();
  const loc = useLocation();

  useEffect(() => {
    api.nav.list().then((items: NavItem[]) => {
      if (items && items.length > 0) setNavItems(items.filter(i => i.label !== 'Contact'));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => { setOpen(false); setSearchOpen(false); }, [loc.pathname]);

  const isActive = (url: string) => url === '/' ? loc.pathname === '/' : loc.pathname.startsWith(url);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'glass-strong border-b border-[var(--border-primary)]' : 'border-b border-transparent bg-transparent'}`}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3.5">
        <Link to="/" className="shrink-0"><Logo size={36} /></Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((l) => (
            <Link key={l.url} to={l.url}
              className={`nav-link px-4 py-2 text-sm font-medium transition-colors ${isActive(l.url) ? 'active text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <div className="w-48 xl:w-56"><SearchBar /></div>
          <button onClick={toggle} className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-card)] p-2 text-[var(--text-secondary)] transition hover:border-[var(--border-hover)] hover:text-[var(--text-accent)]" aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Link to="/store" className="btn-brand shrink-0 rounded-xl px-5 py-2.5 text-sm font-semibold text-white">
            Browse Products
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button onClick={toggle} className="rounded-lg p-2 text-[var(--text-secondary)]" aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button onClick={() => setSearchOpen(!searchOpen)} className="rounded-lg p-2 text-[var(--text-secondary)]" aria-label="Search">
            <Search size={20} />
          </button>
          <button onClick={() => setOpen(!open)} className="rounded-lg p-2 text-[var(--text-primary)]" aria-label="Menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {searchOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-[var(--border-primary)] lg:hidden">
            <div className="p-4"><SearchBar onClose={() => setSearchOpen(false)} /></div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-[var(--border-primary)] bg-[var(--bg-primary)] lg:hidden">
            <div className="flex flex-col p-4">
              {navItems.map((l) => (
                <Link key={l.url} to={l.url} className={`rounded-lg px-4 py-3 text-sm font-medium transition ${isActive(l.url) ? 'bg-sky-500/15 text-sky-300' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]'}`}>{l.label}</Link>
              ))}
              <Link to="/store" className="btn-brand mt-2 rounded-xl px-5 py-3 text-center text-sm font-semibold text-white">Browse Products</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
