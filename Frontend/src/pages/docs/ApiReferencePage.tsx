import CodeBlock from '../../components/CodeBlock';
import Breadcrumbs from '../../components/Breadcrumbs';
import PreviousNext from '../../components/PreviousNext';
import TableOfContents from '../../components/TableOfContents';

const toc = [
  { id: 'policy-sync', label: 'Policy Sync' },
  { id: 'limiter-check', label: 'Rate Limit Check' },
  { id: 'sdk-check', label: 'RateLimiter.check()' },
  { id: 'sdk-configure', label: 'RateLimiter.configure()' },
  { id: 'ratelimit-fn', label: 'rateLimit()' },
];

interface EndpointBlockProps {
  method: string;
  path: string;
  description: string;
  headers?: string;
  body?: string;
  response?: string;
}

function EndpointBlock({ method, path, description, headers, body, response }: EndpointBlockProps) {
  return (
    <div className="border border-border rounded-md overflow-hidden my-6">
      <div className="px-4 py-3 bg-surface border-b border-border flex items-center gap-3">
        <span className="text-xs font-mono font-semibold text-text bg-surface-secondary px-2 py-0.5 rounded border border-border">
          {method}
        </span>
        <code className="text-sm font-mono text-text">{path}</code>
      </div>
      <div className="p-4 space-y-4">
        <p className="text-sm text-text-secondary">{description}</p>
        {headers && (
          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Headers</p>
            <CodeBlock language="http" code={headers} />
          </div>
        )}
        {body && (
          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Request Body</p>
            <CodeBlock language="json" code={body} />
          </div>
        )}
        {response && (
          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Response</p>
            <CodeBlock language="json" code={response} />
          </div>
        )}
      </div>
    </div>
  );
}

interface ParamItem {
  name: string;
  type: string;
  desc: string;
}

interface SignatureBlockProps {
  name: string;
  signature: string;
  params?: ParamItem[];
  returns?: string;
}

function SignatureBlock({ name, signature, params, returns }: SignatureBlockProps) {
  return (
    <div className="border border-border rounded-md overflow-hidden my-6">
      <div className="px-4 py-3 bg-surface border-b border-border">
        <code className="text-sm font-mono font-semibold text-text">{name}</code>
      </div>
      <div className="p-4 space-y-4">
        <div>
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Signature</p>
          <CodeBlock language="TypeScript" code={signature} />
        </div>
        {params && (
          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Parameters</p>
            <div className="border border-border rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  {params.map(({ name, type, desc }) => (
                    <tr key={name} className="border-b border-border last:border-0">
                      <td className="px-4 py-2.5 font-mono text-text text-xs w-[120px]">{name}</td>
                      <td className="px-4 py-2.5 font-mono text-text-muted text-xs w-[180px]">{type}</td>
                      <td className="px-4 py-2.5 text-text-secondary text-xs">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {returns && (
          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Returns</p>
            <p className="text-sm font-mono text-text-secondary">{returns}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ApiReferencePage() {
  return (
    <div className="flex gap-8 px-8 lg:px-12 py-10">
      <div className="flex-1 min-w-0 max-w-[820px]">
        <Breadcrumbs />
        <h1 className="text-[40px] font-bold text-text tracking-tight mb-4">API Reference</h1>
        <p className="text-text-secondary mb-10 text-base leading-relaxed">
          Complete reference for the backend HTTP API and the TypeScript SDK interface.
        </p>

        {/* ── Backend API ──────────────────────────────── */}
        <h2 id="policy-sync" className="text-2xl font-semibold text-text mt-12 mb-2 scroll-mt-20">Policy Sync</h2>
        <p className="text-text-secondary text-sm mb-2">Create or update rate limiting policies for an API key.</p>
        <EndpointBlock
          method="POST"
          path="/api/policy/sync"
          description="Synchronizes one or more policies. Policies are matched by name within the API key scope — existing policies are updated, new ones are created."
          headers={`X-API-Key: <api-key>
Content-Type: application/json`}
          body={`{
  "policies": [
    {
      "name": "login",
      "capacity": 5,
      "refillRate": 1,
      "interval": 60
    }
  ]
}`}
          response={`{
  "success": true,
  "message": "Policies synchronized successfully",
  "data": { "synced": 1 }
}`}
        />

        <h2 id="limiter-check" className="text-2xl font-semibold text-text mt-12 mb-2 scroll-mt-20">Rate Limit Check</h2>
        <p className="text-text-secondary text-sm mb-2">Atomically check and consume a token from a policy.</p>
        <EndpointBlock
          method="POST"
          path="/api/limiter/check"
          description="Performs an atomic token-bucket check via Redis. Returns 200 with remaining tokens if allowed, or 429 with Retry-After if denied."
          headers={`X-API-Key: <api-key>
Content-Type: application/json`}
          body={`{
  "policy": "login"
}`}
          response={`{
  "success": true,
  "data": {
    "allowed": true,
    "limit": 5,
    "remainingTokens": 4,
    "retryAfter": 0
  }
}`}
        />

        {/* ── SDK API ──────────────────────────────────── */}
        <h2 id="sdk-check" className="text-2xl font-semibold text-text mt-16 mb-2 scroll-mt-20">RateLimiter.check()</h2>
        <p className="text-text-secondary text-sm mb-2">Check whether a request is allowed by a policy.</p>
        <SignatureBlock
          name="RateLimiter.check()"
          signature="check(policy: string): Promise<RateLimitResult>"
          params={[
            { name: 'policy', type: 'string', desc: 'The policy name configured in RLaaS' },
          ]}
          returns="Promise<RateLimitResult>"
        />

        <h2 id="sdk-configure" className="text-2xl font-semibold text-text mt-12 mb-2 scroll-mt-20">RateLimiter.configure()</h2>
        <p className="text-text-secondary text-sm mb-2">Create or update policies via the sync API.</p>
        <SignatureBlock
          name="RateLimiter.configure()"
          signature="configure(policies: PolicyConfig[]): Promise<SyncPoliciesResult>"
          params={[
            { name: 'policies', type: 'PolicyConfig[]', desc: 'Array of policy configurations to sync' },
          ]}
          returns="Promise<SyncPoliciesResult>"
        />

        <h2 id="ratelimit-fn" className="text-2xl font-semibold text-text mt-12 mb-2 scroll-mt-20">rateLimit()</h2>
        <p className="text-text-secondary text-sm mb-2">Create Express middleware from a limiter and policy name.</p>
        <SignatureBlock
          name="rateLimit()"
          signature="rateLimit(limiter: RateLimiter, policy: string): RequestHandler"
          params={[
            { name: 'limiter', type: 'RateLimiter', desc: 'Initialized RateLimiter instance' },
            { name: 'policy', type: 'string', desc: 'The policy name to enforce' },
          ]}
          returns="Express RequestHandler"
        />

        <PreviousNext
          prev={{ href: '/docs/authentication', label: 'Authentication' }}
          next={{ href: '/docs/errors', label: 'Errors' }}
        />
      </div>
      <TableOfContents items={toc} />
    </div>
  );
}
