import CodeBlock from '../../components/CodeBlock';
import Breadcrumbs from '../../components/Breadcrumbs';
import PreviousNext from '../../components/PreviousNext';
import TableOfContents from '../../components/TableOfContents';

const toc = [
  { id: 'basic', label: 'Basic Usage' },
  { id: 'result', label: 'Result Object' },
  { id: 'handling', label: 'Handling Results' },
  { id: 'errors', label: 'Error Handling' },
  { id: 'response', label: 'Response Example' },
];

export default function CheckingLimitsPage() {
  return (
    <div className="flex gap-8 px-8 lg:px-12 py-10">
      <div className="flex-1 min-w-0 max-w-[820px]">
        <Breadcrumbs />
        <h1 className="text-[40px] font-bold text-text tracking-tight mb-4">Checking Limits</h1>
        <p className="text-text-secondary mb-10 text-base leading-relaxed">
          Use the <code className="font-mono text-sm text-text bg-code-surface px-1.5 py-0.5 rounded border border-border">check()</code> method
          to consume a token and determine whether a request is allowed.
        </p>

        <h2 id="basic" className="text-2xl font-semibold text-text mt-12 mb-4 scroll-mt-20">Basic Usage</h2>
        <CodeBlock
          language="TypeScript"
          code={`const result = await limiter.check("login");

if (result.allowed) {
  // Process the request
} else {
  // Rate limited - reject the request
}`}
        />

        <h2 id="result" className="text-2xl font-semibold text-text mt-12 mb-4 scroll-mt-20">Result Object</h2>
        <p className="text-text-secondary mb-4">
          The <code className="font-mono text-sm text-text bg-code-surface px-1.5 py-0.5 rounded border border-border">check()</code> method
          returns a <code className="font-mono text-sm text-text bg-code-surface px-1.5 py-0.5 rounded border border-border">RateLimitResult</code> union type:
        </p>

        <p className="text-sm font-semibold text-text mt-6 mb-2">When allowed:</p>
        <div className="border border-border rounded-md overflow-hidden my-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="text-left px-4 py-3 text-text-muted font-medium text-xs">Field</th>
                <th className="text-left px-4 py-3 text-text-muted font-medium text-xs">Type</th>
                <th className="text-left px-4 py-3 text-text-muted font-medium text-xs">Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['allowed', 'true', 'Request is allowed'],
                ['limit', 'number', 'Maximum capacity of the bucket'],
                ['remainingTokens', 'number', 'Tokens remaining after this request'],
                ['retryAfter', 'number', 'Seconds until next refill'],
              ].map(([field, type, desc]) => (
                <tr key={field} className="border-b border-border">
                  <td className="px-4 py-3 font-mono text-text text-xs">{field}</td>
                  <td className="px-4 py-3 font-mono text-text-muted text-xs">{type}</td>
                  <td className="px-4 py-3 text-text-secondary">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-sm font-semibold text-text mt-6 mb-2">When blocked:</p>
        <div className="border border-border rounded-md overflow-hidden my-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="text-left px-4 py-3 text-text-muted font-medium text-xs">Field</th>
                <th className="text-left px-4 py-3 text-text-muted font-medium text-xs">Type</th>
                <th className="text-left px-4 py-3 text-text-muted font-medium text-xs">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="px-4 py-3 font-mono text-text text-xs">allowed</td>
                <td className="px-4 py-3 font-mono text-text-muted text-xs">false</td>
                <td className="px-4 py-3 text-text-secondary">Request is rate-limited</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-3 font-mono text-text text-xs">retryAfter</td>
                <td className="px-4 py-3 font-mono text-text-muted text-xs">number | undefined</td>
                <td className="px-4 py-3 text-text-secondary">Seconds until a token is available</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 id="handling" className="text-2xl font-semibold text-text mt-12 mb-4 scroll-mt-20">Handling Results</h2>
        <CodeBlock
          language="TypeScript"
          showLineNumbers
          code={`app.post("/login", async (req, res) => {
  const result = await limiter.check("login");

  if (!result.allowed) {
    return res.status(429).json({
      message: "Too many login attempts",
      retryAfter: result.retryAfter
    });
  }

  // Proceed with login logic
  const user = await authenticateUser(req.body);
  res.json({ user });
});`}
        />

        <h2 id="errors" className="text-2xl font-semibold text-text mt-12 mb-4 scroll-mt-20">Error Handling</h2>
        <p className="text-text-secondary mb-4">
          Rate-limited responses (429) are <strong className="text-text">not</strong> thrown as errors.
          They are returned as <code className="font-mono text-sm text-text bg-code-surface px-1.5 py-0.5 rounded border border-border">{'{ allowed: false }'}</code>.
          Only network failures, authentication errors, and validation errors throw.
        </p>
        <CodeBlock
          language="TypeScript"
          code={`import { AuthenticationError, NetworkError } from "token-bucket-rate-limiter-sdk";

try {
  const result = await limiter.check("login");
  // result.allowed is always defined
} catch (error) {
  if (error instanceof AuthenticationError) {
    // Invalid or revoked API key
  }
  if (error instanceof NetworkError) {
    // Could not reach the API
  }
}`}
        />

        <h2 id="response" className="text-2xl font-semibold text-text mt-12 mb-4 scroll-mt-20">Response Example</h2>
        <p className="text-sm text-text-muted mb-2">Allowed response:</p>
        <CodeBlock
          language="json"
          code={`{
  "allowed": true,
  "limit": 5,
  "remainingTokens": 4,
  "retryAfter": 0
}`}
        />
        <p className="text-sm text-text-muted mb-2 mt-4">Blocked response:</p>
        <CodeBlock
          language="json"
          code={`{
  "allowed": false,
  "retryAfter": 45
}`}
        />

        <PreviousNext
          prev={{ href: '/docs/policies', label: 'Policies' }}
          next={{ href: '/docs/middleware', label: 'Express Middleware' }}
        />
      </div>
      <TableOfContents items={toc} />
    </div>
  );
}
