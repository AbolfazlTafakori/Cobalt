import { useContent } from '../../content/ContentContext';
import { useGithubStats, statValue } from '../../content/githubStats';

// Shared stats strip used on both the Home hero and the About section.
export default function StatsBar({ className = '' }) {
  const { content } = useContent();
  const stats = content.stats;
  const { stats: live } = useGithubStats();
  return (
    <div
      className={`rounded-2xl border border-edge/10 bg-panel/70 shadow-card backdrop-blur-xl ${className}`}
    >
      <dl className="grid grid-cols-2 divide-edge/10 lg:grid-cols-4 lg:divide-x">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`px-6 py-11 text-center sm:py-12 ${
              i < 2 ? 'border-b border-edge/10 lg:border-b-0' : ''
            } ${i % 2 === 1 ? 'border-l border-edge/10 lg:border-l' : ''}`}
          >
            <dt className="text-4xl font-bold text-accent sm:text-5xl">
              {statValue(stat, live)}
            </dt>
            <dd className="mt-2.5 text-sm text-fg-muted sm:text-base">
              {stat.label}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
