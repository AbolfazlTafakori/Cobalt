import { useContent } from '../../content/ContentContext';

// Shared stats strip used on both the Home hero and the About section.
export default function StatsBar({ className = '' }) {
  const { content } = useContent();
  const stats = content.stats;
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/[0.03] ${className}`}
    >
      <dl className="grid grid-cols-2 divide-white/10 lg:grid-cols-4 lg:divide-x">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`px-6 py-11 text-center sm:py-12 ${
              i < 2 ? 'border-b border-white/10 lg:border-b-0' : ''
            } ${i % 2 === 1 ? 'border-l border-white/10 lg:border-l' : ''}`}
          >
            <dt className="text-4xl font-bold text-brand sm:text-5xl">
              {stat.value}
            </dt>
            <dd className="mt-2.5 text-sm text-slate-400 sm:text-base">
              {stat.label}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
