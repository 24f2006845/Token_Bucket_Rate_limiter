import CodeBlock from '../../components/CodeBlock';
import Callout from '../../components/Callout';
import Breadcrumbs from '../../components/Breadcrumbs';
import PreviousNext from '../../components/PreviousNext';
import TableOfContents from '../../components/TableOfContents';

const toc = [
  { id: 'api-key', label: 'API Key Authentication' },
  { id: 'how', label: 'How It Works' },
  { id: 'generate', label: 'Generating Keys' },
  { id: 'security', label: 'Security Best Practices' },
];

export default function AuthenticationPage() {
  return (
    <div className="flex gap-8 px-8 lg:px-12 py-10">
      <div className="flex-1 min-w-0 max-w-[820px]">
        <Breadcrumbs />
        <h1 className="text-[40px] font-bold text-text tracking-tight mb-4">Authentication</h1>
        <p className="text-text-secondary mb-10 text-base leading-relaxed">
          All SDK and API requests are authenticated using an API key.
        </p>

        <h2 id="api-key" className="text-2xl font-semibold text-text mt-12 mb-4 scroll-mt-20">API Key Authentication</h2>
        <p className="text-text-secondary mb-4">
          The API uses the <code className="font-mono text-sm text-text bg-code-surface px-1.5 py-0.5 rounded border border-border">X-API-Key</code> header
          for authentication:
        </p>
        <CodeBlock
          language="http"
          code="X-API-Key: rlaas_live_xxxxxxxxxxxxxxxxx"
        />

        <h2 id="how" className="text-2xl font-semibold text-text mt-12 mb-4 scroll-mt-20">How It Works</h2>
        <p className="text-text-secondary mb-4">
          When you initialize the SDK, it automatically attaches your API key to every request:
        </p>
        <div className="border border-border rounded-md p-6 bg-surface font-mono text-sm text-text-secondary my-4">
          <div className="flex flex-col items-center gap-0">
            {[
              'SDK',
              'adds X-API-Key automatically',
              'RLaaS API',
              'API-key hash lookup',
              'Authenticated',
            ].map((label, i, arr) => (
              <div key={i}>
                <div className="text-center text-xs text-text py-1">{label}</div>
                {i < arr.length - 1 && <div className="w-px h-4 bg-border-strong mx-auto" />}
              </div>
            ))}
          </div>
        </div>
        <p className="text-text-secondary text-sm">
          You do not need to manually add the API key to each request when using the SDK.
          The <code className="font-mono text-text bg-code-surface px-1.5 py-0.5 rounded border border-border text-xs">RateLimiterClient</code> handles this internally.
        </p>

        <h2 id="generate" className="text-2xl font-semibold text-text mt-12 mb-4 scroll-mt-20">Generating Keys</h2>
        <p className="text-text-secondary mb-4">
          API keys are generated through the dashboard or via the REST API:
        </p>
        <CodeBlock
          language="bash"
          code={`curl -X POST http://localhost:3000/api/apikey/generate \\
  -H "Authorization: Bearer <accessToken>" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "production-backend"}'`}
        />
        <Callout type="warning">
          The generated API key is returned only once. The database stores only its SHA-256 hash.
          Copy and save the key immediately.
        </Callout>

        <h2 id="security" className="text-2xl font-semibold text-text mt-12 mb-4 scroll-mt-20">Security Best Practices</h2>
        <ul className="space-y-3 text-text-secondary">
          {[
            'Store keys in environment variables',
            'Never commit keys to version control',
            'Never expose server API keys in frontend bundles',
            'Rotate compromised keys immediately',
            'Use HTTPS in production',
            'Revoke keys that are no longer in use',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-text-muted mt-1.5">—</span>
              {item}
            </li>
          ))}
        </ul>

        <PreviousNext
          prev={{ href: '/docs/middleware', label: 'Express Middleware' }}
          next={{ href: '/docs/api-reference', label: 'API Reference' }}
        />
      </div>
      <TableOfContents items={toc} />
    </div>
  );
}
