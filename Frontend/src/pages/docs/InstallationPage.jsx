import CodeBlock from '../../components/CodeBlock';
import InstallTabs from '../../components/InstallTabs';
import Callout from '../../components/Callout';
import Breadcrumbs from '../../components/Breadcrumbs';
import PreviousNext from '../../components/PreviousNext';
import TableOfContents from '../../components/TableOfContents';

const toc = [
  { id: 'requirements', label: 'Requirements' },
  { id: 'install-sdk', label: 'Install the SDK' },
  { id: 'peer-deps', label: 'Peer Dependencies' },
  { id: 'verify', label: 'Verify Installation' },
  { id: 'project-setup', label: 'Project Setup' },
];

export default function InstallationPage() {
  return (
    <div className="flex gap-8 px-8 lg:px-12 py-10">
      <div className="flex-1 min-w-0 max-w-[820px]">
        <Breadcrumbs />
        <h1 className="text-[40px] font-bold text-text tracking-tight mb-4">Installation</h1>
        <p className="text-text-secondary mb-10 text-base leading-relaxed">
          Add the RLaaS TypeScript SDK to your Node.js project.
        </p>

        <h2 id="requirements" className="text-2xl font-semibold text-text mt-12 mb-4 scroll-mt-20">Requirements</h2>
        <ul className="space-y-2 text-text-secondary mb-6">
          <li className="flex items-start gap-2"><span className="text-text-muted mt-1.5">—</span> Node.js 18 or later</li>
          <li className="flex items-start gap-2"><span className="text-text-muted mt-1.5">—</span> TypeScript 5+ (recommended, not required)</li>
          <li className="flex items-start gap-2"><span className="text-text-muted mt-1.5">—</span> A running RLaaS backend API</li>
        </ul>

        <h2 id="install-sdk" className="text-2xl font-semibold text-text mt-12 mb-4 scroll-mt-20">Install the SDK</h2>
        <InstallTabs
          npm="npm install token-bucket-rate-limiter-sdk"
          pnpm="pnpm add token-bucket-rate-limiter-sdk"
          yarn="yarn add token-bucket-rate-limiter-sdk"
        />

        <h2 id="peer-deps" className="text-2xl font-semibold text-text mt-12 mb-4 scroll-mt-20">Peer Dependencies</h2>
        <p className="text-text-secondary mb-4">
          If you plan to use the Express middleware, ensure Express is installed in your project:
        </p>
        <CodeBlock language="bash" code="npm install express" />
        <p className="text-text-secondary text-sm">
          The core SDK (<code className="font-mono text-text bg-code-surface px-1.5 py-0.5 rounded border border-border text-xs">RateLimiter</code>,
          <code className="font-mono text-text bg-code-surface px-1.5 py-0.5 rounded border border-border text-xs ml-1">RateLimiterClient</code>)
          has zero runtime dependencies and uses the built-in <code className="font-mono text-text bg-code-surface px-1.5 py-0.5 rounded border border-border text-xs">fetch</code> API.
        </p>

        <h2 id="verify" className="text-2xl font-semibold text-text mt-12 mb-4 scroll-mt-20">Verify Installation</h2>
        <p className="text-text-secondary mb-4">
          Check the SDK was installed correctly:
        </p>
        <CodeBlock language="TypeScript" code={`import { RateLimiter } from "token-bucket-rate-limiter-sdk";

console.log("SDK loaded successfully");`} />

        <h2 id="project-setup" className="text-2xl font-semibold text-text mt-12 mb-4 scroll-mt-20">Project Setup</h2>
        <p className="text-text-secondary mb-4">
          The SDK is distributed as an ES module. Make sure your <code className="font-mono text-text bg-code-surface px-1.5 py-0.5 rounded border border-border text-xs">package.json</code> includes:
        </p>
        <CodeBlock language="json" code={`{
  "type": "module"
}`} />

        <p className="text-text-secondary mb-4">
          For TypeScript projects, your <code className="font-mono text-text bg-code-surface px-1.5 py-0.5 rounded border border-border text-xs">tsconfig.json</code> should use:
        </p>
        <CodeBlock language="json" code={`{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler",
    "target": "ES2022"
  }
}`} />

        <Callout>
          The SDK ships with full TypeScript type definitions. No separate <code>@types</code> package is needed.
        </Callout>

        <PreviousNext
          prev={{ href: '/docs/quick-start', label: 'Quick Start' }}
          next={{ href: '/docs/configuration', label: 'Configuration' }}
        />
      </div>
      <TableOfContents items={toc} />
    </div>
  );
}
