// The "Live GitHub" control that sits under every stat in the admin. Off, the
// stat shows the number that was typed; on, it shows a figure read from the
// GitHub account linked under Socials — with the typed number kept as the
// offline fallback. Shared by the Home and Projects stat editors.
import { Toggle, Segmented } from './ui';
import { useGithubStats, statValue } from '../../content/githubStats';

const METRICS = [
  { value: 'github-repos', label: 'Repositories' },
  { value: 'github-commits', label: 'Commits this year' },
];

const isLive = (source) => METRICS.some((m) => m.value === source);

export function StatLiveSource({ stat, onChange }) {
  const { stats: live, user, error } = useGithubStats({ force: true });
  const on = isLive(stat.source);
  // Turning it on lands on repositories; turning it off keeps nothing behind.
  const setOn = (next) => onChange(next ? stat.source || METRICS[0].value : 'manual');

  return (
    <div className="mt-4 border-t border-white/10 pt-4">
      <Toggle
        checked={on}
        onChange={setOn}
        label="Live GitHub"
        description={
          user
            ? `Reads the real number from github.com/${user}`
            : 'Add a GitHub profile link under Socials to use this'
        }
      />

      {on && (
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3">
          <Segmented
            label="Which GitHub number"
            value={stat.source}
            onChange={onChange}
            options={METRICS}
          />
          <p className="text-xs text-slate-500">
            {error || !user ? (
              <>
                Showing <strong className="text-slate-300">{stat.value || '—'}</strong> — GitHub is
                unreachable right now.
              </>
            ) : (
              <>
                Showing <strong className="text-brand">{statValue(stat, live)}</strong> · falls back
                to <strong className="text-slate-300">{stat.value || '—'}</strong> when GitHub
                can’t be reached.
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
}

// One line at the top of the Stats card: which account is being read and
// whether it answered. Lets the owner tell a working connection from a silent
// fallback before saving.
export function GithubStatsStatus() {
  const { stats, loading, error, user } = useGithubStats({ force: true });
  const year = new Date().getFullYear();

  if (!user)
    return (
      <Note tone="warn">
        No GitHub profile link found under Socials, so “Live GitHub” has nothing to read. Add one
        like <code>https://github.com/your-username</code> to switch it on.
      </Note>
    );

  if (loading) return <Note>Reading github.com/{user}…</Note>;

  if (error)
    return (
      <Note tone="warn">
        Can’t reach GitHub for <strong>{user}</strong> ({error}). Stats set to live keep showing
        their typed values until it answers again.
      </Note>
    );

  return (
    <Note>
      <strong className="text-slate-300">github.com/{user}</strong> — {fmt(stats?.repos)} public
      repositories · {fmt(stats?.commits)} commits in {year}. Refreshed every 6 hours.
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
