import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicLayout from './components/PublicLayout';
import AdminLayout from './components/admin/AdminLayout';
import PageLoader from './components/PageLoader';
import CommandPalette from './components/CommandPalette';
import Spinner from './components/Spinner';

const Home = lazy(() => import('./pages/Home'));
const Store = lazy(() => import('./pages/Store'));
const Categories = lazy(() => import('./pages/Categories'));
const CategoryDetail = lazy(() => import('./pages/CategoryDetail'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Blog = lazy(() => import('./pages/Blog'));
const ArticleDetail = lazy(() => import('./pages/ArticleDetail'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Privacy = lazy(() => import('./pages/Legal').then(m => ({ default: m.PrivacyPolicy })));
const Terms = lazy(() => import('./pages/Legal').then(m => ({ default: m.Terms })));
const Cookies = lazy(() => import('./pages/Legal').then(m => ({ default: m.CookiePolicy })));

const Login = lazy(() => import('./pages/admin/Login'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'));
const AdminArticles = lazy(() => import('./pages/admin/AdminArticles'));
const AdminSections = lazy(() => import('./pages/admin/AdminSections'));
const AdminNav = lazy(() => import('./pages/admin/AdminNav'));
const AdminMedia = lazy(() => import('./pages/admin/AdminMedia'));
const AdminSeo = lazy(() => import('./pages/admin/AdminSeo'));
const AdminMessages = lazy(() => import('./pages/admin/AdminMessages'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));

function Public({ children }: { children: React.ReactNode }) {
  return <PublicLayout><Suspense fallback={<Spinner />}>{children}</Suspense></PublicLayout>;
}
function Admin({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <AdminLayout><Suspense fallback={<Spinner />}>{children}</Suspense></AdminLayout>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <PageLoader />
          <CommandPalette />
          <Routes>
            <Route path="/" element={<Public><Home /></Public>} />
            <Route path="/store" element={<Public><Store /></Public>} />
            <Route path="/categories" element={<Public><Categories /></Public>} />
            <Route path="/category/:slug" element={<Public><CategoryDetail /></Public>} />
            <Route path="/product/:slug" element={<Public><ProductDetail /></Public>} />
            <Route path="/blog" element={<Public><Blog /></Public>} />
            <Route path="/blog/:slug" element={<Public><ArticleDetail /></Public>} />
            <Route path="/contact" element={<Public><Contact /></Public>} />
            <Route path="/privacy-policy" element={<Public><Privacy /></Public>} />
            <Route path="/terms" element={<Public><Terms /></Public>} />
            <Route path="/cookie-policy" element={<Public><Cookies /></Public>} />

            <Route path="/admin/login" element={<Suspense fallback={<Spinner />}><Login /></Suspense>} />
            <Route path="/admin" element={<Admin><Dashboard /></Admin>} />
            <Route path="/admin/products" element={<Admin><AdminProducts /></Admin>} />
            <Route path="/admin/categories" element={<Admin><AdminCategories /></Admin>} />
            <Route path="/admin/articles" element={<Admin><AdminArticles /></Admin>} />
            <Route path="/admin/sections" element={<Admin><AdminSections /></Admin>} />
            <Route path="/admin/navigation" element={<Admin><AdminNav /></Admin>} />
            <Route path="/admin/media" element={<Admin><AdminMedia /></Admin>} />
            <Route path="/admin/seo" element={<Admin><AdminSeo /></Admin>} />
            <Route path="/admin/messages" element={<Admin><AdminMessages /></Admin>} />
            <Route path="/admin/settings" element={<Admin><AdminSettings /></Admin>} />

            <Route path="*" element={<Public><NotFound /></Public>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
