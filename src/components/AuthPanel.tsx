'use client';

import { useEffect, useState } from 'react';

interface UserState {
  id: string;
  name: string;
  email: string;
}

export default function AuthPanel({ onAuth }: { onAuth: (user: UserState | null) => void }) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserState | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const stored = window.localStorage.getItem('ai-dashboard-user');
      if (!stored) return;
      try {
        const parsed = JSON.parse(stored) as UserState;
        setUser(parsed);
        onAuth(parsed);
      } catch {
        window.localStorage.removeItem('ai-dashboard-user');
      }
    }
    loadUser();
  }, [onAuth]);

  const saveUser = (userData: UserState) => {
    window.localStorage.setItem('ai-dashboard-user', JSON.stringify(userData));
    setUser(userData);
    onAuth(userData);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const normalizedEmail = email.trim().toLowerCase();
    const payload = mode === 'login'
      ? { email: normalizedEmail, password }
      : { name, email: normalizedEmail, password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        setError(data.error || 'Authentication failed.');
        setLoading(false);
        return;
      }
      saveUser(data.user);
      setError(null);
      setEmail('');
      setPassword('');
      setName('');
    } catch (err) {
      setError('Unable to complete auth request.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.localStorage.removeItem('ai-dashboard-user');
    setUser(null);
    onAuth(null);
  };

  if (user) {
    return (
      <div className="card p-4 mb-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] accent">Signed in as</p>
            <p className="mt-1 text-lg font-semibold text-ui">{user.name || user.email}</p>
            <p className="text-xs muted">{user.email}</p>
          </div>
          <button
            className="rounded-full bg-danger/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white transition hover:opacity-90"
            onClick={handleLogout}
          >
            Log out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6 mb-6">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] accent">Welcome</p>
          <h2 className="mt-2 text-xl font-semibold text-ui">Sign in to your AI dashboard</h2>
        </div>
        <button
          type="button"
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          className="rounded-full border border-primary/40 bg-transparent px-3 py-2 text-xs uppercase tracking-[0.22em] text-primary transition hover:opacity-90"
        >
          {mode === 'login' ? 'Register' : 'Login'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'register' && (
          <label className="block text-sm text-gray-300">
            Name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-gray-800 bg-[var(--surface-2)] px-4 py-3 text-sm text-ui outline-none focus:border-cyan-500"
              placeholder="Your name"
            />
          </label>
        )}

        <label className="block text-sm text-gray-300">
          Email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-gray-800 bg-[var(--surface-2)] px-4 py-3 text-sm text-ui outline-none focus:border-cyan-500"
            placeholder="you@example.com"
          />
        </label>

        <label className="block text-sm text-gray-300">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-gray-800 bg-[var(--surface-2)] px-4 py-3 text-sm text-ui outline-none focus:border-cyan-500"
            placeholder="Enter a password"
          />
        </label>

        {error && <div className="rounded-xl bg-red-900/70 px-4 py-3 text-sm text-red-200">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] px-4 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-black transition disabled:opacity-40"
        >
          {loading ? 'Working...' : mode === 'login' ? 'Sign in' : 'Create account'}
        </button>
      </form>

      <div className="mt-4 text-center text-xs uppercase tracking-[0.22em] text-gray-500">Or continue with</div>
      <button
        type="button"
        onClick={() => window.alert('Google sign-in is not configured. Add OAuth client and backend provider next.')}
        className="mt-3 w-full rounded-2xl border border-gray-800 bg-[var(--surface-2)] px-4 py-3 text-sm text-ui transition hover:border-cyan-500"
      >
        Continue with Google
      </button>
    </div>
  );
}
