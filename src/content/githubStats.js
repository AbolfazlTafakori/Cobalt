// ============================================================
//  Live GitHub numbers for the stats strips.
//  A stat either carries a typed number or names a GitHub source;
//  when it names one, the site reads the real figure from the public
//  GitHub API. Anything we can't fetch — offline, rate limited, no
//  GitHub link set — falls back to the typed number, so the strip
//  never renders blank.
// ============================================================
import { useEffect, useState } from 'react';
import { useContent } from './ContentContext';

const API = 'https://api.github.com';
const CACHE_KEY = 'github_stats';

// These calls leave the visitor's own browser, so GitHub's 60-an-hour
// unauthenticated limit is spent per visitor, not pooled across the site: two
// calls per page load is nowhere near it. The cache exists to keep a browsing
// session from re-fetching on every route change, not to ration a shared
// budget — so it can be short enough that the number actually tracks reality.
const TTL_MS = 15 * 60 * 1000;
// Search is rate limited separately and much harder, so one of the two figures
// can fail on its own. Retry a half-empty result sooner rather than serving the
// typed fallback over a moment of throttling.
const PARTIAL_TTL_MS = 2 * 60 * 1000;

// Values `stat.source` can take. Anything else (including undefined) is manual.
const SOURCE_KEYS = { 'github-repos': 'repos', 'github-commits': 'commits' };

// github.com paths that are site features rather than accounts.
const RESERVED = new Set(['orgs', 'settings', 'search', 'about', 'features', 'topics', 'sponsors']);

// "https://github.com/torvalds" -> "torvalds"; '' for anything that isn't a
// GitHub profile URL.
export function githubUserFromUrl(href) {
  if (!href) return '';
  try {
    const url = new URL(href, 'https://github.com');
    if (url.hostname !== 'github.com' && url.hostname !== 'www.github.com') return '';
    const [user] = url.pathname.split('/').filter(Boolean);
    if (!user || RESERVED.has(user.toLowerCase())) return '';
    return user;
  } catch {
    return '';
  }
}

// The account to read from: whichever social link points at a GitHub profile.
export function githubUserFromContent(content) {
  for (const s of content?.socials ?? []) {
    const user = githubUserFromUrl(s.href);
    if (user) return user;
  }
  return '';
}

// True once at least one stat anywhere asks for a live number — visitors of a
// site that never opted in shouldn't be calling GitHub at all.
export function usesGithubStats(content) {
  const all = [...(content?.stats ?? []), ...(content?.projects?.stats ?? [])];
  return all.some((s) => s.source in SOURCE_KEYS);
}

function readCache(user) {
  try {
    const entry = JSON.parse(localStorage.getItem(CACHE_KEY));
    return entry?.user === user ? entry : null;
  } catch {
    return null;
  }
}

function writeCache(user, stats) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ user, stats, at: Date.now() }));
  } catch {
    /* private mode / full quota — the numbers still work, just uncached */
  }
}

async function getJson(path) {
  const res = await fetch(`${API}${path}`, {
    headers: { Accept: 'application/vnd.github+json' },
  });
  if (!res.ok) throw new Error(`GitHub responded ${res.status}`);
  return res.json();
}

// Both figures in one go. A failure on one side doesn't lose the other, so a
// rate-limited search still leaves the repo count usable.
async function fetchStats(user) {
  const name = encodeURIComponent(user);
  const since = `${new Date().getFullYear()}-01-01`;
  const query = encodeURIComponent(`author:${user} author-date:>=${since}`);

  const [profile, commits] = await Promise.allSettled([
    getJson(`/users/${name}`),
    // Search only indexes public, default-branch commits — the same commits a
    // visitor could count by hand, which is what the number claims to be.
    getJson(`/search/commits?q=${query}&per_page=1`),
  ]);

  const stats = {
    repos: profile.status === 'fulfilled' ? profile.value?.public_repos ?? null : null,
    commits: commits.status === 'fulfilled' ? commits.value?.total_count ?? null : null,
  };
  if (stats.repos === null && stats.commits === null) throw new Error('GitHub is unreachable');
  return stats;
}

const isComplete = (stats) =>
  typeof stats?.repos === 'number' && typeof stats?.commits === 'number';

// One request per user no matter how many strips are mounted.
let inflight = null;
let inflightUser = '';

export function loadGithubStats(user, { fresh = false } = {}) {
  const cached = readCache(user);
  const ttl = isComplete(cached?.stats) ? TTL_MS : PARTIAL_TTL_MS;
  if (!fresh && cached && Date.now() - cached.at < ttl) return Promise.resolve(cached.stats);
  if (inflight && inflightUser === user) return inflight;

  inflightUser = user;
  inflight = fetchStats(user)
    .then((fetched) => {
      // Never let a throttled call blank a figure we already know.
      const stats = {
        repos: fetched.repos ?? cached?.stats?.repos ?? null,
        commits: fetched.commits ?? cached?.stats?.commits ?? null,
      };
      writeCache(user, stats);
      return stats;
    })
    .catch((err) => {
      // A stale number beats no number; only a cold cache surfaces the error.
      if (cached) return cached.stats;
      throw err;
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

// Live numbers for the current content, or nulls when unavailable.
// `force` is for the admin: it fetches even while every stat is still manual,
// so the owner can see what the live values would be before switching one over,
// and it skips the cache so the panel always shows what GitHub says right now
// rather than whatever the last visit happened to store.
export function useGithubStats({ force = false } = {}) {
  const { content } = useContent();
  const user = githubUserFromContent(content);
  const wanted = force || usesGithubStats(content);

  const [state, setState] = useState(() => ({
    stats: user ? readCache(user)?.stats ?? null : null,
    loading: false,
    error: '',
  }));

  useEffect(() => {
    if (!user || !wanted) return;
    let alive = true;
    setState((prev) => ({ ...prev, loading: true, error: '' }));
    loadGithubStats(user, { fresh: force })
      .then((stats) => alive && setState({ stats, loading: false, error: '' }))
      .catch((err) =>
        alive && setState({ stats: null, loading: false, error: err.message || 'GitHub is unreachable' }),
      );
    return () => {
      alive = false;
    };
  }, [user, wanted, force]);

  return { ...state, user };
}

// What a stat should display. The typed value is both the offline fallback and
// the format hint: a leading '+' or '~' is kept on the live number too.
export function statValue(stat, live) {
  const key = SOURCE_KEYS[stat?.source];
  const n = key ? live?.[key] : null;
  if (typeof n !== 'number') return stat?.value ?? '';
  const [prefix = ''] = String(stat.value ?? '').match(/^\D*/) ?? [];
  return `${prefix}${n.toLocaleString('en-US')}`;
}
