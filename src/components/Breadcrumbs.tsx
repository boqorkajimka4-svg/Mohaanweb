import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface Crumb { label: string; to?: string; }

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-[var(--text-tertiary)] mb-4 flex-wrap">
      <Link to="/" className="flex items-center gap-1 hover:text-[var(--text-accent)] transition"><Home size={14} /></Link>
      {items.map((c, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight size={14} className="text-[var(--text-tertiary)] opacity-50" />
          {c.to ? <Link to={c.to} className="hover:text-[var(--text-accent)] transition">{c.label}</Link> : <span className="text-[var(--text-primary)]">{c.label}</span>}
        </span>
      ))}
    </nav>
  );
}
