import CodeBlock from '../../components/CodeBlock';
import Breadcrumbs from '../../components/Breadcrumbs';
import PreviousNext from '../../components/PreviousNext';
import TableOfContents from '../../components/TableOfContents';

const toc = [
  { id: 'status-codes', label: 'Status Codes' },
  { id: 'error-classes', label: 'Error Classes' },
  { id: 'handling', label: 'Error Handling' },
];

export default function ErrorsPage() {
  return (
    <div className="flex gap-8 px-8 lg:px-12 py-10">
      <div className="flex-1 min-w-0 max-w-[820px]">
        <Breadcrumbs />
        <h1 className="text-[40px] font-bold text-text tracking-tight mb-4">Errors</h1>
        <p className="text-text-secondary mb-10 text-base leading-relaxed">
          HTTP status codes and SDK error classes reference.
        </p>

        <h2 id="status-codes" className="text-2xl font-semibold text-text mt-12 mb-4 scroll-mt-20">Status Codes</h2>
        <div className="border border-border rounded-md overflow-hidden my-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="text-left px-4 py-3 text-text-muted font-medium text-xs">Status</th>
                <th className="text-left px-4 py-3 text-text-muted font-medium text-xs">Meaning</th>
                <th className="text-left px-4 py-3 text-text-muted font-medium text-xs">Typical Cause</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['400', 'Bad Request', 'Invalid configuration or missing required fields'],
                ['401', 'Unauthorized', 'Invalid or missing API key'],
                ['403', 'Forbidden', 'Revoked API key or suspended user'],
                ['404', 'Not Found', 'Policy does not exist'],
                ['429', 'Rate Limited', 'No available tokens in the bucket'],
                ['500', 'Server Error', 'Backend failure'],
              ].map(([status, meaning, cause]) => (
                <tr key={status} className="border-b border-border">
                  <td className="px-4 py-3 font-mono text-text text-xs">{status}</td>
                  <td className="px-4 py-3 text-text font-medium">{meaning}</td>
                  <td className="px-4 py-3 text-text-secondary">{cause}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 id="error-classes" className="text-2xl font-semibold text-text mt-12 mb-4 scroll-mt-20">Error Classes</h2>
        <p className="text-text-secondary mb-4">
          The SDK exports typed error classes that extend a base <code className="font-mono text-sm text-text bg-code-surface px-1.5 py-0.5 rounded border border-border">RateLimiterError</code>:
        </p>
        <div className="border border-border rounded-md overflow-hidden my-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="text-left px-4 py-3 text-text-muted font-medium text-xs">Class</th>
                <th className="text-left px-4 py-3 text-text-muted font-medium text-xs">Status</th>
                <th className="text-left px-4 py-3 text-text-muted font-medium text-xs">When</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['RateLimiterError', '—', 'Base error class for all SDK errors'],
                ['AuthenticationError', '401, 403', 'Invalid, missing, or revoked API key'],
                ['ValidationError', '400, 422', 'Invalid SDK input or API validation failure'],
                ['RateLimitError', '429', 'Policy has no available tokens'],
                ['NetworkError', '—', 'Could not reach the rate limiter API'],
              ].map(([cls, status, when]) => (
                <tr key={cls} className="border-b border-border">
                  <td className="px-4 py-3 font-mono text-text text-xs">{cls}</td>
                  <td className="px-4 py-3 font-mono text-text-muted text-xs">{status}</td>
                  <td className="px-4 py-3 text-text-secondary">{when}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 id="handling" className="text-2xl font-semibold text-text mt-12 mb-4 scroll-mt-20">Error Handling</h2>
        <CodeBlock
          language="TypeScript"
          showLineNumbers
          code={`import {
  RateLimiterError,
  AuthenticationError,
  ValidationError,
  NetworkError,
  RateLimitError
} from "token-bucket-rate-limiter-sdk";

try {
  const result = await limiter.check("login");
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error("Auth failed:", error.message);
    // Invalid or revoked API key
  }

  if (error instanceof ValidationError) {
    console.error("Validation:", error.message);
    // Bad input — check policy name
  }

  if (error instanceof NetworkError) {
    console.error("Network:", error.message);
    // API unreachable — retry or fail open
  }

  if (error instanceof RateLimiterError) {
    console.error("SDK error:", error.statusCode);
  }
}`}
        />
        <p className="text-text-secondary text-sm mt-4">
          Note: <code className="font-mono text-text bg-code-surface px-1.5 py-0.5 rounded border border-border text-xs">RateLimitError</code> (429)
          is caught internally by <code className="font-mono text-text bg-code-surface px-1.5 py-0.5 rounded border border-border text-xs">limiter.check()</code> and
          returned as <code className="font-mono text-text bg-code-surface px-1.5 py-0.5 rounded border border-border text-xs">{'{ allowed: false }'}</code> — it is
          not thrown. Only network, auth, and validation errors throw.
        </p>

        <PreviousNext
          prev={{ href: '/docs/api-reference', label: 'API Reference' }}
          next={{ href: '/docs/architecture', label: 'Architecture' }}
        />
      </div>
      <TableOfContents items={toc} />
    </div>
  );
}
