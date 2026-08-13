import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CodeBlock from '../components/CodeBlock';

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-bg">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg border-b border-border h-16">
        <div className="h-full px-6 flex items-center justify-between max-w-[1200px] mx-auto">
          <span className="text-base font-semibold text-text tracking-tight">RLaaS</span>
          <div className="flex items-center gap-6">
            <Link to="/docs/quick-start" className="text-sm text-text-muted hover:text-text transition-colors">Docs</Link>
            <Link to="/docs/api-reference" className="text-sm text-text-muted hover:text-text transition-colors">API Reference</Link>
            {user ? (
              <Link to="/dashboard" className="px-4 py-1.5 bg-text text-bg text-sm font-medium rounded-md hover:bg-white-hover transition-colors">Dashboard</Link>
            ) : (
              <Link to="/login" className="px-4 py-1.5 bg-text text-bg text-sm font-medium rounded-md hover:bg-white-hover transition-colors">Sign In</Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-24 px-6">
        <div className="max-w-[760px] mx-auto">
          <h1 className="text-[48px] md:text-[64px] font-bold text-text leading-[1.1] tracking-tight mb-6">
            Rate limiting without managing the <span className="text-yellow">Infrastructure</span>.
          </h1>
          <p className="text-lg text-text-secondary max-w-[560px] mb-10 leading-relaxed">
            Distributed token-bucket rate limiting through a simple TypeScript SDK and API.
          </p>
          <div className="flex items-center gap-4 mb-20">
            <Link
              to="/docs/quick-start"
              className="px-6 py-2.5 bg-text text-bg text-sm font-medium rounded-md hover:bg-white-hover hover:ring-2 hover:ring-yellow transition-all"
            >
              Get Started
            </Link>
            <Link
              to="/docs/api-reference"
              className="px-6 py-2.5 bg-bg text-text text-sm font-medium rounded-md border border-border-strong hover:border-yellow transition-colors"
            >
              API Reference
            </Link>
          </div>

          {/* Hero code block */}
          <CodeBlock
            language="TypeScript"
            code={`import { RateLimiter } from "token-bucket-rate-limiter-sdk";

const limiter = new RateLimiter({
  apiKey: process.env.RLAAS_API_KEY!
});

await limiter.configure([
  {
    name: "login",
    capacity: 5,
    refillRate: 1,
    interval: 60
  }
]);`}
          />
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border py-24 px-6">
        <div className="max-w-[760px] mx-auto">
          <p className="text-2xl md:text-3xl font-semibold text-text leading-snug mb-16">
            Configure once.<br />
            Attach a policy.<br />
            RLaaS handles <span className="text-yellow">enforcement</span>.
          </p>

          {/* Architecture */}
          <div className="flex flex-col items-center gap-0 mb-16">
            {[
              'Your Application',
              'TypeScript SDK',
              'RLaaS API',
              'Redis + Lua',
              'Token Bucket',
            ].map((label, i, arr) => (
              <div key={label} className="flex flex-col items-center">
                <div className="w-[260px] py-3 text-center text-sm font-mono text-text border border-border bg-surface hover:border-yellow transition-colors">
                  {label}
                </div>
                {i < arr.length - 1 && (
                  <div className="w-px h-6 bg-yellow" />
                )}
              </div>
            ))}
          </div>

          {/* Steps */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Install', desc: 'Add the SDK to your project with a single npm command.' },
              { step: '02', title: 'Configure', desc: 'Define rate limiting policies with capacity, refill rate, and interval.' },
              { step: '03', title: 'Enforce', desc: 'Check limits in your route handlers or use the Express middleware.' },
            ].map(({ step, title, desc }) => (
              <div key={step}>
                <span className="text-xs font-mono text-yellow font-bold">{step}</span>
                <h3 className="text-base font-semibold text-text mt-1 mb-2">{title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border py-20 px-6">
        <div className="max-w-[760px] mx-auto text-center">
          <h2 className="text-2xl font-semibold text-text mb-4">Start rate limiting in minutes</h2>
          <p className="text-sm text-text-secondary mb-8">Install the SDK, configure a policy, and protect your APIs.</p>
          <Link
            to="/docs/quick-start"
            className="inline-block px-6 py-2.5 bg-text text-bg text-sm font-medium rounded-md hover:bg-white-hover transition-colors"
          >
            Read the docs
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm font-medium text-text-muted">RLaaS</span>
          <div className="flex items-center gap-6">
            <Link to="/docs/quick-start" className="text-xs text-text-muted hover:text-text-secondary transition-colors">Documentation</Link>
            <Link to="/docs/api-reference" className="text-xs text-text-muted hover:text-text-secondary transition-colors">API Reference</Link>
          </div>
          <span className="text-xs text-text-muted">© 2026 RLaaS</span>
        </div>
      </footer>
    </div>
  );
}
