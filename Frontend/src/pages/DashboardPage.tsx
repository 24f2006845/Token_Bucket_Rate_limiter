import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useApiKeys, usePolicies } from '../hooks/useDashboard';
import { useToast } from '../hooks/useToast';
import {
  Key, Plus, Copy, Check, Trash2, Loader2, LogOut,
  RefreshCw, Layers, ChevronDown, User, Clock, Settings
} from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
}

function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-md border border-border bg-surface text-text text-sm animate-fade-in">
      {message}
    </div>
  );
}

export default function DashboardPage() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();

  const { apiKeys, fetchKeys, generateKey, revokeKey, activeKeys, revokedKeys, loading: keysLoading } = useApiKeys();
  const { policies, fetchPolicies, deletePolicy, loading: policiesLoading } = usePolicies();

  const [newKeyName, setNewKeyName] = useState('');
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [tab, setTab] = useState('keys');

  useEffect(() => {
    fetchKeys();
    fetchPolicies();
  }, [fetchKeys, fetchPolicies]);

  const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    setGenerating(true);
    try {
      const key = await generateKey(newKeyName.trim());
      setGeneratedKey(key.key || null);
      setNewKeyName('');
      setShowKeyModal(true);
      showToast('API key generated');
    } catch (err: any) {
      showToast(err.response?.data?.message || err.message, 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleRevoke = async (id: string) => {
    try {
      await revokeKey(id);
      showToast('Key revoked');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleDeletePolicy = async (id: string) => {
    try {
      await deletePolicy(id);
      showToast('Policy deleted');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const loading = keysLoading || policiesLoading;

  return (
    <div className="min-h-screen bg-bg">
      {toast && <Toast {...toast} onClose={hideToast} />}

      {/* Key modal */}
      {showKeyModal && generatedKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="border border-border rounded-md p-6 bg-surface max-w-lg w-full animate-fade-in">
            <h3 className="text-lg font-semibold text-text mb-1">Save your API key</h3>
            <p className="text-xs text-text-muted mb-4">This key will only be shown once.</p>
            <div className="bg-bg border border-border rounded-md p-3 flex items-center gap-3 mb-4">
              <code className="text-xs font-mono text-text flex-1 break-all">{generatedKey}</code>
              <button onClick={() => handleCopy(generatedKey)} className="text-text-muted hover:text-text transition-colors flex-shrink-0">
                {copiedKey === generatedKey ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <button onClick={() => { setShowKeyModal(false); setGeneratedKey(null); }} className="w-full py-2 bg-text text-bg text-sm font-medium rounded-md hover:bg-white-hover transition-colors">
              I've saved my key
            </button>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-bg border-b border-border h-16">
        <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
          <Link to="/" className="text-base font-semibold text-text tracking-tight">RLaaS</Link>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link to="/admin" className="px-3 py-1.5 text-xs text-text-muted hover:text-text border border-border rounded-md transition-colors flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5" /> Admin
              </Link>
            )}
            <div className="relative">
              <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-hover transition-colors">
                <div className="w-7 h-7 bg-surface-secondary border border-border rounded-md flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-text-muted" />
                </div>
                <span className="text-sm text-text-secondary hidden sm:block">{user?.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
              </button>
              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-1 w-52 border border-border rounded-md bg-surface overflow-hidden animate-fade-in">
                  <div className="p-3 border-b border-border">
                    <p className="text-sm text-text">{user?.name}</p>
                    <p className="text-xs text-text-muted">{user?.email}</p>
                    <span className="inline-block mt-1 px-1.5 py-0.5 text-[10px] bg-surface-secondary border border-border rounded text-text-muted font-mono">{user?.role}</span>
                  </div>
                  <button onClick={handleLogout} className="w-full px-3 py-2 text-sm text-text-secondary hover:bg-hover flex items-center gap-2 transition-colors">
                    <LogOut className="w-3.5 h-3.5" /> Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 pt-24 pb-12">
        <h1 className="text-3xl font-bold text-text mb-1">Dashboard</h1>
        <p className="text-text-muted text-sm mb-8">Manage your API keys and rate limiting policies.</p>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Total Keys', value: apiKeys.length, icon: Key },
            { label: 'Active', value: activeKeys, icon: Key },
            { label: 'Revoked', value: revokedKeys, icon: Key },
            { label: 'Policies', value: policies.length, icon: Layers },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="border border-border hover:border-yellow/30 transition-colors rounded-md p-4 bg-surface flex items-center gap-3">
              <Icon className="w-4 h-4 text-yellow" />
              <div>
                <p className="text-xs text-text-muted">{label}</p>
                <p className="text-xl font-bold font-mono text-text">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Generate */}
        <div className="border border-border rounded-md p-5 bg-surface mb-8">
          <h2 className="text-sm font-semibold text-text mb-3 flex items-center gap-2">
            <Plus className="w-4 h-4 text-yellow" /> Generate API Key
          </h2>
          <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-3">
            <input type="text" value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)} placeholder="Key name (e.g. production-backend)"
              className="flex-1 px-3 py-2.5 bg-bg border border-border rounded-md text-text text-sm placeholder-text-muted focus:outline-none focus:border-yellow transition-colors" required />
            <button type="submit" disabled={generating}
              className="px-5 py-2.5 bg-text text-bg text-sm font-medium rounded-md hover:bg-white-hover hover:ring-2 hover:ring-yellow transition-all flex items-center justify-center gap-2 disabled:opacity-50">
              {generating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Key className="w-3.5 h-3.5" />} Generate
            </button>
          </form>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 border-b border-border mb-6">
          {[{ key: 'keys', label: 'API Keys' }, { key: 'policies', label: 'Policies' }].map(({ key, label }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`px-4 py-2 text-sm transition-colors border-b-2 -mb-px ${tab === key ? 'border-yellow text-yellow' : 'border-transparent text-text-muted hover:text-text-secondary'}`}>
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 text-text-muted animate-spin" /></div>
        ) : tab === 'keys' ? (
          <div className="border border-border rounded-md overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-surface">
              <span className="text-sm font-medium text-text">Your API Keys</span>
              <button onClick={fetchKeys} className="text-text-muted hover:text-text-secondary transition-colors"><RefreshCw className="w-3.5 h-3.5" /></button>
            </div>
            {apiKeys.length === 0 ? (
              <div className="p-10 text-center text-sm text-text-muted">No API keys yet. Generate one above.</div>
            ) : (
              <div className="divide-y divide-border">
                {apiKeys.map((key) => (
                  <div key={key.id} className="px-4 py-3 flex items-center justify-between hover:bg-hover transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-1.5 h-1.5 rounded-full ${key.status === 'ACTIVE' ? 'bg-yellow' : 'bg-text-muted'}`} />
                      <div>
                        <p className="text-sm text-text">{key.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${key.status === 'ACTIVE' ? 'border-yellow/30 text-yellow bg-yellow-glow' : 'border-border text-text-muted'}`}>{key.status}</span>
                          <span className="text-[10px] text-text-muted flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{new Date(key.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    {key.status === 'ACTIVE' && (
                      <button onClick={() => handleRevoke(key.id)} className="px-2.5 py-1 text-xs text-text-muted hover:text-text border border-border hover:border-yellow rounded-md transition-colors flex items-center gap-1">
                        <Trash2 className="w-3 h-3" /> Revoke
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="border border-border rounded-md overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-surface">
              <span className="text-sm font-medium text-text">Your Policies</span>
              <button onClick={fetchPolicies} className="text-text-muted hover:text-text-secondary transition-colors"><RefreshCw className="w-3.5 h-3.5" /></button>
            </div>
            {policies.length === 0 ? (
              <div className="p-10 text-center text-sm text-text-muted">No policies. Sync policies via the API.</div>
            ) : (
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border bg-surface">
                  {['Name', 'Algorithm', 'Capacity', 'Refill', 'Interval', ''].map((h) => (
                    <th key={h} className="text-left px-4 py-2.5 text-text-muted text-xs font-medium">{h}</th>
                  ))}
                </tr></thead>
                <tbody className="divide-y divide-border">
                  {policies.map((p) => (
                    <tr key={p.id} className="hover:bg-hover transition-colors">
                      <td className="px-4 py-2.5 text-yellow font-mono text-xs">{p.name}</td>
                      <td className="px-4 py-2.5 text-text-muted font-mono text-xs">{p.algorithm}</td>
                      <td className="px-4 py-2.5 text-text font-mono text-xs">{p.capacity}</td>
                      <td className="px-4 py-2.5 text-text font-mono text-xs">{p.refillRate}</td>
                      <td className="px-4 py-2.5 text-text font-mono text-xs">{p.interval}s</td>
                      <td className="px-4 py-2.5 text-right">
                        <button onClick={() => handleDeletePolicy(p.id)} className="px-2.5 py-1 text-xs text-text-muted hover:text-text border border-border hover:border-yellow rounded-md transition-colors">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
