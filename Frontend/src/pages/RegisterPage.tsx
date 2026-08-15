import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-4">
        <div className="border border-border rounded-md p-8 bg-surface max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-text mb-2">Account created</h2>
          <p className="text-text-muted text-sm">Redirecting to sign in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="block text-center text-base font-semibold text-text tracking-tight mb-10 hover:text-yellow transition-colors">
          RLaaS
        </Link>

        <div className="border border-border rounded-md p-8 bg-surface">
          <h1 className="text-2xl font-bold text-text mb-1">Create account</h1>
          <p className="text-text-muted text-sm mb-8">Get started with RLaaS</p>

          {error && (
            <div className="mb-6 p-3 rounded-md bg-error-bg border border-border text-text text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-text-muted uppercase tracking-wider mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 bg-bg border border-border rounded-md text-text text-sm placeholder-text-muted focus:outline-none focus:border-yellow transition-colors"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-muted uppercase tracking-wider mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 bg-bg border border-border rounded-md text-text text-sm placeholder-text-muted focus:outline-none focus:border-yellow transition-colors"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-muted uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 bg-bg border border-border rounded-md text-text text-sm placeholder-text-muted focus:outline-none focus:border-yellow transition-colors pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password.length > 0 && (
                <div className="mt-3 space-y-1">
                  {[
                    { ok: checks.length, label: 'At least 8 characters' },
                    { ok: checks.uppercase, label: 'One uppercase letter' },
                    { ok: checks.lowercase, label: 'One lowercase letter' },
                  ].map(({ ok, label }) => (
                    <div key={label} className="flex items-center gap-2 text-xs">
                      <div className={`w-1 h-1 rounded-full ${ok ? 'bg-yellow' : 'bg-text-muted'}`} />
                      <span className={ok ? 'text-text-secondary' : 'text-text-muted'}>{label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-text text-bg text-sm font-medium rounded-md hover:bg-white-hover hover:ring-2 hover:ring-yellow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Create Account <ArrowRight className="w-3.5 h-3.5" /></>}
            </button>
          </form>

          <p className="mt-6 text-center text-text-muted text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-text hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
