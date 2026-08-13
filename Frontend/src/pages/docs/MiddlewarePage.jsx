import CodeBlock from '../../components/CodeBlock';
import Callout from '../../components/Callout';
import Breadcrumbs from '../../components/Breadcrumbs';
import PreviousNext from '../../components/PreviousNext';
import TableOfContents from '../../components/TableOfContents';

const toc = [
  { id: 'overview', label: 'Overview' },
  { id: 'setup', label: 'Setup' },
  { id: 'flow', label: 'How It Works' },
  { id: 'multiple', label: 'Multiple Routes' },
  { id: 'headers', label: 'Response Headers' },
  { id: 'without', label: 'Without Express' },
];

export default function MiddlewarePage() {
  return (
    <div className="flex gap-8 px-8 lg:px-12 py-10">
      <div className="flex-1 min-w-0 max-w-[820px]">
        <Breadcrumbs />
        <h1 className="text-[40px] font-bold text-text tracking-tight mb-4">Express Middleware</h1>
        <p className="text-text-secondary mb-10 text-base leading-relaxed">
          Drop-in Express middleware for automatic rate limiting on any route.
        </p>

        <h2 id="overview" className="text-2xl font-semibold text-text mt-12 mb-4 scroll-mt-20">Overview</h2>
        <p className="text-text-secondary mb-4">
          The SDK exports a <code className="font-mono text-sm text-text bg-code-surface px-1.5 py-0.5 rounded border border-border">rateLimit()</code> function
          that creates Express middleware from a limiter instance and a policy name.
        </p>

        <h2 id="setup" className="text-2xl font-semibold text-text mt-12 mb-4 scroll-mt-20">Setup</h2>
        <CodeBlock
          language="TypeScript"
          showLineNumbers
          code={`import { RateLimiter, rateLimit } from "token-bucket-rate-limiter-sdk";

const limiter = new RateLimiter({
  apiKey: process.env.RLAAS_API_KEY!
});

// Create middleware for the "login" policy
const loginLimiter = rateLimit(limiter, "login");

// Attach to a route
router.post(
  "/login",
  loginLimiter,
  loginController
);`}
        />

        <h2 id="flow" className="text-2xl font-semibold text-text mt-12 mb-4 scroll-mt-20">How It Works</h2>
        <div className="border border-border rounded-md p-6 bg-surface font-mono text-sm text-text-secondary my-4">
          <div className="flex flex-col items-center gap-0">
            {[
              { label: 'Incoming Request', width: 'w-52' },
              null,
              { label: 'loginLimiter', width: 'w-52' },
              null,
              { label: 'limiter.check("login")', width: 'w-52' },
            ].map((item, i) =>
              item === null ? (
                <div key={i} className="w-px h-5 bg-border-strong" />
              ) : (
                <div key={i} className={`${item.width} py-2 text-center border border-border bg-surface-secondary text-text text-xs`}>
                  {item.label}
                </div>
              )
            )}
            <div className="flex items-start gap-16 mt-0">
              <div className="flex flex-col items-center">
                <div className="w-px h-5 bg-border-strong" />
                <div className="w-28 py-2 text-center border border-border bg-surface-secondary text-text text-xs">ALLOW</div>
                <div className="w-px h-5 bg-border-strong" />
                <div className="text-xs text-text-muted">next()</div>
                <div className="w-px h-5 bg-border-strong" />
                <div className="w-28 py-2 text-center border border-border bg-surface-secondary text-text text-xs">Controller</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-px h-5 bg-border-strong" />
                <div className="w-28 py-2 text-center border border-border bg-surface-secondary text-text text-xs">DENY</div>
                <div className="w-px h-5 bg-border-strong" />
                <div className="text-xs text-text-muted">429</div>
              </div>
            </div>
          </div>
        </div>

        <h2 id="multiple" className="text-2xl font-semibold text-text mt-12 mb-4 scroll-mt-20">Multiple Routes</h2>
        <p className="text-text-secondary mb-4">
          Create different middleware for different policies:
        </p>
        <CodeBlock
          language="TypeScript"
          showLineNumbers
          code={`const loginLimiter  = rateLimit(limiter, "login");
const apiLimiter    = rateLimit(limiter, "api-general");
const uploadLimiter = rateLimit(limiter, "upload");

router.post("/login", loginLimiter, loginController);
router.get("/api/data", apiLimiter, dataController);
router.post("/upload", uploadLimiter, uploadController);`}
        />

        <h2 id="headers" className="text-2xl font-semibold text-text mt-12 mb-4 scroll-mt-20">Response Headers</h2>
        <p className="text-text-secondary mb-4">
          The middleware automatically sets these headers:
        </p>
        <div className="border border-border rounded-md overflow-hidden my-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="text-left px-4 py-3 text-text-muted font-medium text-xs">Header</th>
                <th className="text-left px-4 py-3 text-text-muted font-medium text-xs">When</th>
                <th className="text-left px-4 py-3 text-text-muted font-medium text-xs">Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['X-RateLimit-Limit', 'Allowed', 'Maximum capacity of the bucket'],
                ['X-RateLimit-Remaining', 'Allowed', 'Tokens remaining after this request'],
                ['Retry-After', 'Denied', 'Seconds until a token is available'],
              ].map(([header, when, desc]) => (
                <tr key={header} className="border-b border-border">
                  <td className="px-4 py-3 font-mono text-text text-xs">{header}</td>
                  <td className="px-4 py-3 text-text-muted text-xs">{when}</td>
                  <td className="px-4 py-3 text-text-secondary">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 id="without" className="text-2xl font-semibold text-text mt-12 mb-4 scroll-mt-20">Without Express</h2>
        <p className="text-text-secondary mb-4">
          The middleware is an Express integration. The core <code className="font-mono text-sm text-text bg-code-surface px-1.5 py-0.5 rounded border border-border">limiter.check()</code> method
          can be used with any framework or without a framework at all.
        </p>
        <Callout>
          For non-Express frameworks (Fastify, Koa, Hono), use <code>limiter.check()</code> directly in your handler and implement your own response logic.
        </Callout>

        <PreviousNext
          prev={{ href: '/docs/checking-limits', label: 'Checking Limits' }}
          next={{ href: '/docs/authentication', label: 'Authentication' }}
        />
      </div>
      <TableOfContents items={toc} />
    </div>
  );
}
