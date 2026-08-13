import { useState } from 'react';
import CodeBlock from './CodeBlock';

export default function InstallTabs({ npm, pnpm, yarn }) {
  const [active, setActive] = useState('npm');
  const tabs = { npm, pnpm, yarn };

  return (
    <div>
      <div className="flex gap-0 border-b border-border mb-0">
        {Object.keys(tabs).map((key) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={`px-4 py-2 text-xs font-mono transition-colors border-b-2 -mb-px ${
              active === key
                ? 'border-text text-text'
                : 'border-transparent text-text-muted hover:text-text-secondary'
            }`}
          >
            {key}
          </button>
        ))}
      </div>
      <CodeBlock code={tabs[active]} language={active === 'npm' ? 'bash' : active} />
    </div>
  );
}
