import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#070912] text-slate-400">
      <div className="h-8 w-8 rounded-full border-2 border-sky-500 border-t-transparent animate-spin" />
    </div>
  );
  if (!user) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}
