import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, Search } from 'lucide-react';

export default function Navbar({ onMenuClick, onSearchClick }) {
  const { user } = useAuth();
  const { pathname } = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg border-b border-border h-16">
      <div className="h-full px-6 flex items-center justify-between max-w-[1440px] mx-auto">
        {/* Left */}
        <div className="flex items-center gap-6">
          <button onClick={onMenuClick} className="lg:hidden text-text-muted hover:text-text transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <Link to="/" className="text-base font-semibold text-text tracking-tight">
            RLaaS
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/docs/quick-start"
              className={`text-sm transition-colors ${
                pathname.startsWith('/docs') ? 'text-text' : 'text-text-muted hover:text-text'
              }`}
            >
              Docs
            </Link>
            <Link
              to="/docs/api-reference"
              className={`text-sm transition-colors ${
                pathname === '/docs/api-reference' ? 'text-text' : 'text-text-muted hover:text-text'
              }`}
            >
              API Reference
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-text-muted hover:text-text transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <button
            onClick={onSearchClick}
            className="flex items-center gap-3 px-3 py-1.5 border border-border rounded-md text-sm text-text-muted hover:border-border-strong hover:text-text-secondary transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search documentation</span>
            <kbd className="hidden sm:inline text-[10px] bg-surface-secondary px-1.5 py-0.5 rounded border border-border font-mono">⌘K</kbd>
          </button>
          {user ? (
            <Link
              to="/dashboard"
              className="px-4 py-1.5 bg-text text-bg text-sm font-medium rounded-md hover:bg-white-hover transition-colors"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              to="/login"
              className="px-4 py-1.5 bg-text text-bg text-sm font-medium rounded-md hover:bg-white-hover transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
