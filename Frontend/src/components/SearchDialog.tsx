import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';

const searchItems = [
  { label: 'Quick Start', href: '/docs/quick-start', section: 'Getting Started' },
  { label: 'Installation', href: '/docs/installation', section: 'Getting Started' },
  { label: 'Configuration', href: '/docs/configuration', section: 'Getting Started' },
  { label: 'Policies', href: '/docs/policies', section: 'SDK' },
  { label: 'Checking Limits', href: '/docs/checking-limits', section: 'SDK' },
  { label: 'Express Middleware', href: '/docs/middleware', section: 'SDK' },
  { label: 'Authentication', href: '/docs/authentication', section: 'Backend API' },
  { label: 'API Reference', href: '/docs/api-reference', section: 'Backend API' },
  { label: 'Errors', href: '/docs/errors', section: 'Backend API' },
  { label: 'Architecture', href: '/docs/architecture', section: 'Concepts' },
  { label: 'Token Bucket', href: '/docs/token-bucket', section: 'Concepts' },
  { label: 'Dashboard', href: '/dashboard', section: 'App' },
  { label: 'Admin Panel', href: '/admin', section: 'App' },
];

export interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchDialog({ open, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (open) onClose();
        else if (!open) document.dispatchEvent(new CustomEvent('open-search'));
      }
      if (e.key === 'Escape' && open) onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  const filtered = query.trim()
    ? searchItems.filter(
        (item) =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          item.section.toLowerCase().includes(query.toLowerCase())
      )
    : searchItems;

  const handleSelect = (href: string) => {
    navigate(href);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[20vh]">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-bg border border-border rounded-lg overflow-hidden animate-fade-in">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="w-4 h-4 text-text-muted flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documentation..."
            className="flex-1 bg-transparent text-sm text-text placeholder-text-muted outline-none"
          />
          <kbd className="text-[10px] text-text-muted bg-surface-secondary px-1.5 py-0.5 rounded border border-border font-mono">ESC</kbd>
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-text-muted">No results found.</div>
          ) : (
            filtered.map((item) => (
              <button
                key={item.href}
                onClick={() => handleSelect(item.href)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-hover transition-colors text-left group"
              >
                <div>
                  <p className="text-sm text-text">{item.label}</p>
                  <p className="text-xs text-text-muted">{item.section}</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
