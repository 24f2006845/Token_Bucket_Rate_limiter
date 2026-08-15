import { useEffect, useState } from 'react';

export default function TableOfContents({ items }) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: '-80px 0px -70% 0px' }
    );

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (!items || items.length === 0) return null;

  return (
    <div className="hidden xl:block w-[220px] flex-shrink-0">
      <div className="sticky top-20">
        <p className="text-[10px] font-semibold tracking-[0.15em] text-text-muted uppercase mb-4">On this page</p>
        <nav className="space-y-2">
          {items.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className={`block text-[13px] transition-colors ${
                activeId === id ? 'text-text' : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
