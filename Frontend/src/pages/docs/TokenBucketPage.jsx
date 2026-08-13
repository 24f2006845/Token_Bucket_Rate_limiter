import Breadcrumbs from '../../components/Breadcrumbs';
import PreviousNext from '../../components/PreviousNext';
import TableOfContents from '../../components/TableOfContents';

const toc = [
  { id: 'what', label: 'What is Token Bucket' },
  { id: 'how', label: 'How It Works' },
  { id: 'params', label: 'Parameters' },
  { id: 'example', label: 'Example' },
  { id: 'why', label: 'Why Token Bucket' },
];

export default function TokenBucketPage() {
  return (
    <div className="flex gap-8 px-8 lg:px-12 py-10">
      <div className="flex-1 min-w-0 max-w-[820px]">
        <Breadcrumbs />
        <h1 className="text-[40px] font-bold text-text tracking-tight mb-4">Token Bucket</h1>
        <p className="text-text-secondary mb-10 text-base leading-relaxed">
          The token bucket algorithm used by RLaaS for rate limiting.
        </p>

        <h2 id="what" className="text-2xl font-semibold text-text mt-12 mb-4 scroll-mt-20">What is Token Bucket</h2>
        <p className="text-text-secondary mb-4">
          Token bucket is a rate limiting algorithm that uses a metaphorical bucket of tokens.
          Each request consumes one token. Tokens are refilled at a constant rate.
          When the bucket is empty, requests are denied until tokens are replenished.
        </p>

        <h2 id="how" className="text-2xl font-semibold text-text mt-12 mb-4 scroll-mt-20">How It Works</h2>
        <div className="border border-border rounded-md p-6 bg-surface my-4">
          <div className="space-y-6 font-mono text-sm">
            {/* Bucket visualization */}
            <div>
              <span className="text-text text-xs">Bucket (capacity: 5)</span>
              <div className="mt-2 flex gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-8 h-8 rounded border border-border-strong bg-surface-secondary flex items-center justify-center text-text-muted text-xs">
                    {i <= 4 ? '●' : '○'}
                  </div>
                ))}
              </div>
              <span className="text-text-muted text-xs mt-2 block">4 tokens remaining, 1 consumed</span>
            </div>

            <div className="border-t border-border pt-4 space-y-3">
              <div className="flex items-center gap-4">
                <span className="text-text w-24 flex-shrink-0">Request →</span>
                <span className="text-text-secondary">Consume 1 token from the bucket</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-text w-24 flex-shrink-0">Refill →</span>
                <span className="text-text-secondary">Add tokens at a fixed rate over time</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-text w-24 flex-shrink-0">Full →</span>
                <span className="text-text-secondary">Bucket never exceeds capacity</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-text w-24 flex-shrink-0">Empty →</span>
                <span className="text-text-secondary">Request denied with 429 and Retry-After</span>
              </div>
            </div>
          </div>
        </div>

        <h2 id="params" className="text-2xl font-semibold text-text mt-12 mb-4 scroll-mt-20">Parameters</h2>
        <div className="border border-border rounded-md overflow-hidden my-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="text-left px-4 py-3 text-text-muted font-medium text-xs">Parameter</th>
                <th className="text-left px-4 py-3 text-text-muted font-medium text-xs">Description</th>
                <th className="text-left px-4 py-3 text-text-muted font-medium text-xs">Example</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['capacity', 'Maximum tokens the bucket can hold', '5'],
                ['refillRate', 'Tokens added per interval', '1'],
                ['interval', 'Time between refills (seconds)', '60'],
              ].map(([param, desc, example]) => (
                <tr key={param} className="border-b border-border">
                  <td className="px-4 py-3 font-mono text-text text-xs">{param}</td>
                  <td className="px-4 py-3 text-text-secondary">{desc}</td>
                  <td className="px-4 py-3 font-mono text-text-muted text-xs">{example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 id="example" className="text-2xl font-semibold text-text mt-12 mb-4 scroll-mt-20">Example</h2>
        <p className="text-text-secondary mb-4">
          A login endpoint with capacity 5, refillRate 1, interval 60:
        </p>
        <div className="border border-border rounded-md p-6 bg-surface font-mono text-sm my-4 space-y-2">
          <div className="text-text-muted">t=0s</div>
          <div className="text-text-secondary">Bucket: <span className="text-text">● ● ● ● ●</span> — 5 tokens</div>
          <div className="text-text-muted mt-2">t=1s → 5 rapid requests</div>
          <div className="text-text-secondary">Bucket: <span className="text-text">○ ○ ○ ○ ○</span> — 0 tokens</div>
          <div className="text-text-muted mt-2">t=2s → 6th request</div>
          <div className="text-text-secondary">→ <span className="text-text">429 Too Many Requests</span> (Retry-After: 58)</div>
          <div className="text-text-muted mt-2">t=60s → refill</div>
          <div className="text-text-secondary">Bucket: <span className="text-text">● ○ ○ ○ ○</span> — 1 token refilled</div>
          <div className="text-text-muted mt-2">t=300s</div>
          <div className="text-text-secondary">Bucket: <span className="text-text">● ● ● ● ●</span> — back to full capacity</div>
        </div>

        <h2 id="why" className="text-2xl font-semibold text-text mt-12 mb-4 scroll-mt-20">Why Token Bucket</h2>
        <ul className="space-y-3 text-text-secondary">
          {[
            'Allows bursts — users can use all tokens at once if needed',
            'Smooth refill — tokens replenish gradually, not all at once',
            'Simple mental model — easy to reason about capacity and limits',
            'Atomic in Redis — Lua script prevents race conditions under concurrency',
            'Well-understood — battle-tested algorithm used by AWS, Google, Stripe',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-text-muted mt-1.5">—</span>
              {item}
            </li>
          ))}
        </ul>

        <PreviousNext
          prev={{ href: '/docs/architecture', label: 'Architecture' }}
        />
      </div>
      <TableOfContents items={toc} />
    </div>
  );
}
