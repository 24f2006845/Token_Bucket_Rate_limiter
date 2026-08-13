import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import SearchDialog from './SearchDialog';

export default function DocsLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handler = () => setSearchOpen(true);
    document.addEventListener('open-search', handler);
    return () => document.removeEventListener('open-search', handler);
  }, []);

  return (
    <div className="min-h-screen bg-bg">
      <Navbar
        onMenuClick={() => setSidebarOpen(true)}
        onSearchClick={() => setSearchOpen(true)}
      />
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />

      <div className="flex pt-16 max-w-[1440px] mx-auto">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-20">
        <div className="max-w-[1440px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm font-medium text-text-muted">RLaaS</span>
          <div className="flex items-center gap-6">
            <a href="/docs/quick-start" className="text-xs text-text-muted hover:text-text-secondary transition-colors">Documentation</a>
            <a href="/docs/api-reference" className="text-xs text-text-muted hover:text-text-secondary transition-colors">API Reference</a>
            <a href="https://github.com" className="text-xs text-text-muted hover:text-text-secondary transition-colors">GitHub</a>
          </div>
          <span className="text-xs text-text-muted">© 2026 RLaaS</span>
        </div>
      </footer>
    </div>
  );
}
