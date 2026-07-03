import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, LogIn } from 'lucide-react';
import { login, setToken, isAuthed } from '../api';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthed()) {
    navigate('/admin/hero', { replace: true });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token } = await login(username, password);
      setToken(token);
      navigate('/admin/hero', { replace: true });
    } catch (err) {
      setError(
        err.message?.includes('401') || err.message?.includes('Unauthorized')
          ? 'Invalid username or password.'
          : err.message || 'Login failed.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-900 px-5 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/15 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-8 sm:p-10">
        <div className="mb-8 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand text-lg font-extrabold text-white shadow-brand-btn">
            AT
          </span>
          <h1 className="mt-5 text-2xl font-bold">Admin Panel</h1>
          <p className="mt-1.5 text-sm text-slate-400">
            Sign in to manage your resume content
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
              autoFocus
              className="w-full rounded-xl border border-white/10 bg-ink-900/40 py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full rounded-xl border border-white/10 bg-ink-900/40 py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-base font-semibold text-white shadow-brand-btn transition-colors hover:bg-brand-dark disabled:opacity-60"
          >
            <LogIn size={18} />
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
