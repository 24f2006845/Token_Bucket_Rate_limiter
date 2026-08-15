import Breadcrumbs from '../../components/Breadcrumbs';
import PreviousNext from '../../components/PreviousNext';
import TableOfContents from '../../components/TableOfContents';

const toc = [
  { id: 'overview', label: 'Overview' },
  { id: 'layers', label: 'SDK Layers' },
  { id: 'ratelimiter', label: 'RateLimiter' },
  { id: 'client', label: 'RateLimiterClient' },
  { id: 'request', label: 'request()' },
  { id: 'backend', label: 'Backend' },
  { id: 'redis', label: 'Redis + Lua' },
];

interface ArchBoxProps {
  label: string;
  desc?: string;
}

function ArchBox({ label, desc }: ArchBoxProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-[320px] border border-border bg-surface rounded-sm">
        <div className="px-4 py-3 text-sm font-mono text-text">{label}</div>
        {desc && <div className="px-4 py-2 border-t border-border text-xs text-text-muted">{desc}</div>}
      </div>
    </div>
  );
}

export default function ArchitecturePage() {
  return (
    <div className="flex gap-8 px-8 lg:px-12 py-10">
      <div className="flex-1 min-w-0 max-w-[820px]">
        <Breadcrumbs />
        <h1 className="text-[40px] font-bold text-text tracking-tight mb-4">Architecture</h1>
        <p className="text-text-secondary mb-10 text-base leading-relaxed">
          How the SDK, API, and Redis work together to enforce rate limits.
        </p>

        <h2 id="overview" className="text-2xl font-semibold text-text mt-12 mb-4 scroll-mt-20">Overview</h2>
        <div className="border border-border rounded-md p-8 bg-surface my-6">
          <div className="flex flex-col items-center gap-0">
            {[
              'Your Application',
              'RateLimiter (SDK)',
              'RateLimiterClient',
              'fetch() → RLaaS API',
              'Redis + Lua Script',
              'Token Bucket State',
            ].map((label, i, arr) => (
              <div key={label} className="flex flex-col items-center">
                <div className="w-[280px] py-2.5 text-center text-xs font-mono text-text border border-border bg-surface-secondary">
                  {label}
                </div>
                {i < arr.length - 1 && <div className="w-px h-5 bg-border-strong" />}
              </div>
            ))}
          </div>
        </div>

        <h2 id="layers" className="text-2xl font-semibold text-text mt-12 mb-4 scroll-mt-20">SDK Layers</h2>
        <p className="text-text-secondary mb-6">
          The SDK is organized into clear layers, each with a single responsibility:
        </p>

        <h3 id="ratelimiter" className="text-lg font-semibold text-text mt-8 mb-3 scroll-mt-20">RateLimiter</h3>
        <p className="text-text-secondary mb-4">
          Public developer-facing SDK interface. Provides <code className="font-mono text-sm text-text bg-code-surface px-1.5 py-0.5 rounded border border-border">check()</code> and
          <code className="font-mono text-sm text-text bg-code-surface px-1.5 py-0.5 rounded border border-border ml-1">configure()</code> methods.
          Converts 429 errors into <code className="font-mono text-sm text-text bg-code-surface px-1.5 py-0.5 rounded border border-border">{'{ allowed: false }'}</code> results.
        </p>

        <h3 id="client" className="text-lg font-semibold text-text mt-8 mb-3 scroll-mt-20">RateLimiterClient</h3>
        <p className="text-text-secondary mb-4">
          HTTP communication layer. Handles URL construction, API key attachment, response parsing, and typed error mapping.
        </p>

        <h3 id="request" className="text-lg font-semibold text-text mt-8 mb-3 scroll-mt-20">request()</h3>
        <p className="text-text-secondary mb-4">
          Shared HTTP helper inside the client that:
        </p>
        <ul className="space-y-2 text-text-secondary mb-4">
          <li className="flex items-start gap-2"><span className="text-text-muted mt-1.5">—</span> Builds the full URL from base + path</li>
          <li className="flex items-start gap-2"><span className="text-text-muted mt-1.5">—</span> Adds the <code className="font-mono text-xs text-text bg-code-surface px-1.5 py-0.5 rounded border border-border">X-API-Key</code> header</li>
          <li className="flex items-start gap-2"><span className="text-text-muted mt-1.5">—</span> Calls <code className="font-mono text-xs text-text bg-code-surface px-1.5 py-0.5 rounded border border-border">fetch()</code></li>
          <li className="flex items-start gap-2"><span className="text-text-muted mt-1.5">—</span> Handles HTTP errors and maps them to typed SDK errors</li>
          <li className="flex items-start gap-2"><span className="text-text-muted mt-1.5">—</span> Parses JSON responses</li>
        </ul>

        <h3 id="backend" className="text-lg font-semibold text-text mt-8 mb-3 scroll-mt-20">Backend</h3>
        <p className="text-text-secondary mb-4">
          The RLaaS API server performs API key authentication, policy lookup via Prisma/PostgreSQL, and delegates rate limit enforcement to Redis.
        </p>

        <h3 id="redis" className="text-lg font-semibold text-text mt-8 mb-3 scroll-mt-20">Redis + Lua</h3>
        <p className="text-text-secondary mb-4">
          Redis maintains the token bucket state. A Lua script performs the refill and consume operation atomically — no race conditions even under high concurrency.
        </p>

        <PreviousNext
          prev={{ href: '/docs/errors', label: 'Errors' }}
          next={{ href: '/docs/token-bucket', label: 'Token Bucket' }}
        />
      </div>
      <TableOfContents items={toc} />
    </div>
  );
}
