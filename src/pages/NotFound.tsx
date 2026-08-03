import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';
import Seo from '../components/Seo';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
      <Seo title="404 — Page Not Found | MohaanWeb" description="The page you're looking for doesn't exist." />
      <div className="text-8xl font-extrabold text-brand-gradient">404</div>
      <h1 className="mt-4 text-2xl font-bold text-[var(--text-primary)]">Page not found</h1>
      <p className="mt-2 max-w-md text-[var(--text-secondary)]">The page you're looking for doesn't exist or has been moved. Let's get you back on track.</p>
      <div className="mt-8 flex gap-3">
        <Link to="/" className="btn-brand inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white">
          <Home size={16} /> Go Home
        </Link>
        <Link to="/store" className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] px-6 py-3 text-sm font-semibold text-[var(--text-primary)] transition hover:border-[var(--border-hover)]">
          <Search size={16} /> Browse Store
        </Link>
      </div>
    </div>
  );
}
