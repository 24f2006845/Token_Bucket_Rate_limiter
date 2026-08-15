import { ReactNode, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import { Loader2, Moon, Sun } from 'lucide-react';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AdminRoute({ children }: { children: ReactNode }) {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function GuestRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

import LandingPage from './pages/LandingPage';
import DocsLayout from './components/DocsLayout';
import QuickStartPage from './pages/docs/QuickStartPage';
import InstallationPage from './pages/docs/InstallationPage';
import ConfigurationPage from './pages/docs/ConfigurationPage';
import PoliciesPage from './pages/docs/PoliciesPage';
import CheckingLimitsPage from './pages/docs/CheckingLimitsPage';
import MiddlewarePage from './pages/docs/MiddlewarePage';
import AuthenticationDocPage from './pages/docs/AuthenticationDocPage';
import ApiReferencePage from './pages/docs/ApiReferencePage';
import ErrorsPage from './pages/docs/ErrorsPage';
import ArchitecturePage from './pages/docs/ArchitecturePage';
import TokenBucketPage from './pages/docs/TokenBucketPage';

type ThemeMode = 'light' | 'dark';
const THEME_STORAGE_KEY = 'rlaas-theme-mode';

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'dark';
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/docs" element={<DocsLayout />}>
        <Route index element={<Navigate to="/docs/quick-start" replace />} />
        <Route path="quick-start" element={<QuickStartPage />} />
        <Route path="installation" element={<InstallationPage />} />
        <Route path="configuration" element={<ConfigurationPage />} />
        <Route path="policies" element={<PoliciesPage />} />
        <Route path="checking-limits" element={<CheckingLimitsPage />} />
        <Route path="middleware" element={<MiddlewarePage />} />
        <Route path="authentication" element={<AuthenticationDocPage />} />
        <Route path="api-reference" element={<ApiReferencePage />} />
        <Route path="errors" element={<ErrorsPage />} />
        <Route path="architecture" element={<ArchitecturePage />} />
        <Route path="token-bucket" element={<TokenBucketPage />} />
      </Route>
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  const [themeMode, setThemeMode] = useState<ThemeMode>(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode);
    window.localStorage.setItem(THEME_STORAGE_KEY, themeMode);
  }, [themeMode]);

  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <button
          type="button"
          aria-label={`Switch to ${themeMode === 'dark' ? 'light' : 'dark'} mode`}
          onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
          className="fixed bottom-6 right-6 z-[70] flex items-center gap-2 px-3 py-2 rounded-full border border-border bg-surface text-text shadow-sm hover:border-border-strong hover:bg-hover transition-colors"
        >
          {themeMode === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          <span className="hidden sm:inline text-xs font-medium">
            {themeMode === 'dark' ? 'Light mode' : 'Dark mode'}
          </span>
        </button>
      </AuthProvider>
    </BrowserRouter>
  );
}
