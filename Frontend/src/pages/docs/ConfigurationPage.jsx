import CodeBlock from '../../components/CodeBlock';
import Callout from '../../components/Callout';
import Breadcrumbs from '../../components/Breadcrumbs';
import PreviousNext from '../../components/PreviousNext';
import TableOfContents from '../../components/TableOfContents';

const toc = [
  { id: 'initialize', label: 'Initialize the SDK' },
  { id: 'options', label: 'Options' },
  { id: 'env-vars', label: 'Environment Variables' },
  { id: 'multiple-instances', label: 'Multiple Instances' },
];

export default function ConfigurationPage() {
  return (
    <div className="flex gap-8 px-8 lg:px-12 py-10">
      <div className="flex-1 min-w-0 max-w-[820px]">
        <Breadcrumbs />
        <h1 className="text-[40px] font-bold text-text tracking-tight mb-4">Configuration</h1>
        <p className="text-text-secondary mb-10 text-base leading-relaxed">
          Initialize the SDK and configure it for your application.
        </p>

        <h2 id="initialize" className="text-2xl font-semibold text-text mt-12 mb-4 scroll-mt-20">Initialize the SDK</h2>
        <p className="text-text-secondary mb-4">
          Create a <code className="font-mono text-sm text-text bg-code-surface px-1.5 py-0.5 rounded border border-border">RateLimiter</code> instance.
          This is the main entry point for all SDK operations:
        </p>
        <CodeBlock
          language="TypeScript"
          code={`import { RateLimiter } from "token-bucket-rate-limiter-sdk";

const limiter = new RateLimiter({
  apiKey: process.env.RLAAS_API_KEY!
});`}
        />
        <p className="text-text-secondary text-sm">
          Create the instance once and reuse it across your application. Do not create a new instance per request.
        </p>

        <h2 id="options" className="text-2xl font-semibold text-text mt-12 mb-4 scroll-mt-20">Options</h2>
        <div className="border border-border rounded-md overflow-hidden my-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="text-left px-4 py-3 text-text-muted font-medium text-xs">Option</th>
                <th className="text-left px-4 py-3 text-text-muted font-medium text-xs">Type</th>
                <th className="text-left px-4 py-3 text-text-muted font-medium text-xs">Required</th>
                <th className="text-left px-4 py-3 text-text-muted font-medium text-xs">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="px-4 py-3 font-mono text-text text-xs">apiKey</td>
                <td className="px-4 py-3 font-mono text-text-muted text-xs">string</td>
                <td className="px-4 py-3 text-text-secondary">Yes</td>
                <td className="px-4 py-3 text-text-secondary">Your RLaaS API key</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-text-secondary text-sm">
          The SDK validates that the API key is a non-empty string. If missing, a <code className="font-mono text-text bg-code-surface px-1.5 py-0.5 rounded border border-border text-xs">ValidationError</code> is thrown immediately.
        </p>

        <h2 id="env-vars" className="text-2xl font-semibold text-text mt-12 mb-4 scroll-mt-20">Environment Variables</h2>
        <p className="text-text-secondary mb-4">
          Store your API key as an environment variable. Add it to your <code className="font-mono text-sm text-text bg-code-surface px-1.5 py-0.5 rounded border border-border">.env</code> file:
        </p>
        <CodeBlock language="env" code="RLAAS_API_KEY=rlaas_live_xxxxxxxxxxxxxxxxx" />
        <Callout type="warning">
          Never hardcode API keys in source code. Never commit <code>.env</code> files. Never expose server API keys in frontend bundles. Rotate compromised keys immediately.
        </Callout>

        <h2 id="multiple-instances" className="text-2xl font-semibold text-text mt-12 mb-4 scroll-mt-20">Multiple Instances</h2>
        <p className="text-text-secondary mb-4">
          You can create multiple SDK instances for different API keys or environments:
        </p>
        <CodeBlock
          language="TypeScript"
          code={`const productionLimiter = new RateLimiter({
  apiKey: process.env.RLAAS_PROD_KEY!
});

const stagingLimiter = new RateLimiter({
  apiKey: process.env.RLAAS_STAGING_KEY!
});`}
        />

        <PreviousNext
          prev={{ href: '/docs/installation', label: 'Installation' }}
          next={{ href: '/docs/policies', label: 'Policies' }}
        />
      </div>
      <TableOfContents items={toc} />
    </div>
  );
}
