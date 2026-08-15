import CodeBlock from '../../components/CodeBlock';
import InstallTabs from '../../components/InstallTabs';
import Callout from '../../components/Callout';
import Breadcrumbs from '../../components/Breadcrumbs';
import PreviousNext from '../../components/PreviousNext';
import TableOfContents from '../../components/TableOfContents';

const toc = [
  { id: 'install', label: 'Install' },
  { id: 'env', label: 'Environment Variable' },
  { id: 'initialize', label: 'Initialize' },
  { id: 'configure', label: 'Configure a Policy' },
  { id: 'check', label: 'Check a Limit' },
  { id: 'express', label: 'Express Middleware' },
];

export default function QuickStartPage() {
  return (
    <div className="flex gap-8 px-8 lg:px-12 py-10">
      <div className="flex-1 min-w-0 max-w-[820px]">
        <Breadcrumbs />
        <h1 className="text-[40px] font-bold text-text tracking-tight mb-4">Quick Start</h1>
        <p className="text-text-secondary mb-10 text-base leading-relaxed">
          Install the SDK and make your first rate-limited request in under 5 minutes.
        </p>

        {/* ── 1. Install ─────────────────────────────────── */}
        <h2 id="install" className="text-2xl font-semibold text-text mt-12 mb-4 scroll-mt-20">1. Install</h2>
        <InstallTabs
          npm="npm install token-bucket-rate-limiter-sdk"
          pnpm="pnpm add token-bucket-rate-limiter-sdk"
          yarn="yarn add token-bucket-rate-limiter-sdk"
        />

        {/* ── 2. Environment Variable ────────────────────── */}
        <h2 id="env" className="text-2xl font-semibold text-text mt-12 mb-4 scroll-mt-20">2. Environment Variable</h2>
        <p className="text-text-secondary mb-4">
          Add your API key to a <code className="font-mono text-sm text-text bg-code-surface px-1.5 py-0.5 rounded border border-border">.env</code> file:
        </p>
        <CodeBlock language="env" code="RLAAS_API_KEY=rlaas_live_xxxxxxxxxxxxxxxxx" />
        <Callout type="warning">
          Keep API keys server-side. Never expose an RLaaS API key in browser code or commit it to version control.
        </Callout>

        {/* ── 3. Initialize ──────────────────────────────── */}
        <h2 id="initialize" className="text-2xl font-semibold text-text mt-12 mb-4 scroll-mt-20">3. Initialize</h2>
        <p className="text-text-secondary mb-4">
          Import the <code className="font-mono text-sm text-text bg-code-surface px-1.5 py-0.5 rounded border border-border">RateLimiter</code> class and create an instance with your API key:
        </p>
        <CodeBlock
          language="TypeScript"
          code={`import { RateLimiter } from "token-bucket-rate-limiter-sdk";

const limiter = new RateLimiter({
  apiKey: process.env.RLAAS_API_KEY!
});`}
        />
        <p className="text-text-secondary text-sm">
          The SDK automatically attaches the <code className="font-mono text-text bg-code-surface px-1.5 py-0.5 rounded border border-border text-xs">X-API-Key</code> header to every request.
        </p>

        {/* ── 4. Configure ───────────────────────────────── */}
        <h2 id="configure" className="text-2xl font-semibold text-text mt-12 mb-4 scroll-mt-20">4. Configure a Policy</h2>
        <p className="text-text-secondary mb-4">
          Define one or more rate limiting policies. Each policy specifies capacity, refill rate, and interval:
        </p>
        <CodeBlock
          language="TypeScript"
          code={`await limiter.configure([
  {
    name: "login",
    capacity: 5,
    refillRate: 1,
    interval: 60
  }
]);`}
        />
        <p className="text-text-secondary text-sm">
          This creates a policy called <code className="font-mono text-text bg-code-surface px-1.5 py-0.5 rounded border border-border text-xs">login</code> that
          allows 5 requests, refilling 1 token every 60 seconds. If the policy already exists, it will be updated.
        </p>

        {/* ── 5. Check ───────────────────────────────────── */}
        <h2 id="check" className="text-2xl font-semibold text-text mt-12 mb-4 scroll-mt-20">5. Check a Limit</h2>
        <p className="text-text-secondary mb-4">
          Before processing a request, check whether the policy allows it:
        </p>
        <CodeBlock
          language="TypeScript"
          code={`const result = await limiter.check("login");

if (!result.allowed) {
  // Request is rate-limited
  console.log("Retry after:", result.retryAfter, "seconds");
  return res.status(429).json({ message: "Too many requests" });
}

// Process the request normally`}
        />

        {/* ── 6. Express ─────────────────────────────────── */}
        <h2 id="express" className="text-2xl font-semibold text-text mt-12 mb-4 scroll-mt-20">6. Express Middleware</h2>
        <p className="text-text-secondary mb-4">
          Use the built-in Express middleware for automatic rate limiting on routes:
        </p>
        <CodeBlock
          language="TypeScript"
          code={`import { rateLimit } from "token-bucket-rate-limiter-sdk";

const loginLimiter = rateLimit(limiter, "login");

router.post(
  "/login",
  loginLimiter,
  loginController
);`}
        />
        <p className="text-text-secondary text-sm">
          The middleware automatically returns <code className="font-mono text-text bg-code-surface px-1.5 py-0.5 rounded border border-border text-xs">429 Too Many Requests</code> with
          a <code className="font-mono text-text bg-code-surface px-1.5 py-0.5 rounded border border-border text-xs">Retry-After</code> header when the limit is exceeded.
          Allowed requests receive <code className="font-mono text-text bg-code-surface px-1.5 py-0.5 rounded border border-border text-xs">X-RateLimit-Limit</code> and <code className="font-mono text-text bg-code-surface px-1.5 py-0.5 rounded border border-border text-xs">X-RateLimit-Remaining</code> headers.
        </p>

        <PreviousNext
          next={{ href: '/docs/installation', label: 'Installation' }}
        />
      </div>
      <TableOfContents items={toc} />
    </div>
  );
}
