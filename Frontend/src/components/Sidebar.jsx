import { Link, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';

const sections = [
  {
    label: 'GETTING STARTED',
    items: [
      { href: '/docs/quick-start', label: 'Quick Start' },
      { href: '/docs/installation', label: 'Installation' },
      { href: '/docs/configuration', label: 'Configuration' },
    ],
  },
  {
    label: 'SDK',
    items: [
      { href: '/docs/policies', label: 'Policies' },
      { href: '/docs/checking-limits', label: 'Checking Limits' },
      { href: '/docs/middleware', label: 'Express Middleware' },
    ],
  },
  {
    label: 'BACKEND API',
    items: [
      { href: '/docs/authentication', label: 'Authentication' },
      { href: '/docs/api-reference', label: 'API Reference' },
      { href: '/docs/errors', label: 'Errors' },
    ],
  },
  {
    label: 'CONCEPTS',
    items: [
      { href: '/docs/architecture', label: 'Architecture' },
      { href: '/docs/token-bucket', label: 'Token Bucket' },
    ],
  },
];

export default function Sidebar({ open, onClose }) {
  const { pathname } = useLocation();

  const content = (
    <div className="h-full overflow-y-auto py-6 px-4">
      {sections.map((section) => (
        <div key={section.label} className="mb-6">
          <p className="text-[10px] font-semibold tracking-[0.15em] text-text-muted uppercase mb-3 px-3">
            {section.label}
          </p>
          <nav className="space-y-0.5">
            {section.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={onClose}
                  className={`block px-3 py-1.5 text-sm rounded transition-colors ${
                    isActive
                      ? 'bg-hover text-yellow border-l-2 border-yellow'
                      : 'text-text-muted hover:bg-hover hover:text-text border-l-2 border-transparent'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-[250px] flex-shrink-0 border-r border-border h-[calc(100vh-64px)] sticky top-16">
        {content}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/80" onClick={onClose} />
          <aside className="absolute left-0 top-0 bottom-0 w-[280px] bg-bg border-r border-border animate-fade-in">
            <div className="h-16 px-4 flex items-center justify-between border-b border-border">
              <span className="text-sm font-semibold text-text">Navigation</span>
              <button onClick={onClose} className="text-text-muted hover:text-text transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            {content}
          </aside>
        </div>
      )}
    </>
  );
}

export { sections };
