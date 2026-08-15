import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const crumbLabels: Record<string, string> = {
  docs: 'Docs',
  'quick-start': 'Quick Start',
  installation: 'Installation',
  configuration: 'Configuration',
  policies: 'Policies',
  middleware: 'Middleware',
  'checking-limits': 'Checking Limits',
  authentication: 'Authentication',
  errors: 'Errors',
  'api-reference': 'API Reference',
  architecture: 'Architecture',
  'token-bucket': 'Token Bucket',
  dashboard: 'Dashboard',
  admin: 'Admin',
  login: 'Login',
  register: 'Register',
};

export default function Breadcrumbs() {
  const { pathname } = useLocation();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <nav className="flex items-center gap-1.5 text-xs text-text-muted mb-8">
      <Link to="/" className="hover:text-text transition-colors">Home</Link>
      {segments.map((seg, i) => {
        const path = '/' + segments.slice(0, i + 1).join('/');
        const isLast = i === segments.length - 1;
        return (
          <span key={path} className="flex items-center gap-1.5">
            <ChevronRight className="w-3 h-3" />
            {isLast ? (
              <span className="text-text">{crumbLabels[seg] || seg}</span>
            ) : (
              <Link to={path} className="hover:text-text transition-colors">
                {crumbLabels[seg] || seg}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
