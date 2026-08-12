// Admin controls for stats that can read their number from GitHub instead of
// being typed by hand. Shared by the Home and Projects stat editors.
import { Field } from './ui';
import { STAT_SOURCES, useGithubStats } from '../../content/githubStats';

// Per-stat picker: manual, or one of the live GitHub figures.
export function StatSourceField({ value, onChange }) {
  return (
    <Field
      as="select"
      label="Source"
      value={value ?? 'manual'}
      onChange={onChange}
      hint="Live numbers fall back to the value on the left."
    >
      {STAT_SOURCES.map((s) => (
        <option key={s.value} value={s.value} className="bg-ink-800">
          {s.label}
        </option>
      ))}
    </Field>
  );
}

// Which account is being read, and what it currently returns — so the owner can
// tell a working connection from a silent fallback before saving.
export function GithubStatsStatus() {
  const { stats, loading, error, user } = useGithubStats({ force: true });
  const year = new Date().getFullYear();

  if (!user)
    return (
      <Note tone="warn">
        No GitHub profile link found under Socials, so live sources stay on the typed
        values. Add one like <code>https://github.com/your-username</code> to switch them on.
      </Note>
    );

  if (loading) return <Note>Reading github.com/{user}…</Note>;

  if (error)
    return (
      <Note tone="warn">
        Can’t reach GitHub for <strong>{user}</strong> ({error}). The site keeps showing the
        values typed below until it’s reachable again.
      </Note>
    );

  return (
    <Note>
      Live from <strong>github.com/{user}</strong>: {fmt(stats?.repos)} public repositories ·{' '}
      {fmt(stats?.commits)} commits in {year}. Refreshed every 6 hours.
    </Note>
  );
}

const fmt = (n) => (typeof n === 'number' ? n.toLocaleString('en-US') : '—');

function Note({ tone, children }) {
  return (
    <p
      className={`mb-5 rounded-xl border px-4 py-3 text-sm ${
        tone === 'warn'
          ? 'border-amber-500/30 bg-amber-500/5 text-amber-200/90'
          : 'border-white/10 bg-white/[0.02] text-slate-400'
      }`}
    >
      {children}
    </p>
  );
}
