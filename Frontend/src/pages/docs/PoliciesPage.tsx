import CodeBlock from '../../components/CodeBlock';
import Breadcrumbs from '../../components/Breadcrumbs';
import PreviousNext from '../../components/PreviousNext';
import TableOfContents from '../../components/TableOfContents';

const toc = [
  { id: 'what-is', label: 'What is a Policy' },
  { id: 'configure', label: 'Configure Policies' },
  { id: 'fields', label: 'Policy Fields' },
  { id: 'multiple', label: 'Multiple Policies' },
  { id: 'update', label: 'Updating Policies' },
  { id: 'visual', label: 'How It Works' },
];

export default function PoliciesPage() {
  return (
    <div className="flex gap-8 px-8 lg:px-12 py-10">
      <div className="flex-1 min-w-0 max-w-[820px]">
        <Breadcrumbs />
        <h1 className="text-[40px] font-bold text-text tracking-tight mb-4">Policies</h1>
        <p className="text-text-secondary mb-10 text-base leading-relaxed">
          Define rate limiting rules using policy configurations.
        </p>

        <h2 id="what-is" className="text-2xl font-semibold text-text mt-12 mb-4 scroll-mt-20">What is a Policy</h2>
        <p className="text-text-secondary mb-4">
          A policy defines the rate limiting rules for a specific action or endpoint.
          Each policy is identified by a unique name and scoped to your API key.
        </p>

        <h2 id="configure" className="text-2xl font-semibold text-text mt-12 mb-4 scroll-mt-20">Configure Policies</h2>
        <p className="text-text-secondary mb-4">
          Use <code className="font-mono text-sm text-text bg-code-surface px-1.5 py-0.5 rounded border border-border">limiter.configure()</code> to
          create or update policies:
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

        <h2 id="fields" className="text-2xl font-semibold text-text mt-12 mb-4 scroll-mt-20">Policy Fields</h2>
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
                ['name', 'string', 'Unique identifier for the policy within your API key'],
                ['capacity', 'number', 'Maximum number of tokens the bucket can hold'],
                ['refillRate', 'number', 'Number of tokens added per interval'],
                ['interval', 'number', 'Refill interval in seconds'],
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
        <p className="text-text-secondary text-sm">
          All fields are required. <code className="font-mono text-text bg-code-surface px-1.5 py-0.5 rounded border border-border text-xs">capacity</code>,
          <code className="font-mono text-text bg-code-surface px-1.5 py-0.5 rounded border border-border text-xs ml-1">refillRate</code>, and
          <code className="font-mono text-text bg-code-surface px-1.5 py-0.5 rounded border border-border text-xs ml-1">interval</code> must be positive integers.
        </p>

        <h2 id="multiple" className="text-2xl font-semibold text-text mt-12 mb-4 scroll-mt-20">Multiple Policies</h2>
        <p className="text-text-secondary mb-4">
          Configure multiple policies in a single call:
        </p>
        <CodeBlock
          language="TypeScript"
          code={`await limiter.configure([
  {
    name: "login",
    capacity: 5,
    refillRate: 1,
    interval: 60
  },
  {
    name: "api-general",
    capacity: 100,
    refillRate: 10,
    interval: 60
  },
  {
    name: "upload",
    capacity: 10,
    refillRate: 2,
    interval: 120
  }
]);`}
          showLineNumbers
        />

        <h2 id="update" className="text-2xl font-semibold text-text mt-12 mb-4 scroll-mt-20">Updating Policies</h2>
        <p className="text-text-secondary mb-4">
          Calling <code className="font-mono text-sm text-text bg-code-surface px-1.5 py-0.5 rounded border border-border">configure()</code> with
          an existing policy name will update it. The policy is matched by name within your API key scope.
        </p>

        <h2 id="visual" className="text-2xl font-semibold text-text mt-12 mb-4 scroll-mt-20">How It Works</h2>
        <div className="border border-border rounded-md p-6 bg-surface font-mono text-sm text-text-secondary my-4 space-y-4">
          <div>
            <span className="text-text">Capacity</span>
            <div className="mt-2 flex gap-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-4 h-4 rounded-full border border-border-strong bg-surface-secondary" />
              ))}
            </div>
            <span className="text-text-muted text-xs mt-1 block">5 tokens max</span>
          </div>
          <div className="border-t border-border pt-4">
            <span className="text-text">Request</span> → consume 1 token
          </div>
          <div className="border-t border-border pt-4">
            <span className="text-text">Refill</span> → add tokens over time (refillRate / interval)
          </div>
          <div className="border-t border-border pt-4">
            <span className="text-text">Maximum</span> → never exceeds capacity
          </div>
        </div>

        <PreviousNext
          prev={{ href: '/docs/configuration', label: 'Configuration' }}
          next={{ href: '/docs/checking-limits', label: 'Checking Limits' }}
        />
      </div>
      <TableOfContents items={toc} />
    </div>
  );
}
