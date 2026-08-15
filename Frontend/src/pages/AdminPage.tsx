import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAdminUsers, useAdminApiKeys } from '../hooks/useAdmin';
import { useToast } from '../hooks/useToast';
import {
  Users, Key, Trash2, Loader2, RefreshCw, ChevronDown, ChevronUp,
  User as UserIcon, LogOut, ArrowLeft, Clock, Ban, Check
} from 'lucide-react';

interface ToastProps {
  message: string;
  onClose: () => void;
}

function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-md border border-border bg-surface text-text text-sm animate-fade-in">{message}</div>;
}

interface ConfirmModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmModal({ title, message, onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="border border-border rounded-md p-6 bg-surface max-w-md w-full animate-fade-in">
        <h3 className="text-lg font-semibold text-text mb-2">{title}</h3>
        <p className="text-sm text-text-muted mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2 border border-border text-text text-sm rounded-md hover:bg-hover transition-colors">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2 bg-text text-bg text-sm font-medium rounded-md hover:bg-white-hover transition-colors">Confirm</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();

  const { users, loading, fetchUsers, toggleStatus, activeUsers, suspendedUsers } = useAdminUsers();
  const { userKeys, loadingKeys, fetchUserKeys, revokeKey } = useAdminApiKeys();

  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmModalProps | null>(null);
  const [processing, setProcessing] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggle = async (userId: string) => {
    setProcessing((p) => {
      const n = new Set(p);
      n.add(userId);
      return n;
    });
    try {
      await toggleStatus(userId);
      showToast('Status updated');
    } catch (err: any) {
      showToast(err.message || 'Failed to update user status');
    }
    setProcessing((p) => {
      const n = new Set(p);
      n.delete(userId);
      return n;
    });
    setConfirmAction(null);
  };

  const handleExpand = async (userId: string) => {
    if (expandedUser === userId) {
      setExpandedUser(null);
      return;
    }
    setExpandedUser(userId);
    if (!userKeys[userId]) {
      await fetchUserKeys(userId);
    }
  };

  const handleRevokeKey = async (keyId: string) => {
    setProcessing((p) => {
      const n = new Set(p);
      n.add(keyId);
      return n;
    });
    try {
      await revokeKey(keyId, expandedUser || undefined);
      showToast('Key revoked');
    } catch (err: any) {
      showToast(err.message || 'Failed to revoke key');
    }
    setProcessing((p) => {
      const n = new Set(p);
      n.delete(keyId);
      return n;
    });
    setConfirmAction(null);
  };

  return (
    <div className="min-h-screen bg-bg">
      {toast && <Toast message={toast.message} onClose={hideToast} />}
      {confirmAction && <ConfirmModal {...confirmAction} />}

      <nav className="fixed top-0 left-0 right-0 z-40 bg-bg border-b border-border h-16">
        <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-base font-semibold text-text tracking-tight">RLaaS</Link>
            <span className="text-[10px] font-mono text-text-muted bg-surface-secondary px-2 py-0.5 rounded border border-border uppercase tracking-wider">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="px-3 py-1.5 text-xs text-text-muted hover:text-text transition-colors flex items-center gap-1"><ArrowLeft className="w-3.5 h-3.5" /> Dashboard</Link>
            <button onClick={async () => { await logout(); navigate('/'); }} className="px-3 py-1.5 text-xs text-text-muted hover:text-text transition-colors"><LogOut className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-24 pb-12">
        <h1 className="text-3xl font-bold text-text mb-1">Admin Panel</h1>
        <p className="text-text-muted text-sm mb-8">Manage users and API keys across the platform.</p>

        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: 'Total Users', value: users.length, icon: Users },
            { label: 'Active', value: activeUsers, icon: Users },
            { label: 'Suspended', value: suspendedUsers, icon: Ban },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="border border-border hover:border-yellow/30 transition-colors rounded-md p-4 bg-surface flex items-center gap-3">
              <Icon className="w-4 h-4 text-yellow" />
              <div><p className="text-xs text-text-muted">{label}</p><p className="text-xl font-bold font-mono text-text">{value}</p></div>
            </div>
          ))}
        </div>

        <div className="border border-border rounded-md overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-surface">
            <span className="text-sm font-medium text-text">All Users</span>
            <button onClick={fetchUsers} className="text-text-muted hover:text-text-secondary transition-colors"><RefreshCw className="w-3.5 h-3.5" /></button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 text-text-muted animate-spin" /></div>
          ) : users.length === 0 ? (
            <div className="p-10 text-center text-sm text-text-muted">No users found.</div>
          ) : (
            <div className="divide-y divide-border">
              {users.map((u) => (
                <div key={u.id}>
                  <div className="px-4 py-3 flex items-center justify-between hover:bg-hover transition-colors cursor-pointer" onClick={() => handleExpand(u.id)}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 border border-border rounded-md flex items-center justify-center bg-surface-secondary">
                        <UserIcon className="w-3.5 h-3.5 text-text-muted" />
                      </div>
                      <div>
                        <p className="text-sm text-text">{u.email}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${u.status === 'ACTIVE' ? 'border-yellow/30 text-yellow bg-yellow-glow' : 'border-border text-text-muted'}`}>{u.status}</span>
                          <span className="text-[10px] text-text-muted flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{new Date(u.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={(e) => { e.stopPropagation(); setConfirmAction({
                        title: u.status === 'ACTIVE' ? 'Suspend user?' : 'Activate user?',
                        message: `${u.status === 'ACTIVE' ? 'Suspend' : 'Activate'} ${u.email}?`,
                        onConfirm: () => handleToggle(u.id),
                        onCancel: () => setConfirmAction(null),
                      }); }} disabled={processing.has(u.id)}
                        className="px-2.5 py-1 text-xs text-text-muted hover:text-text border border-border hover:border-yellow rounded-md transition-colors flex items-center gap-1 disabled:opacity-50">
                        {processing.has(u.id) ? <Loader2 className="w-3 h-3 animate-spin" /> : u.status === 'ACTIVE' ? <><Ban className="w-3 h-3" /> Suspend</> : <><Check className="w-3 h-3" /> Activate</>}
                      </button>
                      {expandedUser === u.id ? <ChevronUp className="w-3.5 h-3.5 text-text-muted" /> : <ChevronDown className="w-3.5 h-3.5 text-text-muted" />}
                    </div>
                  </div>

                  {expandedUser === u.id && (
                    <div className="px-4 pb-3 animate-fade-in">
                      <div className="ml-11 border border-border rounded-md overflow-hidden bg-bg">
                        <div className="px-3 py-2 border-b border-border flex items-center gap-2 bg-surface">
                          <Key className="w-3 h-3 text-yellow" /><span className="text-xs font-medium text-text">API Keys</span>
                        </div>
                        {loadingKeys[u.id] ? (
                          <div className="flex justify-center py-6"><Loader2 className="w-4 h-4 text-text-muted animate-spin" /></div>
                        ) : !userKeys[u.id]?.length ? (
                          <div className="py-4 text-center text-xs text-text-muted">No API keys</div>
                        ) : (
                          <div className="divide-y divide-border">
                            {userKeys[u.id].map((key) => (
                              <div key={key.id} className="px-3 py-2 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className={`w-1.5 h-1.5 rounded-full ${key.status === 'ACTIVE' ? 'bg-yellow' : 'bg-text-muted'}`} />
                                  <div>
                                    <p className="text-xs text-text">{key.name}</p>
                                    <span className="text-[10px] font-mono text-text-muted">{key.id.slice(0, 12)}... · {key.status}</span>
                                  </div>
                                </div>
                                {key.status === 'ACTIVE' && (
                                  <button onClick={(e) => { e.stopPropagation(); setConfirmAction({
                                    title: 'Revoke API key?',
                                    message: `Revoke "${key.name}"? Services using this key will stop working.`,
                                    onConfirm: () => handleRevokeKey(key.id),
                                    onCancel: () => setConfirmAction(null),
                                  }); }} disabled={processing.has(key.id)}
                                    className="px-2 py-1 text-[10px] text-text-muted hover:text-text border border-border hover:border-yellow rounded transition-colors flex items-center gap-1 disabled:opacity-50">
                                    {processing.has(key.id) ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <><Trash2 className="w-2.5 h-2.5" /> Revoke</>}
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
