import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import { Loader2 } from 'lucide-react';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AdminRoute({ children }) {
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
  return children;
}

function GuestRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (user) return <Navigate to="/dashboard" replace />;
  return children;
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
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
